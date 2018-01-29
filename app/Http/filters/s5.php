<?php

$api = new \s5\API(\Config::get('s5.token'), \Config::get('s5.secret'));

\Route::filter('admin', function () use ($api) {
    $api->RequireLogin();

    if (!$api->User->me()->is_admin) {
        \App::abort(401);
    }
});
