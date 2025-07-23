<?php

namespace App\Services;

use App\Models\Module;
use Illuminate\Contracts\Pagination\Paginator;

class ModuleService
{
    public function paginateModules(int $perPage = 10): Paginator
    {
        #return Module::withCount('lessons')->latest()->paginate($perPage);
        return Module::with('course')
            ->withCount('lessons')
            ->latest()
            ->paginate($perPage);
    }

    public function fetchModulesWithIdTitle()

    {
        return Module::With(['course:id,title'])->get(['id', 'title', 'course_id']);
    }

    public function fetchAllModulesWithTitle()
    {
        // return Module::With(['course:id,title'])->get(['id', 'title']);
        return Module::with(['course:id,title'])->get(['id', 'title', 'course_id']);

    }




    public function createModule(array $data, int $courseId): Module
    {
        return Module::where('course_id', $courseId)->create($data);
    }

    public function findModule(int $id, int $courseId): Module
    {
        return Module::where('id', $id)->where('course_id',$courseId)->firstOrFail();
    }

    public function updateModule(int $courseId, int $id, array $data): bool
    {
        return Module::where('id', $id)
                        ->where('course_id', $courseId)
                        ->firstOrFail()
                        ->update($data);

        #return Module::findOrFail($id)->update($data);
    }

    public function deleteModule(int $courseId, int $id): bool
    {

       return Module::where('id', $id)
            ->where('course_id', $courseId)
            ->firstOrFail()
            ->delete();
    }
}
