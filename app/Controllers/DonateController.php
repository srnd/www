<?php
namespace Www\Controllers;

use \Www\Models;

class DonateController extends \Controller {
    private $donation_info;

    public function getIndex()
    {
        return $this->makeDonationPage();
    }

    public function postIndex()
    {
        if (\Input::get('payment_method') === 'stripe') {
            return $this->stripeCheckout();
        } else if (\Input::get('payment_method') === 'dwolla') {
            return $this->dwollaCheckout();
        } else {
            return $this->makeDonationPage();
        }
    }

    public function getReceipt()
    {
        return \View::make('pages/donate/receipt', [
            'donation' => \Route::input('donation'),
            'just_donated' => \Session::get('just_donated', false)
        ]);
    }

    /**
     * Processes the Stripe transaction and redirects the user to the receipt page.
     */
    public function stripeCheckout()
    {
        if (!$this->containsAllRequired(['stripe_token'])) {
            return $this->makeDonationPage(['All fields are required.']);
        }

        $user = $this->getDonationInfo();

        // Process the Stripe transaction
        \Stripe::setApiKey(\Config::get('stripe.secret'));

        try {
            $charge = \Stripe_Charge::create([
                "amount" => $user['amount'] * 100, // in cents
                "currency" => "usd",
                "card"  => $user['stripe_token'],
                "description" => 'Online donation',
                "statement_description" => "SRND DONATION"
            ]);
        }  catch(\Stripe_CardError $e) {
            return $this->makeDonationPage(['Your card was declined.']);
        } catch (\Exception $e) {
            return $this->makeDonationPage(['Sorry, our payment gateway reported an error. Please try again.']);
        }

        // Create the transaction record
        try {
            $donation_record = $this->createDonationRecord('stripe', $charge->id);
        } catch (\Exception $ex) {
            $charge->refunds->create();
            return $this->makeDonationPage(["Something went wrong on our side; we're looking into it. Your card was not charged."]);
        }

        // Try to track events and send the email
        $this->optionalStep(function() {
            $this->trackDonateEvents();
        });
        $this->optionalStep(function() use ($donation_record) {
            $this->mailDonationReceipt($donation_record);
        });

        // Redirect to the transaction complete page
        \Session::flash('just_donated', true);
        return \Redirect::to('/donate/receipt/'.$donation_record->id);
    }

    /* ====== DWOLLA ====== */

    /**
     * Creates a Dwolla cart and redirects the user to the payment page.
     */
    public function dwollaCheckout()
    {
        if (!$this->containsAllRequired()) {
            return $this->makeDonationPage(['All fields except card information are required.']);
        }

        $user = $this->getDonationInfo();

        $dc = new \Dwolla\Checkouts();
        \Dwolla\Checkouts::$settings = $this->getDwollaSettings();

        $dc->addToCart("Donation", "Donation", $user['amount'], 1);
        $cart = $dc->create(
            [ 'destinationId' => \Config::get('dwolla.account_id') ],
            [ 'redirect' => \URL::to('/donate/dwolla/return') ]
        );

        \Cache::put('dwolla.checkout.'.$cart['CheckoutId'], $user, 120);

        if (\Config::get('dwolla.sandbox')) {
            return \Redirect::to('https://uat.dwolla.com/payment/checkout/'.$cart['CheckoutId']);
        } else {
            return \Redirect::to('https://www.dwolla.com/payment/checkout/'.$cart['CheckoutId']);
        }
    }

    /**
     * Verifies the Dwolla cart and redirects the user to the receipt.
     */
    public function getDwollaReturn()
    {
        $checkoutId = \Input::get('checkoutId');
        $user = \Cache::get('dwolla.checkout.'.$checkoutId);

        if (!$user) {
            return "No such transaction";
        }

        $dc = new \Dwolla\Checkouts();
        $dc->settings = $this->getDwollaSettings();
        \Dwolla\Checkouts::$settings = $this->getDwollaSettings();

        if (!$dc->verify(\Input::get('signature'), $checkoutId, $user['amount'])) {
            return "Dwolla signature mismatch.";
        }

        if (\Input::get('error') ) {
            \Session::flash('donation_info', $user);
            return \Redirect::to('/donate');
        }

        $this->donation_info = $user;
        $donation_record = $this->createDonationRecord('dwolla', \Input::get('destinationTransaction'));
        \Cache::forget('dwolla.checkout.'.$checkoutId);

        // Try to track events and send the email
        $this->optionalStep(function() {
            $this->trackDonateEvents();
        });
        $this->optionalStep(function() use ($donation_record) {
            $this->mailDonationReceipt($donation_record);
        });

        // Redirect to the transaction complete page
        \Session::flash('just_donated', true);
        return \Redirect::to('/donate/receipt/'.$donation_record->id);
    }

    /**
     * Sets Dwolla account settings
     *
     * @return \Dwolla\Settings
     */
    private function getDwollaSettings()
    {
        $settings = new \Dwolla\Settings();
        $settings->client_id = \Config::get('dwolla.client_id');
        $settings->client_secret = \Config::get('dwolla.client_secret');
        $settings->sandbox = \Config::get('dwolla.sandbox');
        $settings->debug = \Config::get('app.debug');

        return $settings;
    }

    /**
     * Prevents exceptions from bubbling up when $callable is called if debugging is turned off.
     *
     * @param $callable The function to execute
     */
    private function optionalStep(callable $callable)
    {
        if (\Config::get('app.debug')) {
            $callable();
        } else {
            try {
                $callable();
            } catch (\Exception $ex) {}
        }
    }

    /**
     * Sends donation events to Mixpanel and Customer.io
     */
    private function trackDonateEvents()
    {
        $user = $this->getDonationInfo();

        // Track in Mixpanel:
        $mp = \Mixpanel::getInstance(\Config::get('mixpanel.token'));
        $mp->identify($user['email']);
        $mp->people->set($user['email'], [
            '$first_name'       => $user['first_name'],
            '$last_name'        => $user['last_name'],
            '$email'            => $user['email'],
            'donation_opt_out'  => $user['opt_out']
        ]);
        $mp->track('donated', [
            'amount'            => $user['amount'],
            'is_anonymous'      => $user['is_anonymous']
        ]);
        $mp->people->setOnce($user['email'], [
            'source'            => 'donate'
        ]);
        $mp->people->trackCharge($user['email'], $user['amount']);


        // Track in Customer.io
        $cio = new \Customerio\Api(\Config::get('customerio.site_id'), \Config::get('customerio.api_key'),
            new \Customerio\Request);
        $cio->createCustomer($user['email'], $user['email'], [
            'first_name'        => $user['first_name'],
            'last_name'         => $user['last_name'],
            'donation_opt_out'  => $user['opt_out']
        ]);
        $cio->fireEvent($user['email'], 'donated', [
            'amount'            => $user['amount'],
            'is_anonymous'      => $user['is_anonymous']
        ]);
    }

    /**
     * Tracks the donation in the database
     *
     * @param $transaction_source The payment gateway, one of: [stripe, paypal, dwolla]
     * @param $transaction_id The payment gateway's transaction ID
     * @return Models\Donation The donation record in the database
     */
    private function createDonationRecord($transaction_source, $transaction_id)
    {
        $user = $this->getDonationInfo();

        $donation = new Models\Donation;
        $donation->amount = $user['amount'];
        $donation->is_recurring = $user['is_recurring'];
        $donation->first_name = $user['first_name'];
        $donation->last_name = $user['last_name'];
        $donation->email = $user['email'];
        $donation->address_1 = $user['address_1'];
        $donation->address_2 = $user['address_2'];
        $donation->city = $user['city'];
        $donation->state = $user['state'];
        $donation->zip = $user['zip'];
        $donation->is_anonymous = $user['is_anonymous'];
        $donation->opt_out = $user['opt_out'];

        $donation->transaction_source = $transaction_source;
        $donation->transaction_id = $transaction_id;

        $donation->save();
        return $donation;
    }

    /**
     * Sends the donor a receipt
     *
     * @param Models\Donation $donation_record The record of the donation
     */
    private function mailDonationReceipt(Models\Donation $donation_record)
    {
        // TODO
    }

    /**
     * Checks whether the request contains all required transaction parameters. Includes some default
     * parameters required for insertion into the database.
     *
     * @param array $input
     * @return bool
     */
    private function containsAllRequired($input = [])
    {
        $input[] = 'amount';
        $input[] = 'first_name';
        $input[] = 'last_name';
        $input[] = 'email';
        $input[] = 'address_1';
        $input[] = 'city';
        $input[] = 'state';
        $input[] = 'zip';

        foreach ($input as $required) {
            if (!\Input::has($required)) {
                return false;
            }
        }

        if (intval(\Input::get('amount')) < 1) {
            return false;
        }

        return true;
    }

    /**
     * Gets donation properties from the request
     *
     * @return array
     */
    private function getDonationInfo()
    {
        if ($this->donation_info) {
            return $this->donation_info;
        }

        if (\Session::has('donation_info')) {
            return \Session::get('donation_info');
        }

        return [
            'amount' => intval(\Input::get('amount')) ? intval(\Input::get('amount')) : null,
            'is_recurring' => \Input::get('is_recurring') ? true : false,
            'first_name' => \Input::get('first_name'),
            'last_name' => \Input::get('last_name'),
            'email' => \Input::get('email'),
            'address_1' => \Input::get('address_1'),
            'address_2' => \Input::get('address_2'),
            'city' => \Input::get('city'),
            'state' => \Input::get('state'),
            'zip' => \Input::get('zip'),
            'stripe_token' => \Input::get('stripe_token'),
            'is_anonymous' => \Input::get('is_anonymous') ? true : false,
            'opt_out' => \Input::get('opt_out') ? true : false
        ];
    }

    /**
     * Creates the donation page from the current request and a list of errors, if any
     *
     * @param array $errors
     * @return mixed
     */
    private function makeDonationPage($errors = [])
    {
        return \View::make('pages/donate/index', array_merge($this->getDonationInfo(), [
            'errors' => $errors,
            'stripe_public' => \Config::get('stripe.public'),
            'show_opt_out' => \Session::has('donate_campaign')
        ]));
    }
} 