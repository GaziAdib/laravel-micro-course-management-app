<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserQuizProgress extends Model
{

    protected $fillable = [
        'user_id',
        'course_id',
        'quiz_id',
        'attempt_number',
        'total_questions',
        'answered_questions',
        'correct_answers',
        'score',
        'max_score',
        'passed',
        'completed',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'passed' => 'boolean',
        'completed' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
