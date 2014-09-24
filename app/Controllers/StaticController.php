<?php
namespace Www\Controllers;

class StaticController extends \Controller {
    public function getIndex()
    {
        return \View::make('pages/index');
    }

    public function getContact()
    {
        return \View::make('pages/contact');
    }

    public function getTeam()
    {
        return \View::make('pages/team');
    }
} 