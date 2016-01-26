<?php

\Route::get('press/release/{release}', 'StaticController@getPressRelease');
\Route::controller('', 'StaticController');