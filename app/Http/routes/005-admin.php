<?php

\Route::model('event', '\StudentRND\Models\Event');
\Route::model('release', '\StudentRND\Models\PressRelease');

\Route::group(['prefix' => 'admin', 'namespace' => 'Admin', 'before' => 'admin'], function () {
    \Route::get('events', 'EventsController@getIndex');
    \Route::post('events/load', 'EventsController@postLoad');
    \Route::get('events/new', 'EventsController@getNew');
    \Route::post('events/new', 'EventsController@postNew');
    \Route::get('events/e/{event}', 'EventsController@getEdit');
    \Route::post('events/e/{event}', 'EventsController@postEdit');

    \Route::get('press-releases', 'PressReleaseController@getIndex');
    \Route::get('press-releases/new', 'PressReleaseController@getNew');
    \Route::post('press-releases/new', 'PressReleaseController@postNew');
    \Route::get('press-releases/{release}/edit', 'PressReleaseController@getEdit');
    \Route::post('press-releases/{release}/edit', 'PressReleaseController@postEdit');
    \Route::post('press-releases/{release}/delete', 'PressReleaseController@postDelete');

    \Route::controller('donations', 'DonationsController');
    \Route::controller('email', 'EmailController');
});
