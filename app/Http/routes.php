<?php

foreach (glob(implode(DIRECTORY_SEPARATOR, [__DIR__, "filters", "*.php"])) as $filename) {
    include($filename); // We use include instead of include_once anywhere that doesn't define a class because if we
                        // don't, Laravel breaks when we try to run tests.
}

$routes = function(){
    foreach (glob(implode(DIRECTORY_SEPARATOR, [__DIR__, 'routes', "*.php"])) as $filename) {
        include($filename);
    }
};


\View::share('nonLangUri', '/'.request()->path());
\Route::bind('locale', function($locale) {
    \App::setLocale($locale);
    \View::share('lang', $locale); 
    \View::share('langPrefix', '/'.$locale); 
    \View::share('nonLangUri', substr(request()->path(), strlen($locale)));
    @session_start();
    $_SESSION['lang'] = $locale;
});
\Route::any('/en', function() {
    @session_start();
    $_SESSION['lang'] = '';
    return \redirect('/');
});
\Route::any('/en/{rest}', function($rest) {
    @session_start();
    $_SESSION['lang'] = '';
    return \redirect($rest);
})->where('rest', '(.*)?');

\Route::group(['prefix' => '/{locale}'], $routes);
\Route::group(['prefix' => '/', 'middleware' => 'default-lang'], $routes);
