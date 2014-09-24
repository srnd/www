<?php

if (!class_exists('Timber')){
    echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
}

$context = Timber::get_context();
$context['posts'] = Timber::get_posts();
$context['pagination'] = Timber::get_pagination();

$author = new TimberUser($wp_query->query_vars['author']);
$context['author'] = $author;
$context['archive_title'] = $author->display_name;

Timber::render('pages/blog/archive.twig', $context);