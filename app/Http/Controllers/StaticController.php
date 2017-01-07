<?php
namespace StudentRND\Http\Controllers;

use StudentRND\Models;

class StaticController extends \StudentRND\Http\Controller {
    public function getIndex()
    {
        return \View::make('pages/index', [
            'fundraising' => \Config::get('fundraising')
        ]);
    }

    public function getPrivacy()
    {
        return \View::make('pages/privacy');
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
    	return \Redirect::to('/code-of-conduct');
    }

    public function getCodeOfConduct()
    {
        return \View::make('pages/code-of-conduct');
    }

    public function getPressRelease()
    {
        return \View::make('pages/press-release', ['release' => \Route::input('release')]);
    }

    public function getPress()
    {
        return \View::make('pages/press', ['releases' => Models\PressRelease
            ::where('hidden', '=', false)
            ->orderBy('published_at', 'DESC')
            ->limit(15)
            ->get()]);
    }

    public function getContact()
    {
        return \View::make('pages/contact');
    }

    public function getAbout()
    {
        return \View::make('pages/about');
    }

    public function getTeam()
    {
        return \View::make('pages/team');
    }

    public function getLive()
    {
        $event = Models\Event::Loaded();

        if (!$event || !$event->is_stream_enabled) {
            \App::abort(404);
        }

        return \View::make('pages/live', [
            'event' => $event,
            'hash' => hash('whirlpool', $event->updated_at->timestamp)
        ]);
    }

    public function getLiveHash()
    {
        $event = Models\Event::Loaded();

        if (!$event || !$event->is_stream_enabled) {
            \App::abort(404);
        }

        return [
            'hash' => hash('whirlpool', $event->updated_at->timestamp)
        ];
    }

    public function getRsvp()
    {
        $event = Models\Event::Loaded();

        if (!$event || !$event->is_attend_enabled) {
            \App::abort(404);
        }

        return \View::make('pages/rsvp', ['event' => $event]);
    }

    public function postRsvp()
    {
        $event = Models\Event::Loaded();

        if (!$event || !$event->is_attend_enabled) {
            \App::abort(404);
        }

        $attendee = new Models\EventAttendee;
        $attendee->first_name = \Input::get('first_name');
        $attendee->last_name = \Input::get('last_name');
        $attendee->email = \Input::get('email');
        $attendee->event_id = $event->id;

        if ($event->allow_plus_ones) {
            $attendee->plus_ones = \Input::get('plus_ones');
        }

        $attendee->save();

        return \View::make('pages/rsvp-confirm', ['event' => $event]);
    }
} 
