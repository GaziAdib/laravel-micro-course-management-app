<?php

namespace App\Services;

use App\Models\Lesson;
use Illuminate\Contracts\Pagination\Paginator;

class LessonService
{
    public function paginateLessons(int $perPage = 10): Paginator
    {
        return Lesson::with('module')->latest()->paginate($perPage);
    }

    public function createLesson(array $data, int $moduleId): Lesson
    {
        return Lesson::where('module_id', $moduleId)->create($data);
    }

    public function findLesson(int $id, int $moduleId): Lesson
    {
        return Lesson::where('id', $id)->where('module_id', $moduleId)->firstOrFail();
    }

    public function updateLesson(int $moduleId, int $id, array $data): bool
    {
        return Lesson::where('id', $id)
            ->where('module_id', $moduleId)
            ->firstOrFail()
            ->update($data);
    }

    public function deleteLesson(int $moduleId, int $id): bool
    {

        return Lesson::where('id', $id)
            ->where('module_id', $moduleId)
            ->firstOrFail()
            ->delete();
    }
}
