<?php

namespace StudentRND\TwigMarkdown;

if (!defined('ENT_SUBSTITUTE')) {
    define('ENT_SUBSTITUTE', 8);
}

/**
 * 
 * 
 * @author      Tyler Menezes <tylermenezes@gmail.com>
 * @copyright   Copyright (c) Tyler Menezes. Released under the Perl Artistic License 2.0.
 *
 * @package TwigMarkdown
 */
class Extension extends \Twig_Extension
{
    public function getFilters()
    {
        $filters = array(
            // formatting filters
            'markdown'=> new \Twig_Filter_Function(function($data)
            {
                include_once dirname(__FILE__) . '/markdown.php';
                return \Markdown($data);
            }),
        );

        return $filters;
    }

    public function getName()
    {
        return 'markdown';
    }

}

