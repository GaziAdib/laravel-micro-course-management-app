<?php

namespace App\Services;

use App\Models\Quiz;
use Illuminate\Contracts\Pagination\Paginator;

class QuizService
{
    public function paginateQuizes(int $perPage = 10): Paginator
    {
        return Quiz::with('module')->latest()->paginate($perPage);
    }

    public function createQuiz(int $moduleId, array $data): Quiz
    {
        return Quiz::create($data);
    }

    public function updateQuiz(int $id, int $moduleId, array $data): bool
    {
        return Quiz::findOrFail($id)->update($data);
    }

    public function deleteQuiz(int $id, int $moduleId): bool
    {

        return Quiz::findOrFail($id)->delete();

    }

}
