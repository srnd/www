<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPressTeaser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \Schema::table('press_releases', function(Blueprint $table) {
            $table->string('teaser')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \Schema::table('press_releases', function(Blueprint $table) {
            $table->dropColumn('teaser');
        });
    }
}
