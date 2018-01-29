<?php

use Illuminate\Database\Migrations\Migration;

class AddDonationsRecurring extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \Schema::table('donations', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->string('for')->nullable();
            $table->string('transaction_subscription_id')->nullable();
            $table->dateTime('cancelled_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \Schema::table('donations', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->dropColumn('for');
            $table->dropColumn('transaction_subscription_id');
            $table->dropColumn('cancelled_at');
        });
    }
}
