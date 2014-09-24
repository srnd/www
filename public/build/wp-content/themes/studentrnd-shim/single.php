<?php

if (!class_exists('Timber')){
    echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
}

$context = Timber::get_context();
$context['posts'] = Timber::get_posts();
$context['post'] = $context['posts'][0];
$context['comment_form'] = TimberHelper::get_comment_form();
$context['is_preview'] = is_preview();
$context['edit_link'] = admin_url(sprintf(get_post_type_object($context['post']->post_type )->_edit_link.'&action=edit', $context['post']->ID));

$is_press = false;
foreach (get_the_category($context['post']->ID) as $category) {
    if ($category->slug == 'press') {
        $is_press = true;
    }
}

$context['sharer'] = [];

$sites = ['twitter', 'twitter_via', 'reddit', 'hn'];
foreach ($sites as $site) {
    $value = get_post_meta($context['post']->ID, '_studentrnd_sharer_'.$site, true);
    if ($value) {
        $context['sharer'][$site] = $value;
    } else {
        if ($site == 'twitter_via') {
            $context['sharer'][$site] = 'studentrnd';
        } else {
            $context['sharer'][$site] = $context['post']->title();
        }
    }

    $context['sharer'][$site] = html_entity_decode($context['sharer'][$site], ENT_QUOTES, 'UTF-8');

    if ($site == 'reddit') {
        $context['sharer'][$site] = addcslashes($context['sharer'][$site], '\'');
    } else {
        $context['sharer'][$site] = htmlspecialchars($context['sharer'][$site], ENT_QUOTES);
    }
}

$canonical = get_post_meta($context['post']->ID, '_studentrnd_canonical', true);
if ($canonical) {
    $context['canonical'] = $canonical;
}

$video = get_post_meta($context['post']->ID, '_studentrnd_video', true);
if ($video) {
    $context['video'] = $video;
}

$context['social'] = [
    'twitter_title' => $context['post']->title(),
    'twitter_description' => $context['post']->get_preview(50, true, false, true),
    'fb_title' => $context['post']->title(),
    'fb_description' => $context['post']->get_preview(50, true, false, true)
];

foreach (['fb_title', 'fb_description', 'twitter_title', 'twitter_description'] as $field) {
    $value = get_post_meta($context['post']->ID, '_studentrnd_social_'.$field, true);
    if ($value) {
        $context['social'][$field] = htmlspecialchars($value, ENT_QUOTES);
    }
}

$cta = get_post_meta($context['post']->ID, '_studentrnd_cta_requested', true);
$context['cta'] = $cta;
Timber::render('pages/blog/post.twig', $context);