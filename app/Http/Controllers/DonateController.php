<?php
namespace StudentRND\Http\Controllers;

use \Carbon\Carbon;
use \StudentRND\Models;
use \StudentRND\Services;

class DonateController extends \StudentRND\Http\Controller {
    private $donation_info;

    public function getIndex()
    {
        if (\Input::has('utm_campaign')) {
            \Session::set('donate_campaign', \Input::get('utm_campaign'));
        }
        return $this->makeDonationPage();
    }

    public function postIndex()
    {
        if (\Input::has('stripe_token') && \Input::get('frequency') !== 'onetime') {
            return $this->stripeCheckoutRecurring();
        } else if (\Input::has('stripe_token') && \Input::get('frequency') === 'onetime') {
            return $this->stripeCheckoutOneTime();
        } else {
            return $this->makeDonationPage();
        }
    }

    public function getReceipt()
    {
        return \View::make('pages/donate/receipt', [
            'donation' => \Route::input('donation'),
            'just_donated' => \Session::get('just_donated', false),
            'just_subscribed' => \Session::get('just_subscribed', false),
            'just_cancelled' => \Session::get('just_cancelled', false)
        ]);
    }

    public function postStripeIncoming()
    {
        \Stripe::setApiKey(\Config::get('stripe.secret'));
        $event = json_decode(file_get_contents('php://input'));
        //\Stripe_Event::retrieve($event->id); // Validate event

        if ($event->type !== 'invoice.payment_succeeded') return 'Incorrect event type.';

        $invoice = $event->data->object;
        $previous_customer_id = $invoice->customer;

        $otherDonation = Models\Donation::where('transaction_subscription_id', '=', $previous_customer_id)->first();
        $user = [
            'first_name' => $otherDonation->first_name,
            'last_name' => $otherDonation->last_name,
            'email' => $otherDonation->email,
            'amount' => $otherDonation->amount,
            'is_recurring' => false,
            'address_1' => $otherDonation->address1,
            'city' => $otherDonation->city,
            'state' => $otherDonation->state,
            'zip' => $otherDonation->zip,
            'reward' => null,
            'reward_option' => null,
            'for' => $otherDonation->for
        ];

        $donation = $this->createDonationRecord('stripe', $invoice->charge, $previous_customer_id, $user);
        try {
            $this->mailDonationReceipt($donation, true);
        } catch (\Exception $ex) {}
    }

    public function postCancelSubscription()
    {
        $donation = \Route::input('donation');

        \Stripe::setApiKey(\Config::get('stripe.secret'));
        $customer = \Stripe_Customer::retrieve($donation->transaction_subscription_id);
        $customer->delete();

        // Mark all donations as having their subscription cancelled
        $previousDonations = Models\Donation
            ::where('transaction_subscription_id', '=', $donation->transaction_subscription_id)->get();
        foreach ($previousDonations as $previousDonation) {
            $previousDonation->cancelled_at = Carbon::now();
            $previousDonation->save();
        }

        \Session::flash('just_cancelled', true);
        return \Redirect::to('/donate/receipt/'.$donation->id);
    }

    // ====== STRIPE ======

    public function stripeCheckoutRecurring()
    {
        $requirements_check = $this->containsAllRequired(['stripe_token']);
        if (!$requirements_check->success) {
            return $this->makeDonationPage($requirements_check->errors);
        }

        $user = $this->getDonationInfo();

        // Set up the payment profile and start collecting monthly donations
        \Stripe::setApiKey(\Config::get('stripe.secret'));

        try {
            // Get a plan for the recurring billing
            $plan = 'donation_monthly_'.$user['amount'];
            try {
                \Stripe_Plan::retrieve($plan);
            } catch (\Stripe_Error $e) {
                \Stripe_Plan::create([
                    "amount" => $user['amount'] * 100, // in cents
                    "currency" => "usd",
                    "interval" => "month",
                    "id" => $plan,
                    "name" => '$'.$user['amount'].' monthly donation'
                ]);
            }

            // Create a subscription
            $nextBill = Carbon::now()->addMonth();
            $cust = \Stripe_Customer::create([
                'description' => '$'.$user['amount'].'/mo donation for '.$user['first_name'].' '.$user['last_name'],
                'source' => $user['stripe_token'],
                'plan' => $plan,
                'email' => $user['email'],
                'trial_end' => $nextBill->timestamp
            ]);

            // Create the first charge
            $charge = \Stripe_Charge::create([
                "amount" => $user['amount'] * 100, // in cents
                "currency" => "usd",
                "customer" => $cust,
                "description" => 'Online donation',
                "statement_description" => "DONATION"
            ]);

        } catch (\Stripe_CardError $e) {
            return $this->makeDonationPage(['Your card was declined.']);
        } catch (\Exception $e) {
            return $this->makeDonationPage(['Sorry, our payment gateway reported an error. Please try again. Details:', $e->getMessage()]);
        }

        // Create the transaction record
        try {
            $donation_record = $this->createDonationRecord('stripe', $charge->id, $cust->id);
        } catch (\Exception $ex) {
            $charge->refunds->create();
            return $this->makeDonationPage(["Something went wrong on our side; we're looking into it. Your card was not charged.", $ex->getMessage()]);
        }

        // Try to track events and send the email
        $this->optionalStep(function() {
            $this->trackDonateEvents();
        });
        $this->optionalStep(function() use ($donation_record) {
            $this->mailDonationReceipt($donation_record);
        });

        // Redirect to the transaction complete page
        \Session::flash('just_subscribed', true);
        return \Redirect::to('/donate/receipt/'.$donation_record->id);
    }

    /**
     * Processes the Stripe transaction and redirects the user to the receipt page.
     */
    public function stripeCheckoutOneTime()
    {
        $requirements_check = $this->containsAllRequired(['stripe_token']);
        if (!$requirements_check->success) {
            return $this->makeDonationPage($requirements_check->errors);
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
                "statement_description" => "DONATION"
            ]);
        }  catch(\Stripe_CardError $e) {
            return $this->makeDonationPage(['Your card was declined.']);
        } catch (\Exception $e) {
            return $this->makeDonationPage(['Sorry, our payment gateway reported an error. Please try again. Details:', $e->getMessage()]);
        }

        // Create the transaction record
        try {
            $donation_record = $this->createDonationRecord('stripe', $charge->id);
        } catch (\Exception $ex) {
            $charge->refunds->create();
            return $this->makeDonationPage(["Something went wrong on our side; we're looking into it. Your card was not charged.", $ex->getMessage()]);
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
            '$email'            => $user['email']
        ]);
        $mp->track('donated', [
            'amount'            => $user['amount'],
            'campaign'          => \Session::get('donation_campaign')
        ]);
        $mp->people->setOnce($user['email'], [
            'source'            => 'donate'
        ]);
        $mp->people->trackCharge($user['email'], $user['amount']);
    }

    /**
     * Tracks the donation in the database
     *
     * @param $transaction_source The payment gateway, one of: [stripe, paypal, dwolla]
     * @param $transaction_id The payment gateway's transaction ID
     * @param $transaction_subscription_id The subscription ID of the payment, if any
     * @return Models\Donation The donation record in the database
     */
    private function createDonationRecord($transaction_source, $transaction_id, $transaction_subscription_id = null, $user = null)
    {
        if (!$user) {
            $user = $this->getDonationInfo();
        }

        $donation = new Models\Donation;
        $donation->amount = $user['amount'];
        $donation->is_recurring = $user['is_recurring'];
        $donation->first_name = $user['first_name'];
        $donation->last_name = $user['last_name'];
        $donation->address_1 = $user['address_1'];
        $donation->city = $user['city'];
        $donation->state = $user['state'];
        $donation->zip = $user['zip'];
        $donation->reward = $user['reward'] !== 'none' ? $user['reward'] : null;
        $donation->reward_option = $user['reward_option'];
        $donation->email = $user['email'];
        $donation->for = $user['for'];

        $donation->transaction_source = $transaction_source;
        $donation->transaction_id = $transaction_id;
        $donation->transaction_subscription_id = $transaction_subscription_id;

        $donation->save();
        return $donation;
    }

    /**
     * Sends the donor a receipt
     *
     * @param Models\Donation $donation_record The record of the donation
     */
    private function mailDonationReceipt(Models\Donation $donation_record, $isSubscriptionGenerated = false)
    {
        Services\Email::Send(
            $donation_record->first_name, $donation_record->email,
            'srnd.org', 'donate@srnd.org',
            'Receipt for Your '.($isSubscriptionGenerated?'Recurring ':'').'Donation',
            \View::make($isSubscriptionGenerated ? 'emails/donation_thanks_recurring' : 'emails/donation_thanks', [ 'donation' => $donation_record ])->render(),
            false,
            'tylermenezes@srnd.org');
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
        $input[] = 'frequency';

        $errors = [];
        foreach ($input as $required) {
            if (!\Input::has($required)) {
                $errors[] = ucwords(str_replace('_', ' ', $required)).' is required.';
            }
        }

        if (count($errors) > 0) {
            return (object)[
                'success' => false,
                'errors' => $errors
            ];
        }

        if (intval(\Input::get('amount')) < 1) {
            return (object)[
                'success' => false,
                'errors' => ['Amount must be greater than $1. ($'.\Input::get('amount').' provided.)']
            ];
        }

        return (object)[
            'success' => true,
            'errors' => []
        ];
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
            'address_1' => \Input::get('address_1'),
            'city' => \Input::get('city'),
            'state' => \Input::get('state'),
            'zip' => \Input::get('zip'),
            'reward' => \Input::get('reward'),
            'reward_option' => \Input::get('reward-'.\Input::get('reward').'-option'),
            'email' => \Input::get('email'),
            'stripe_token' => \Input::get('stripe_token'),
            'for' => \Input::get('for')
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
            'show_opt_out' => \Session::has('donate_campaign'),
            'gifts' => iterator_to_array(self::getGifts()),
            'ref' => \Input::get('ref')
        ]));
    }


    /**
     * Gets a list of available gifts with translation information.
     */
    private static function getGifts()
    {
        if (\Input::get('ref') === 'sponsor') {
            yield 'sponsor' => [
                'name' => trans('donate-gifts.sponsor-name'),
                'description' => trans('donate-gifts.sponsor-description'),
                'image' => '/assets/img/donate-gifts/sponsor-small.jpg',
                'limage' => '/assets/img/donate-gifts/sponsor-large.jpg',
                'today' => 100,
                'recur' => 100
            ];
        } else {
            $gifts = yaml_parse_file(config_path().'/gifts.yml');
            foreach ($gifts as $k => $v) {
                $v['name'] = trans('donate-gifts.'.$k.'-name');
                $v['description'] = trans('donate-gifts.'.$k.'-description');
                $v['image'] = '/assets/img/donate-gifts/'.$k.'-small.jpg';
                $v['limage'] = '/assets/img/donate-gifts/'.$k.'-large.jpg';
                yield $k => $v;
            }
        }
    }
} 
