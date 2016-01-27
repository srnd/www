<?php
namespace StudentRND\Models;

use \Carbon\Carbon;

class PressRelease extends \Eloquent {
    protected $table = 'press_releases';
    public $incrementing = false;

    public function getDates()
    {
        return ['created_at', 'updated_at', 'published_at'];
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
