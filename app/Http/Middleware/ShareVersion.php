<?php

namespace StudentRND\Http\Middleware;

class ShareVersion
{
    public function handle($request, \Closure $next)
    {
        \View::share('version', trim(@file_get_contents(dirname(dirname(dirname(dirname(__FILE__)))).'/.version')));

        return $next($request);
    }
}
