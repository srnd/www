<?php
namespace Www\Models;

class EventAttendee extends \Eloquent {
    protected $table = 'events_attendees';

    public function event()
    {
        return $this->belongsToOne('\Www\Models\Event', 'event_id', 'id');
    }
}