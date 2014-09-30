<?php
namespace Www\Controllers;

class StaticController extends \Controller {
    public function getIndex()
    {
        return \View::make('pages/index');
    }

    public function getCodeOfConduct()
    {
        return \View::make('pages/code-of-conduct');
    }

    public function getPress()
    {
        return \View::make('pages/press');
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