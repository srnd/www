<?php

namespace StudentRND\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $haml = new \MtHaml\Environment('twig', ['enable_escaper' => false]);
        $hamlLoader = new \MtHaml\Support\Twig\Loader($haml, \Twig::getLoader());
        \Twig::setLoader($hamlLoader);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
