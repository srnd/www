<?php
/*
Plugin Name: s5
Plugin URI: https://s5.studentrnd.org/
Description: Allows user login using StudentRND s5
Version: 1.0
Author: StudentRND
Author URI: https://studentrnd.org/
License: Artistic 2.0
*/


class s5Login
{
    public $s5User = null;
    public $apiToken = null;
    public $apiSecret = null;
    public $authorsGroups = null;
    public $editorsGroups = null;
    public function start()
    {
        $this->apiToken = get_option('s5_api_token');
        $this->apiSecret = get_option('s5_api_secret');
        $this->authorsGroups = explode(',', get_option('s5_authors_groups'));
        $this->editorsGroups = explode(',', get_option('s5_editors_groups'));

        if ($this->apiToken && $this->apiSecret) {
            add_action('init', [$this, 'action_init']);
        }
        add_action('admin_menu', [$this, 'action_admin_menu']);
    }

    public function action_admin_menu()
    {
        add_menu_page('s5 Login Settings', 's5 Settings', 'administrator', __FILE__, [$this, 'show_settings_page']);
        add_action('admin_init', [$this, 'action_admin_init']);
    }

    public function action_admin_init()
    {
        register_setting('s5', 's5_api_token');
        register_setting('s5', 's5_api_secret');
        register_setting('s5', 's5_authors_groups');
        register_setting('s5', 's5_editors_groups');
    }

    public function show_settings_page()
    {
?>
<div class="wrap">
    <h2>s5</h2>

    <form method="post" action="options.php">
        <?php settings_fields( 's5' ); ?>
        <?php do_settings_sections( 's5' ); ?>
        <table class="form-table">
            <tr valign="top">
                <th scope="row">API Token</th>
                <td><input type="text" name="s5_api_token" value="<?= get_option('s5_api_token'); ?>" /></td>
            </tr>

            <tr valign="top">
                <th scope="row">API Secret</th>
                <td><input type="text" name="s5_api_secret" value="<?= get_option('s5_api_secret'); ?>" /></td>
            </tr>

            <tr valign="top">
                <th scope="row">Authors Groups (comma-seperated)</th>
                <td><input type="text" name="s5_authors_groups" value="<?= get_option('s5_authors_groups'); ?>" /></td>
            </tr>

            <tr valign="top">
                <th scope="row">Editors Groups (comma-seperated)</th>
                <td><input type="text" name="s5_editors_groups" value="<?= get_option('s5_editors_groups'); ?>" /></td>
            </tr>
        </table>

        <?php submit_button(); ?>
    </form>
</div>
<?php
    }

    public function action_init()
    {
        // If we're about to show the login form, we need to redirect the user to the OAuth login before
        // anything else happens.
        $file_name = basename($_SERVER['SCRIPT_FILENAME']);
        if ($file_name === 'wp-login.php') {
            include_once(implode(DIRECTORY_SEPARATOR, [dirname(__FILE__), 'api', 'src', 's5', 'require.php']));
            $s5 = new \s5\API($this->apiToken, $this->apiSecret);

            $s5->RequireLogin();
            $this->s5User = $s5->User->me();

            $wp_user = $this->sync_wp_user();

            $reauth = empty($_REQUEST['reauth']) ? false : true;
            if ($reauth) {
                wp_clear_auth_cookie();
                wp_safe_redirect('wp-login.php');
                exit;
            }

            if ($wp_user && $wp_user->ID !== 0) {
                wp_set_current_user( $wp_user->ID, $wp_user->login );
                wp_set_auth_cookie( $wp_user->ID, false, is_ssl() );
                do_action( 'wp_login', $wp_user->login );

                wp_safe_redirect( 'wp-admin' );
                exit;
            } else {
                echo "You can't do that.";
                exit;
            }
        }
    }

    private function sync_wp_user()
    {
        $role = 'subscriber';

        foreach ($this->s5User->groups as $group) {
            if (in_array($group->id, $this->authorsGroups) && $role === 'subscriber') {
                $role = 'contributor';
            }

            if (in_array($group->id, $this->editorsGroups)) {
                $role = 'editor';
            }
        }

        if ($this->s5User->is_admin) {
            $role = 'administrator';
        }

        $userobj = new WP_User();
        $user = $userobj->get_data_by( 'login', $this->s5User->username ); // Actually only returns UID (?)
        $user = new WP_User($user->ID);

        if ($role !== 'subscriber' && $user->ID == 0) {
            // User doesn't exist and should

            $userdata = array( 'user_email' => $this->s5User->email,
                               'user_login' => $this->s5User->username,
                               'first_name' => $this->s5User->first_name,
                               'last_name' => $this->s5User->last_name,
                               'display_name' => $this->s5User->name,

            );
            $new_user_id = wp_insert_user( $userdata );
            $user = new WP_User($new_user_id);
            wp_update_user( array ('ID' => $new_user_id, 'role' => $role ) ) ;
        } else {
            // Make sure the user's role is correct
            wp_update_user( array ('ID' => $user->ID, 'role' => $role ) ) ;
        }

        return $user;
    }

}

(new s5Login)->start();