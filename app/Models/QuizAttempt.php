<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{

    protected $fillable = [
        'quiz_id',
        'user_id',
        'score',
        'percentage'
    ];

    protected $casts = [
        'answers' => 'array',
        'passed' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime'
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }



    //   public function grade()
    // {
    //     $score = 0;
    //     $results = [];

    //     foreach ($this->quiz->questions as $question) {
    //         $userAnswer = $this->answers[$question->id] ?? null;
    //         $isCorrect = $question->isAnswerCorrect($userAnswer);

    //         if ($isCorrect) {
    //             $score += $question->points;
    //         }

    //         $results[$question->id] = [
    //             'question' => $question->question_text,
    //             'user_answer' => $userAnswer,
    //             'correct_answer' => $this->getCorrectAnswer($question),
    //             'is_correct' => $isCorrect,
    //             'points' => $isCorrect ? $question->points : 0
    //         ];
    //     }

    //     $percentage = round(($score / $this->quiz->total_points) * 100);

    //     $this->update([
    //         'score' => $percentage,
    //         'passed' => $percentage >= $this->quiz->passing_score,
    //         'completed_at' => now(),
    //         'answers' => $results // Store detailed results
    //     ]);

    //     return $percentage;
    // }

    //  protected function getCorrectAnswer($question)
    // {
    //     if ($question->type === 'multiple_choice') {
    //         return $question->options['options'][$question->options['correct']] ?? '';
    //     }
    //     return $question->correct_answer;
    // }
}
