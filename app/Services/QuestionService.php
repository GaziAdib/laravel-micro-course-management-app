<?php

namespace App\Services;

use App\Models\Question;
use Illuminate\Contracts\Pagination\Paginator;

class QuestionService
{
    public function paginateQuestions(int $perPage = 10): Paginator
    {
        return Question::with('quiz')->latest()->paginate($perPage);
    }

    public function getQuestion(int $id, $quizId): Question
    {
        return Question::where('id', $id)
            ->where('quiz_id', $quizId)
            ->firstOrFail();
    }

    public function createQuestion(int $quizId, array $data): Question
    {
        return Question::create(array_merge($data, [
            'quiz_id' => $quizId
        ]));
    }

    public function updateQuestion(int $id, int $quizId, array $data): bool
    {
        $quiz = Question::where('id', $id)
            ->where('quiz_id', $quizId)
            ->firstOrFail();

        return $quiz->update($data);
    }



    public function deleteQuestion(int $quizId, int $id): bool
    {
        $question = Question::where('id', $id)
            ->where('quiz_id', $quizId)
            ->firstOrFail();

        return $question->delete();
    }
}
