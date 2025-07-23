<?php

namespace App\Services;

use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Contracts\Pagination\Paginator;

class QuestionService
{
    public function paginateQuestions(int $perPage = 10): Paginator
    {
        return Question::with('quiz')->latest()->paginate($perPage);
    }

    public function createQuestion(int $quizId, array $data): Question
    {
        return Question::where('quiz_id', $quizId)->create($data);
    }

    public function updateQuestion(int $id, int $quizId, array $data): bool
    {
        $question = Question::where('id', $id)
            ->where('quiz_id', $quizId)
            ->firstOrFail();

        return $question->update($data);
    }


    public function deleteQuestion(int $quizId, int $id): bool
    {
        $question = Question::where('id', $id)
            ->where('quiz_id', $quizId)
            ->firstOrFail();

        return $question->delete();
    }
}
