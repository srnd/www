<?php

namespace StudentRND\Services;

class Email
{
    public static function Render($preheader, $heroimg, $herotext, $content) {
        $css = file_get_contents(base_path('resources/assets/css/email.css'));
        $content = \View::make('emails/template/template', [
            'preheader' => $preheader,
            'heroimg'   => $heroimg,
            'herotext'  => $herotext,
            'content'   => $content,
            'css'       => $css,
        ])->render();

        return self::Prepare($content);
    }

    public static function Prepare($html) {
        $css = file_get_contents(base_path('resources/assets/css/email.css'));

        $e = new \Pelago\Emogrifier();
        $e->disableStyleBlocksParsing();
        $e->disableInvisibleNodeRemoval();
        $e->setHtml($html);
        $e->setCss($css);

        return $e->emogrify();
    }

    public static function Send($toName, $toEmail, $fromName, $fromEmail, $subject, $content, $isMarketing = false, $bcc = null) {
        $sendgrid = new \SendGrid(\config('sendgrid.api_key'));
        $email = new \SendGrid\Email();

        $content = self::Prepare($content);
        $content = str_replace('--unsubscribe--', '<%asm_preferences_raw_url%>', $content);

        $email
            ->addTo($toEmail, $toName)
            ->setFrom($fromEmail, $fromName)
            ->setSubject($subject)
            ->setAsmGroupId($isMarketing ? \config('sendgrid.asm.marketing') : \config('sendgrid.asm.transactional'))
            ->setHtml($content);

        if ($bcc) $email->addBcc($bcc, $bcc);

        $sendgrid->send($email);
    }
}
