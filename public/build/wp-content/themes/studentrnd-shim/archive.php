<?php

if (!class_exists('Timber')){
    echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
}

$context = Timber::get_context();

if (is_day()){
    $context['archive_date'] = get_the_date( 'D M Y' );
} else if (is_month()){
    $context['archive_date'] = get_the_date( 'M Y' );
} else if (is_year()){
    $context['archive_date'] = get_the_date( 'Y' );
} else if (is_tag()){
    $context['archive_tag'] = single_tag_title('', false);
} else if (is_category()){
    $context['archive_tag'] = single_cat_title('', false);
} else if (is_post_type_archive()){
    $context['archive_title'] = post_type_archive_title('', false);
}


$context['categories'] = Timber::get_terms('category');
$context['posts'] = Timber::get_posts();
$context['pagination'] = Timber::get_pagination();


Timber::render('pages/blog/archive.twig', $context);