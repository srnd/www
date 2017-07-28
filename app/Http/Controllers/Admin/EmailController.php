<?php
namespace StudentRND\Http\Controllers\Admin;

class EmailController extends \StudentRND\Http\Controller {
    public function getIndex()
    {
        return \View::make('pages/admin/email');
    }

    public function postIndex()
    {
        $css = file_get_contents(base_path('resources/assets/css/email.css'));
        $content = \View::make('emails/template/template', [
            'preheader' => \Input::get('preheader'),
            'heroimg'   => \Input::get('heroimg'),
            'herotext'  => \Input::get('herotext'),
            'content'   => \Input::get('content'),
            'css'       => $css
        ])->render();

        $e = new \Pelago\Emogrifier();
        $e->disableStyleBlocksParsing();
        $e->disableInvisibleNodeRemoval();
        $e->enableCssToHtmlMapping();
        $e->setHtml($content);
        $e->setCss($css);

        $emailContent = $e->emogrify();
        //$emailContent = str_replace('--unsubscribe--', '<%asm_preferences_raw_url%>', $emailContent);
        $emailContent = str_replace('--unsubscribe--', '[Unsubscribe_Preferences]', $emailContent);
        return $emailContent;
    }
}
