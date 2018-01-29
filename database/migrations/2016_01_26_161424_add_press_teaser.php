<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddPressTeaser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \Schema::table('press_releases', function (Blueprint $table) {
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
        \Schema::table('press_releases', function (Blueprint $table) {
            $table->dropColumn('teaser');
        });
    }
}
