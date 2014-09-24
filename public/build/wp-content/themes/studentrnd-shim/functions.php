<?php
    add_theme_support('post-thumbnails');

    add_filter('get_twig', function($twig){
        $twig->addFilter('sha256', new Twig_Filter_Function(function($x) {
            return hash('sha256', $x);
        }));
        return $twig;
    });

    if (class_exists('Timber')) {
        Timber::$locations = implode(DIRECTORY_SEPARATOR, [
            dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))),
            'app',
            'views'
        ]);
    }

    function my_function_admin_bar(){ return false; }
    add_filter( 'show_admin_bar', function(){ return false; });

    define('THEME_URL', '/assets');


/* # Social Box */
function studentrnd_social_add_meta_box() {

    $screens = array( 'post', 'page' );

    foreach ( $screens as $screen ) {

        add_meta_box(
            'studentrnd_social_sectionid',
            __( 'Social Descriptions', 'studentrnd_social_textdomain' ),
            'studentrnd_social_meta_box_callback',
            $screen
        );
    }
}
add_action( 'add_meta_boxes', 'studentrnd_social_add_meta_box' );

function studentrnd_social_meta_box_callback( $post ) {

    // Add an nonce field so we can check for it later.
    wp_nonce_field( 'studentrnd_social_meta_box', 'studentrnd_social_meta_box_nonce' );

    /*
     * Use get_post_meta() to retrieve an existing value
     * from the database and use the value for the form.
     */
    $fb_title = get_post_meta( $post->ID, '_studentrnd_social_fb_title', true );
    $fb_description = get_post_meta( $post->ID, '_studentrnd_social_fb_description', true );
    $twitter_title = get_post_meta( $post->ID, '_studentrnd_social_twitter_title', true );
    $twitter_description = get_post_meta( $post->ID, '_studentrnd_social_twitter_description', true );

    echo '<label for="studentrnd_social_fb_title">';
    _e( 'Facebook Title', 'studentrnd_social_textdomain' );
    echo '</label> ';
    echo '<input type="text" name="studentrnd_social_fb_title" id="studentrnd_social_fb_title" value="'.esc_attr($fb_title).'" placeholder="'.esc_attr($post->post_title).'" style="width:100%" />';


    echo '<label for="studentrnd_social_fb_description">';
    _e( 'Facebook Description', 'studentrnd_social_textdomain' );
    echo '</label> ';
    echo '<textarea name="studentrnd_social_fb_description" maxlength="200" style="width:100%;" id="studentrnd_social_fb_description">'.esc_attr($fb_description).'</textarea>';


    echo '<label for="studentrnd_social_twitter_title">';
    _e( 'Twitter Title', 'studentrnd_social_textdomain' );
    echo '</label> ';
    echo '<input type="text" name="studentrnd_social_twitter_title" id="studentrnd_social_twitter_title" value="'.esc_attr($twitter_title).'" placeholder="'.esc_attr($post->post_title).'" style="width:100%" />';

    echo '<label for="studentrnd_social_twitter_description">';
    _e( 'Twitter Description', 'studentrnd_social_textdomain' );
    echo '</label> ';
    echo '<textarea name="studentrnd_social_twitter_description" maxlength="200" style="width:100%;" id="studentrnd_social_twitter_description">'.esc_attr($twitter_description).'</textarea>';
}

function studentrnd_social_save_meta_box_data( $post_id ) {

    /*
     * We need to verify this came from our screen and with proper authorization,
     * because the save_post action can be triggered at other times.
     */

    // Check if our nonce is set.
    if ( ! isset( $_POST['studentrnd_social_meta_box_nonce'] ) ) {
        return;
    }

    // Verify that the nonce is valid.
    if ( ! wp_verify_nonce( $_POST['studentrnd_social_meta_box_nonce'], 'studentrnd_social_meta_box' ) ) {
        return;
    }

    // If this is an autosave, our form has not been submitted, so we don't want to do anything.
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    // Check the user's permissions.
    if ( isset( $_POST['post_type'] ) && 'page' == $_POST['post_type'] ) {

        if ( ! current_user_can( 'edit_page', $post_id ) ) {
            return;
        }

    } else {

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }
    }

    /* OK, its safe for us to save the data now. */

    $fields = ['studentrnd_social_fb_title', 'studentrnd_social_fb_description', 'studentrnd_social_twitter_title', 'studentrnd_social_twitter_description'];

    foreach ($fields as $field) {
        if ( isset( $_POST[$field] ) ) {
            $my_data = sanitize_text_field( $_POST[$field] );
            update_post_meta( $post_id, '_'.$field , $my_data );
        }
    }

}
add_action( 'save_post', 'studentrnd_social_save_meta_box_data' );

/* # Video ID */
function studentrnd_video_add_meta_box() {

    $screens = array( 'post' );

    foreach ( $screens as $screen ) {

        add_meta_box(
            'studentrnd_video_sectionid',
            __( 'Video', 'studentrnd_video_textdomain' ),
            'studentrnd_video_meta_box_callback',
            $screen
        );
    }
}
add_action( 'add_meta_boxes', 'studentrnd_video_add_meta_box' );

function studentrnd_video_meta_box_callback( $post ) {

    // Add an nonce field so we can check for it later.
    wp_nonce_field( 'studentrnd_video_meta_box', 'studentrnd_video_meta_box_nonce' );

    /*
     * Use get_post_meta() to retrieve an existing value
     * from the database and use the value for the form.
     */
    $value = get_post_meta( $post->ID, '_studentrnd_video', true );

    echo '<label for="studentrnd_video">';
    _e( 'Wistia ID', 'studentrnd_video_textdomain' );
    echo '</label> ';
    echo '<input type="text" id="studentrnd_video" name="studentrnd_video" value="'.esc_attr($value).'" />';
}

function studentrnd_video_save_meta_box_data( $post_id ) {

    /*
     * We need to verify this came from our screen and with proper authorization,
     * because the save_post action can be triggered at other times.
     */

    // Check if our nonce is set.
    if ( ! isset( $_POST['studentrnd_video_meta_box_nonce'] ) ) {
        return;
    }

    // Verify that the nonce is valid.
    if ( ! wp_verify_nonce( $_POST['studentrnd_video_meta_box_nonce'], 'studentrnd_video_meta_box' ) ) {
        return;
    }

    // If this is an autosave, our form has not been submitted, so we don't want to do anything.
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    // Check the user's permissions.
    if ( isset( $_POST['post_type'] ) && 'page' == $_POST['post_type'] ) {

        if ( ! current_user_can( 'edit_page', $post_id ) ) {
            return;
        }

    } else {

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }
    }

    /* OK, its safe for us to save the data now. */

    // Make sure that it is set.
    if ( ! isset( $_POST['studentrnd_video'] ) ) {
        return;
    }

    // Sanitize user input.
    $my_data = sanitize_text_field( $_POST['studentrnd_video'] );

    // Update the meta field in the database.
    update_post_meta( $post_id, '_studentrnd_video', $my_data );
}
add_action( 'save_post', 'studentrnd_video_save_meta_box_data' );


/* # Canonical URL */
function studentrnd_canonical_add_meta_box() {

    $screens = array( 'post', 'page' );

    foreach ( $screens as $screen ) {

        add_meta_box(
            'studentrnd_canonical_sectionid',
            __( 'Sharer URL', 'studentrnd_canonical_textdomain' ),
            'studentrnd_canonical_meta_box_callback',
            $screen
        );
    }
}
add_action( 'add_meta_boxes', 'studentrnd_canonical_add_meta_box' );

function studentrnd_canonical_meta_box_callback( $post ) {

    // Add an nonce field so we can check for it later.
    wp_nonce_field( 'studentrnd_canonical_meta_box', 'studentrnd_canonical_meta_box_nonce' );

    /*
     * Use get_post_meta() to retrieve an existing value
     * from the database and use the value for the form.
     */
    $value = get_post_meta( $post->ID, '_studentrnd_canonical', true );

    echo '<label for="studentrnd_canonical">';
    _e( 'Override', 'studentrnd_canonical_textdomain' );
    echo '</label> ';
    echo '<input type="text" id="studentrnd_canonical" name="studentrnd_canonical" value="'.esc_attr($value).'" />';
}

function studentrnd_canonical_save_meta_box_data( $post_id ) {

    /*
     * We need to verify this came from our screen and with proper authorization,
     * because the save_post action can be triggered at other times.
     */

    // Check if our nonce is set.
    if ( ! isset( $_POST['studentrnd_canonical_meta_box_nonce'] ) ) {
        return;
    }

    // Verify that the nonce is valid.
    if ( ! wp_verify_nonce( $_POST['studentrnd_canonical_meta_box_nonce'], 'studentrnd_canonical_meta_box' ) ) {
        return;
    }

    // If this is an autosave, our form has not been submitted, so we don't want to do anything.
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    // Check the user's permissions.
    if ( isset( $_POST['post_type'] ) && 'page' == $_POST['post_type'] ) {

        if ( ! current_user_can( 'edit_page', $post_id ) ) {
            return;
        }

    } else {

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }
    }

    /* OK, its safe for us to save the data now. */

    // Make sure that it is set.
    if ( ! isset( $_POST['studentrnd_canonical'] ) ) {
        return;
    }

    // Sanitize user input.
    $my_data = sanitize_text_field( $_POST['studentrnd_canonical'] );

    // Update the meta field in the database.
    update_post_meta( $post_id, '_studentrnd_canonical', $my_data );
}
add_action( 'save_post', 'studentrnd_canonical_save_meta_box_data' );

/* # CTA */

function studentrnd_cta_add_meta_box() {

    $screens = array( 'post', 'page' );

    foreach ( $screens as $screen ) {

        add_meta_box(
            'studentrnd_cta_sectionid',
            __( 'CTA', 'studentrnd_cta_textdomain' ),
            'studentrnd_cta_meta_box_callback',
            $screen
        );
    }
}
add_action( 'add_meta_boxes', 'studentrnd_cta_add_meta_box' );

function studentrnd_cta_meta_box_callback( $post ) {

    // Add an nonce field so we can check for it later.
    wp_nonce_field( 'studentrnd_cta_meta_box', 'studentrnd_cta_meta_box_nonce' );

    /*
     * Use get_post_meta() to retrieve an existing value
     * from the database and use the value for the form.
     */
    $value = get_post_meta( $post->ID, '_studentrnd_cta_requested', true );

    echo '<label for="studentrnd_cta_requested">';
    _e( 'Requested CTA', 'studentrnd_cta_textdomain' );
    echo '</label> ';
    echo '<select id="studentrnd_cta_requested" name="studentrnd_cta_requested">';
    echo '<option value="">(default)</option>';
    echo '<option value="labs"'. (esc_attr( $value ) === 'labs' ? ' selected' : '') .'>Labs</option>';
    echo '<option value="codeday"'. (esc_attr( $value ) === 'codeday' ? ' selected' : '') .'>CodeDay</option>';
    echo '<option value="jobs"'. (esc_attr( $value ) === 'jobs' ? ' selected' : '') .'>Careers</option>';
    echo '</select>';
}

function studentrnd_cta_save_meta_box_data( $post_id ) {

    /*
     * We need to verify this came from our screen and with proper authorization,
     * because the save_post action can be triggered at other times.
     */

    // Check if our nonce is set.
    if ( ! isset( $_POST['studentrnd_cta_meta_box_nonce'] ) ) {
        return;
    }

    // Verify that the nonce is valid.
    if ( ! wp_verify_nonce( $_POST['studentrnd_cta_meta_box_nonce'], 'studentrnd_cta_meta_box' ) ) {
        return;
    }

    // If this is an autosave, our form has not been submitted, so we don't want to do anything.
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    // Check the user's permissions.
    if ( isset( $_POST['post_type'] ) && 'page' == $_POST['post_type'] ) {

        if ( ! current_user_can( 'edit_page', $post_id ) ) {
            return;
        }

    } else {

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }
    }

    /* OK, its safe for us to save the data now. */

    // Make sure that it is set.
    if ( ! isset( $_POST['studentrnd_cta_requested'] ) ) {
        return;
    }

    // Sanitize user input.
    $my_data = sanitize_text_field( $_POST['studentrnd_cta_requested'] );

    // Update the meta field in the database.
    update_post_meta( $post_id, '_studentrnd_cta_requested', $my_data );
}
add_action( 'save_post', 'studentrnd_cta_save_meta_box_data' );


/* # Sharer */
function studentrnd_sharer_add_meta_box() {

    $screens = array( 'post', 'page' );

    foreach ( $screens as $screen ) {

        add_meta_box(
            'studentrnd_sharer_sectionid',
            __( 'Sharer', 'studentrnd_sharer_textdomain' ),
            'studentrnd_sharer_meta_box_callback',
            $screen
        );
    }
}
add_action( 'add_meta_boxes', 'studentrnd_sharer_add_meta_box' );

function studentrnd_sharer_meta_box_callback( $post ) {

    // Add an nonce field so we can check for it later.
    wp_nonce_field( 'studentrnd_sharer_meta_box', 'studentrnd_sharer_meta_box_nonce' );

    $content = ['twitter' => 'Tweet (w/o link)', 'twitter_via' => 'Tweet via @', 'reddit' => 'Reddit Title', 'hn' => 'HN Title'];

    foreach ($content as $key=>$label) {
        $value = get_post_meta( $post->ID, '_studentrnd_sharer_'.$key, true );
        echo '<label for="studentrnd_sharer_'.$key.'">';
        _e( $label, 'studentrnd_sharer_textdomain' );
        echo '</label> ';
        echo '<input type="text" style="width:100%;" name="studentrnd_sharer_'.$key.'" id="studentrnd_sharer_'.$key.'" value="'.esc_attr($value).'" placeholder="'.esc_attr($key == 'twitter_via' ? 'studentrnd' : $post->post_title).'" maxlength="100" width="50" />';
        echo '<br />';
    }
}

function studentrnd_sharer_save_meta_box_data( $post_id ) {

    /*
     * We need to verify this came from our screen and with proper authorization,
     * because the save_post action can be triggered at other times.
     */

    // Check if our nonce is set.
    if ( ! isset( $_POST['studentrnd_sharer_meta_box_nonce'] ) ) {
        return;
    }

    // Verify that the nonce is valid.
    if ( ! wp_verify_nonce( $_POST['studentrnd_sharer_meta_box_nonce'], 'studentrnd_sharer_meta_box' ) ) {
        return;
    }

    // If this is an autosave, our form has not been submitted, so we don't want to do anything.
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    // Check the user's permissions.
    if ( isset( $_POST['post_type'] ) && 'page' == $_POST['post_type'] ) {

        if ( ! current_user_can( 'edit_page', $post_id ) ) {
            return;
        }

    } else {

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }
    }

    /* OK, its safe for us to save the data now. */
    $sites = ['twitter', 'twitter_via', 'reddit', 'hn'];
    foreach ($sites as $site) {
        if ( isset( $_POST['studentrnd_sharer_'.$site] ) ) {
            $my_data = sanitize_text_field( $_POST['studentrnd_sharer_'.$site] );
            update_post_meta( $post_id, '_studentrnd_sharer_'.$site, $my_data );
        }
    }
}
add_action( 'save_post', 'studentrnd_sharer_save_meta_box_data' );