<?php
namespace Www\Models;

use \Carbon\Carbon;

class Donation extends \Eloquent {
    protected $table = 'donations';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $pool = '23456789abcdefghkmnpqrsuwxyz';
            $model->{$model->getKeyName()} = substr(str_shuffle(str_repeat($pool, 5)), 0, 12);
        });
    }
}