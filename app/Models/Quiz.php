<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{

     protected $fillable = [
        'module_id',
        'title',
        'description',
        'passing_score',
        'max_time_limit',
        'max_attempts'
    ];



    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    // public function attempts()
    // {
    //     return $this->hasMany(QuizAttempt::class);
    // }

    // public function getTotalPointsAttribute()
    // {
    //     return $this->questions->sum('points');
    // }
}
