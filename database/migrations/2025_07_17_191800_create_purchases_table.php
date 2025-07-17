<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();

            // User and Course relationships
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');

            // Payment status
            $table->enum('status', [
                'pending',
                'completed',
                'failed',
                'refunded',
                'partially_refunded'
            ])->default('pending');

            // Payment information
            $table->decimal('amount_paid', 10, 2);
            $table->string('currency', 3)->default('USD'); // ISO currency code

            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->decimal('final_amount', 10, 2)->nullable();

            $table->enum('payment_gateway', [
                'Bkash',
                'Bank',
                'Stripe',
                'Manual',
                'Handcash'
            ])->default('Bkash'); // 'bkash', 'stripe', 'manual', etc.

            $table->string('transaction_id')->nullable()->comment('Required for Stripe Payment'); // Gateway transaction ID
            $table->string('bkash_trxId')->nullable()->comment('Required for Bkash Payment'); // Gateway transaction ID

            $table->string('bank_receipt_no')->nullable()->comment('Required for bank transfers');
            $table->string('payment_reference')->nullable(); // Reference number from gateway

            // Customer information
            $table->string('customer_mobile');
            $table->string('customer_email');
            $table->string('customer_address');


            $table->json('payment_details')->nullable();
            // Timestamps
            $table->timestamp('purchased_at')->useCurrent();
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'course_id']);
            $table->index('transaction_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
