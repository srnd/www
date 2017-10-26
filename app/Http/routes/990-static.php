<?php
\Route::get('/contact/tyler', 'StaticController@getContactMeet');
\Route::get('/conduct/enforcement', 'StaticController@getConductEnforcement');
\Route::get('/conduct/report', 'StaticController@getConductReport');
\Route::controller('', 'StaticController');
