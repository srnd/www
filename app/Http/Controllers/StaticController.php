<?php
namespace StudentRND\Http\Controllers;

use StudentRND\Models;
use StudentRND\Services;

class StaticController extends \StudentRND\Http\Controller {
    public function getIndex()
    {
        return \View::make('pages/index', [
            'fundraising' => \Config::get('fundraising')
        ]);
    }

    public function getSponsor()
    {
        return \View::make('pages/sponsor');
    }

    public function getHow()
    {
        return \View::make('pages/how');
    }

    public function getPrivacy()
    {
        return \View::make('pages/privacy');
    }

    public function getBugs()
    {
        return \View::make('pages/bugs');
    }

    public function getTerms()
    {
        return \View::make('pages/terms-of-service');
    }

    public function getTrademarks()
    {
        return \View::make('pages/trademarks');
    }

    public function getReturns()
    {
        return \View::make('pages/returns');
    }
    
    public function getConduct()
    {
    	return \View::make('pages/code-of-conduct');
    }

    public function getCodeOfConduct()
    {
    	return \Redirect::to('/conduct');
    }

    public function getPress()
    {

        return \View::make('pages/press', [
            "images" => Services\AwsS3Assets::GetAssets('assets.srnd.org', 'press/images', 'sml', 'lg', 'jpg')
        ]);
    }

    public function getContact()
    {
        return \View::make('pages/contact');
    }
} 
