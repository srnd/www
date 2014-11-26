<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDonations extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \Schema::create('donations', function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->string('id');

            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('address_1');
            $table->string('address_2')->nullable();
            $table->string('city');
            $table->string('state');
            $table->string('zip');
            $table->boolean('opt_out')->default(false);

            $table->decimal('amount', 8, 2);
            $table->boolean('is_anonymous')->default(false);
            $table->boolean('is_recurring')->default(false);

            $table->string('transaction_id');
            $table->enum('transaction_source', ['stripe', 'dwolla', 'paypal']);

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
        \Schema::drop('donations');
    }

}
