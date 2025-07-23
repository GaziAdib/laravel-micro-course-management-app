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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $table->enum('question_type', ['multiple_choice', 'true_false', 'gap_fill', 'short_answer']);
            $table->text('question_text');
            $table->json('options')->nullable(); // For MCQs: {"options": ["A", "B", "C"], "correct": 0}
            $table->text('correct_answer'); // For short answer or true/false
            $table->integer('points')->default(1);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
