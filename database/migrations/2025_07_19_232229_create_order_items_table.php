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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            // $table->unsignedBigInteger('purchase_id');

            // Add foreign key constraint
            $table->foreignId('purchase_id')->constrained()->cascadeOnDelete();

            $table->json('course_data')->comment('Full course snapshot from cart');
            $table->integer('quantity')->default(0);
            $table->decimal('total_price')->default(0);

            $table->string('coupon_code')->nullable();
            $table->decimal('discount_amount', 10, 2)->default(0);

            $table->timestamps();
            $table->index('purchase_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
