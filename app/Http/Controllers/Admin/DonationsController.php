<?php

namespace StudentRND\Http\Controllers\Admin;

use Carbon\Carbon;
use StudentRND\Models;

class DonationsController extends \StudentRND\Http\Controller
{
    public function getIndex()
    {
        return \View::make('pages/admin/donations', [
            'donations'   => Models\Donation::orderBy('created_at', 'DESC')->get(),
            'subscribers' => Models\Donation
                ::whereRaw('(transaction_subscription_id, created_at) IN (SELECT transaction_subscription_id, MIN(created_at) FROM donations WHERE transaction_subscription_id IS NOT NULL GROUP BY transaction_subscription_id)')
                ->get(),
            'stats' => $this->getStats(),
        ]);
    }

    private function getStats()
    {
        $donationsQuery = \DB::table('donations')
            ->select(\DB::raw('COUNT(amount) as count, SUM(amount) as total, AVG(amount) as average'))
            ->whereNotNull('amount');

        $donationsToday = with(clone $donationsQuery)->where('created_at', '>', Carbon::now()->setTime(0, 0, 0))->first();
        $donationsWeek = with(clone $donationsQuery)->where('created_at', '>', Carbon::now()->setTime(0, 0, 0)->startOfWeek())->first();
        $donationsMonth = with(clone $donationsQuery)->where('created_at', '>', Carbon::now()->setTime(0, 0, 0)->startOfMonth())->first();

        $mrr = \Db::table('donations')
            ->select(\DB::raw('DISTINCT transaction_subscription_id, COUNT(amount) as count, SUM(amount) as total, AVG(amount) as average'))
            ->whereNotNull('transaction_subscription_id')
            ->first();

        return [
            'day'   => $donationsToday,
            'week'  => $donationsWeek,
            'month' => $donationsMonth,
            'mrr'   => $mrr,
        ];
    }

    public function postNew()
    {
        $record = $this->createDonationRecord(\Input::get('transaction_source'), \Input::get('transaction_id'));

        return \Redirect::to('/donate/receipt/'.$record->id);
    }

    /**
     * Gets donation properties from the request.
     *
     * @return array
     */
    private function getDonationInfo()
    {
        return [
            'amount'              => intval(\Input::get('amount')) ? intval(\Input::get('amount')) : 0,
            'is_recurring'        => \Input::get('is_recurring') ? true : false,
            'first_name'          => \Input::get('first_name'),
            'last_name'           => \Input::get('last_name'),
            'email'               => \Input::get('email'),
            'stripe_token'        => \Input::get('stripe_token'),
            'is_anonymous'        => \Input::get('is_anonymous') ? true : false,
            'in_kind_description' => \Input::get('in_kind_description'),
            'for'                 => \Input::get('for'),
        ];
    }

    /**
     * Tracks the donation in the database.
     *
     * @param $transaction_source The payment gateway, one of: [stripe, paypal, dwolla]
     * @param $transaction_id The payment gateway's transaction ID
     * @param $transaction_subscription_id The subscription ID of the payment, if any
     *
     * @return Models\Donation The donation record in the database
     */
    private function createDonationRecord($transaction_source, $transaction_id)
    {
        $user = $this->getDonationInfo();

        $donation = new Models\Donation();
        $donation->amount = $user['amount'];
        $donation->is_recurring = $user['is_recurring'];
        $donation->first_name = $user['first_name'];
        $donation->last_name = $user['last_name'];
        $donation->email = $user['email'];
        $donation->is_anonymous = $user['is_anonymous'];
        $donation->for = $user['for'];
        $donation->in_kind_description = $user['in_kind_description'];

        $donation->transaction_source = $transaction_source;
        $donation->transaction_id = $transaction_id;

        $donation->save();

        return $donation;
    }
}
