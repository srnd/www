<?php

return [
    'twig' => [
        'extension'   => 'haml',
        'environment' => [
            'debug'               => true,
            'charset'             => 'utf-8',
            'base_template_class' => TwigBridge\Twig\Template::class,
            'cache'               => null,
            'auto_reload'         => true,
            'strict_variables'    => false,
            'autoescape'          => 'html',
            'optimizations'       => -1,
        ],

        'globals' => [
            'version'    => filemtime(implode(DIRECTORY_SEPARATOR, [public_path(), 'assets', 'css', 'style.css'])),
            'requestUrl' => strpos(php_sapi_name(), 'cli') === false ? request()->url() : null,
        ],
    ],

    'extensions' => [

        'enabled' => [
            TwigBridge\Extension\Loader\Facades::class,
            TwigBridge\Extension\Loader\Filters::class,
            TwigBridge\Extension\Loader\Functions::class,

            TwigBridge\Extension\Laravel\Config::class,
            TwigBridge\Extension\Laravel\Dump::class,
            TwigBridge\Extension\Laravel\Input::class,
            TwigBridge\Extension\Laravel\Session::class,
            TwigBridge\Extension\Laravel\Str::class,
            TwigBridge\Extension\Laravel\Translator::class,
            TwigBridge\Extension\Laravel\Url::class,
            MtHaml\Support\Twig\Extension::class,
            StudentRND\Extensions\LangExtension::class,
            \DPolac\TwigLambda\LambdaExtension::class,
        ],

        'facades'   => [],
        'functions' => [
            'elixir',
            'head',
            'last',
        ],
        'filters' => [
            'get' => 'data_get',
        ],
    ],
];
