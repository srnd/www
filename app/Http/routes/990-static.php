<?php
\Route::get('/contact/tyler', 'StaticController@getContactMeet');
\Route::get('/conduct/enforcement', 'StaticController@getConductEnforcement');
\Route::controller('', 'StaticController');
