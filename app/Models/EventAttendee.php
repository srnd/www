<?php
namespace StudentRND\Models;

class EventAttendee extends \Eloquent {
    protected $table = 'events_attendees';

    public function event()
    {
        return $this->belongsToOne('\StudentRND\Models\Event', 'event_id', 'id');
    }
}
