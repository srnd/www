<?php

namespace StudentRND\Models;

class Donation extends \Eloquent
{
    protected $table = 'donations';
    public $incrementing = false;

    public function getDisplayNameAttribute()
    {
        if ($this->is_anonymous) {
            return 'Anonymous';
        } else {
            return $this->first_name.' '.$this->last_name;
        }
    }

    public function getDates()
    {
        return ['created_at', 'updated_at', 'cancelled_at'];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $pool = '23456789abcdefghkmnpqrsuwxyz';
            $model->{$model->getKeyName()} = substr(str_shuffle(str_repeat($pool, 5)), 0, 12);
        });
    }
}
