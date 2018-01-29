<?php

use Illuminate\Database\Migrations\Migration;

class CreateEvents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \Schema::create('events', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id');

            $table->string('name');
            $table->text('description')->nullable();
            $table->datetime('starts_at');
            $table->datetime('ends_at')->nullable();
            $table->boolean('is_loaded')->default(false);

            $table->boolean('is_stream_enabled')->default(false);
            $table->string('stream_id')->nullable();

            $table->boolean('is_attend_enabled')->default(false);
            $table->text('address')->nullable();
            $table->datetime('arrive_at')->nullable();
            $table->boolean('allow_plus_ones')->default(false);

            $table->timestamps();
        });

        \Schema::create('events_attendees', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id');

            $table->unsignedInteger('event_id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->integer('plus_ones')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \Schema::drop('events_attendees');
        \Schema::drop('events');
    }
}
