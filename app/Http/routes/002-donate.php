<?php

\Route::model('donation', '\StudentRND\Models\Donation');
\Route::get('donate/receipt/{donation}', 'DonateController@getReceipt');
\Route::post('donate/stripe', 'DonateController@postStripeIncoming');
\Route::post('donate/cancel/{donation}', 'DonateController@postCancelSubscription');

\Route::get('donate', 'DonateController@getIndex');
\Route::post('donate', 'DonateController@postIndex');
\Route::get('donate/dwolla/return', 'DonateController@getDwollaReturn');