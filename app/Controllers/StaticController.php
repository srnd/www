<?php
namespace Www\Controllers;

use \Www\Models;

class StaticController extends \Controller {
    public function getIndex()
    {
        return \View::make('pages/index', [
            'fundraising' => \Config::get('fundraising')
        ]);
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