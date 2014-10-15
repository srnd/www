<?php
namespace Www\Controllers\Admin;

use \Www\Models;

class EventsController extends \Controller {
    public function getIndex()
    {
        return \View::make('pages/admin/events', ['events' => Models\Event::all()]);
    }

    public function postLoad()
    {
        Models\Event::ClearLoaded();

        $event = Models\Event::find(\Input::get('event_id'));
        if ($event) {
            $event->makeLoaded();
        }

        return \Redirect::to('/admin/events');
    }

    public function getNew()
    {
        return \View::make('pages/admin/event-edit');
    }

    public function postNew()
    {
        $event = new Models\Event;
        $this->updateEvent($event);
        return \Redirect::to('/admin/events/e/'.$event->id);
    }

    public function getEdit()
    {
        $event = \Route::input('event');
        return \View::make('pages/admin/event-edit', ['event' => $event]);
    }

    public function postEdit()
    {
        $event = \Route::input('event');
        $this->updateEvent($event);
        return \Redirect::to('/admin/events/e/'.$event->id);
    }

    private function updateEvent(Models\Event $event)
    {
        $needing_update = [
            'name',
            'description',
            'starts_at',
            'ends_at',

            'stream_id',

            'address',
            'arrive_at'
        ];

        foreach ($needing_update as $to_update)
        {
            $event->$to_update = \Input::get($to_update) ? \Input::get($to_update) : null;
        }

        $event->is_stream_enabled = \Input::get('is_stream_enabled') ? true : false;
        $event->is_attend_enabled = \Input::get('is_attend_enabled') ? true : false;
        $event->allow_plus_ones = \Input::get('allow_plus_ones') ? true : false;
        $event->save();
    }
} 