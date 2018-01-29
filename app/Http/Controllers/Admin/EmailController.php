<?php

namespace StudentRND\Http\Controllers\Admin;

use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;
use StudentRND\Services;

class EmailController extends \StudentRND\Http\Controller
{
    public function getIndex()
    {
        return \View::make('pages/admin/email');
    }

    public function postIndex()
    {
        // Upload image
        $s3 = S3Client::factory([
            'credentials' => [
                'key'    => \Config::get('aws.key'),
                'secret' => \Config::get('aws.secret'),
            ],
            'version' => '2006-03-01',
            'region'  => 'us-west-1',
        ]);

        try {
            $fileName = '/'.md5(time().rand(0, 1000)).'.'.\Input::file('photo')->getClientOriginalExtension();
            $fileUrl = \config::get('aws.s3.uploadUrl').$fileName;
            $s3->putObject([
                'Bucket'       => \config('aws.s3.uploadBucket'),
                'Key'          => \config('aws.s3.uploadPath').$fileName,
                'SourceFile'   => \Input::file('photo')->getRealPath(),
                'ACL'          => 'public-read',
            ]);
        } catch (S3Exception $e) {
            return $e->getMessage();
        }

        $emailContent = Services\Email::Render(\Input::get('preheader'), $fileUrl, \Input::get('herotext'), \Input::get('content'));
        $emailContent = str_replace('--unsubscribe--', '[Unsubscribe_Preferences]', $emailContent);

        return $emailContent;
    }
}
