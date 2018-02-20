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
        $host = $request->getHost();
        $tld = substr($host, strrpos($host, '.') + 1);
        switch ($tld) {
            case 'es':
            case 'xes':
                $locale = 'es';
                $country = 'us';
                break;
            case 'ca':
            case 'xca':
                $locale = 'en_CA';
                $country = 'ca';
                break;
            default:
                $locale = 'en';
                $country = 'us';
                break;
        }

        \App::setLocale($locale);
        \View::share('lang', $locale);
        \View::share('country', $country);
        \View::share('domain', $host);

        return $next($request);
    }
}
