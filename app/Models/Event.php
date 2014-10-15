<?php
namespace Www\Models;

use \Carbon\Carbon;

class Event extends \Eloquent {
    protected $table = 'events';
    protected $dates = ['starts_at', 'ends_at', 'arrive_at'];

    public function attendees()
    {
        return $this->hasMany('\Www\Models\EventAttendee', 'event_id', 'id');
    }

    public static function Loaded()
    {
        return self::where('is_loaded', '=', true)->first();
    }

    public function setStartsAtAttribute($value)
    {
        $this->attributes['starts_at'] = $value ? Carbon::createFromFormat('Y-m-d\\TH:i', $value) : null;
    }

    public function setEndsAtAttribute($value)
    {
        $this->attributes['ends_at'] = $value ? Carbon::createFromFormat('Y-m-d\\TH:i', $value) : null;
    }

    public function setArriveAtAttribute($value)
    {
        $this->attributes['arrive_at'] = $value ? Carbon::createFromFormat('Y-m-d\\TH:i', $value) : null;
    }

    public static function ClearLoaded()
    {
        foreach (self::where('is_loaded', '=', true)->get() as $loaded) {
            $loaded->is_loaded = false;
            $loaded->save();
        }
    }

    public function makeLoaded()
    {
        self::ClearLoaded();
        $this->is_loaded = true;
        $this->save();
    }
}