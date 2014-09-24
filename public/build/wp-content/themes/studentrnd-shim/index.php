<?php

if (!class_exists('Timber')){
    echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
}


global $paged;
if (!isset($paged) || !$paged){
    $paged = 1;
}


$context = Timber::get_context();

$ignore_slugs = ['press', 'rm'];

$ignore_ids = [];
foreach ($ignore_slugs as $slug) {
    if (get_category_by_slug($slug)) {
        $ignore_ids[] = '-'.get_category_by_slug($slug)->term_id;
    }
}
$cat = implode(',', $ignore_ids);

$args = array(
    'cat' => $cat,
    'paged' => $paged
);
query_posts($args);

$context['posts'] = Timber::get_posts();
$context['categories'] = Timber::get_terms('category');
$context['pagination'] = Timber::get_pagination();
$context['page'] = $paged;

Timber::render('pages/blog/index.twig', $context);
