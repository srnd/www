<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddInKind extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \Schema::table('donations', function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->text('in_kind_description')->nullable();
        });
        DB::statement("ALTER TABLE donations MODIFY COLUMN transaction_source ENUM('stripe', 'dwolla', 'paypal', 'check', 'in-kind')");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \Schema::table('donations', function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->dropColumn('in_kind_description');
        });
        DB::statement("ALTER TABLE donations MODIFY COLUMN transaction_source ENUM('stripe', 'dwolla', 'paypal')");
    }
}
