<?php

namespace App\Services;

use App\Models\Quiz;
use Illuminate\Contracts\Pagination\Paginator;

class QuizService
{
    public function paginateQuizzes(int $perPage = 10): Paginator
    {
        return Quiz::with('module')->latest()->paginate($perPage);
    }

    public function createQuiz(int $moduleId, array $data): Quiz
    {
        return Quiz::create(array_merge($data, [
            'module_id' => $moduleId
        ]));
    }

    public function updateQuiz(int $moduleId, int $id, array $data): bool
    {
        $quiz = Quiz::where('id', $id)
            ->where('module_id', $moduleId)
            ->firstOrFail();

        return $quiz->update($data);
    }


    public function deleteQuiz(int $moduleId, int $id): bool
    {
        $quiz = Quiz::where('id', $id)
            ->where('module_id', $moduleId)
            ->firstOrFail();

        return $quiz->delete();
    }
}
