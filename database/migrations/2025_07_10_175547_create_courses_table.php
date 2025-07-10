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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->json('tags')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->string('image_url')->nullable();
            $table->json('related_images')->nullable();
            $table->json('prerequisites')->nullable();
            $table->string('video_url')->nullable();
            $table->string('duration');
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->timestamps('published_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
