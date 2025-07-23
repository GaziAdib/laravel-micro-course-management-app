<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'quiz_id',
        'question_type',
        'question_text',
        'options',
        'correct_answer',
        'points',
        'order'
    ];




    protected $casts = [
        'options' => 'array',
        'points' => 'integer',
        'order' => 'integer'
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    const TYPE_MULTIPLE_CHOICE = 'multiple_choice';
    const TYPE_TRUE_FALSE = 'true_false';
    const TYPE_GAP_FILL = 'gap_fill';
    const TYPE_SHORT_ANSWER = 'short_answer';


    // public function isAnswerCorrect($userAnswer)
    // {
    //     switch ($this->question_type) {
    //         case self::TYPE_MULTIPLE_CHOICE:
    //             return $this->checkMultipleChoiceAnswer($userAnswer);
    //         case self::TYPE_TRUE_FALSE:
    //             return $this->checkTrueFalseAnswer($userAnswer);
    //         case self::TYPE_GAP_FILL:
    //             return $this->checkGapFillAnswer($userAnswer);
    //         case self::TYPE_SHORT_ANSWER:
    //             return $this->checkShortAnswer($userAnswer);
    //         default:
    //             return false;
    //     }
    // }

    // protected function checkMultipleChoiceAnswer($userAnswer)
    // {
    //     return isset($this->options['correct']) &&
    //         $userAnswer == $this->options['correct'];
    // }

    // protected function checkTrueFalseAnswer($userAnswer)
    // {
    //     return strtolower($userAnswer) === strtolower($this->correct_answer);
    // }

    // protected function checkGapFillAnswer($userAnswer)
    // {
    //     if (!is_array($userAnswer)) {
    //         $userAnswer = [$userAnswer];
    //     }

    //     $correctAnswers = is_array($this->correct_answer)
    //         ? $this->correct_answer
    //         : [$this->correct_answer];

    //     if (count($userAnswer) !== count($correctAnswers)) {
    //         return false;
    //     }

    //     foreach ($correctAnswers as $index => $correct) {
    //         if (strtolower(trim($userAnswer[$index])) !== strtolower(trim($correct))) {
    //             return false;
    //         }
    //     }

    //     return true;
    // }

    // protected function checkShortAnswer($userAnswer)
    // {
    //     $acceptableAnswers = $this->options['acceptable_answers'] ?? [$this->correct_answer];
    //     $userAnswer = strtolower(trim($userAnswer));

    //     foreach ($acceptableAnswers as $acceptable) {
    //         if ($userAnswer === strtolower(trim($acceptable))) {
    //             return true;
    //         }
    //     }

    //     return false;
    // }
}
