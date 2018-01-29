<?php

namespace StudentRND\Http\Middleware;

use Closure;

class DefaultLang
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     * @param string|null              $guard
     *
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $tld = substr($request->getHost(), strrpos($request->getHost(), '.') + 1);
        switch ($tld) {
            case 'es':
            case 'esdev':
                $locale = 'es';
                break;
            default:
                $locale = 'en';
                break;
        }

        \App::setLocale($locale);
        \View::share('lang', $locale);

        return $next($request);
    }
}
