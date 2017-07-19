<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class NewDonations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('ALTER TABLE `donations` MODIFY `address_1` VARCHAR(255) NULL;');
        DB::statement('ALTER TABLE `donations` MODIFY `city` VARCHAR(255) NULL;');
        DB::statement('ALTER TABLE `donations` MODIFY `state` VARCHAR(255) NULL;');
        DB::statement('ALTER TABLE `donations` MODIFY `zip` VARCHAR(255) NULL;');

        \Schema::table('donations', function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->string('reward')->nullable();
            $table->string('reward_option')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \Schema::table('donations', function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->dropColumn('reward');
            $table->dropColumn('reward_option');
        });

        DB::statement('ALTER TABLE `donations` MODIFY `address_1` VARCHAR(255) NOT NULL;');
        DB::statement('ALTER TABLE `donations` MODIFY `city` VARCHAR(255) NOT NULL;');
        DB::statement('ALTER TABLE `donations` MODIFY `state` VARCHAR(255) NOT NULL;');
        DB::statement('ALTER TABLE `donations` MODIFY `zip` VARCHAR(255) NOT NULL;');
    }
}
