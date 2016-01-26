<?php
namespace StudentRND\Http\Controllers\Admin;

use \StudentRND\Models;

class PressReleaseController extends \StudentRND\Http\Controller {
    public function getIndex()
    {
        return \View::make('pages/admin/press-releases/index', ['releases' => Models\PressRelease::orderBy('created_at', 'DESC')->get()]);
    }

    public function getNew()
    {
        return \View::make('pages/admin/press-releases/edit');
    }

    public function postNew()
    {
        $release = new Models\PressRelease;
        $this->save($release);
        return \Redirect::to('/admin/press-releases');
    }

    public function getEdit()
    {
        return \View::make('pages/admin/press-releases/edit', ['release' => \Route::input('release')]);
    }

    public function postEdit()
    {
        $release = \Route::input('release');
        $this->save($release);
        return \Redirect::to('/admin/press-releases');
    }

    public function postDelete()
    {
        $release = new Models\PressRelease;
        $release->delete();
        return \Redirect::to('/admin/press-releases');
    }

    private function save(Models\PressRelease $release)
    {
        $release->title = \Input::get('title');
        $release->content = \Input::get('content');
        $release->at_a_glance = \Input::get('at_a_glance');
        $release->hidden = \Input::get('hidden') ? true : false;

        $release->save();
    }

}
