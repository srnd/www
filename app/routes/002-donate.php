<?php

\Route::model('donation', '\Www\Models\Donation');
\Route::get('donate/receipt/{donation}', 'DonateController@getReceipt');

\Route::get('donate', 'DonateController@getIndex');
\Route::post('donate', 'DonateController@postIndex');
\Route::get('donate/dwolla/return', 'DonateController@getDwollaReturn');