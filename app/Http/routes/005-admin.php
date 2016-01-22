<?php

\Route::model('event', '\StudentRND\Models\Event');

\Route::group(['prefix' => 'admin', 'namespace' => 'Admin', 'before' => 'admin'], function(){
    \Route::get('events', 'EventsController@getIndex');
    \Route::post('events/load', 'EventsController@postLoad');
    \Route::get('events/new', 'EventsController@getNew');
    \Route::post('events/new', 'EventsController@postNew');
    \Route::get('events/e/{event}', 'EventsController@getEdit');
    \Route::post('events/e/{event}', 'EventsController@postEdit');

    \Route::controller('donations', 'DonationsController');
});