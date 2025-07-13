<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Module;
use App\Services\LessonService;
use App\Services\ModuleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{

     protected LessonService $lessonService;
     protected ModuleService $moduleService;

    public function __construct(LessonService $lessonService, ModuleService $moduleService)
    {
        $this->lessonService = $lessonService;
        $this->moduleService = $moduleService;
    }

    public function index()
    {
        $lessons = $this->lessonService->paginateLessons(10);
        $modules = $this->moduleService->fetchModulesWithIdTitle();
        return Inertia::render('admin/lessons', ['lessons' => $lessons, 'modules' => $modules]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Module $module)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:lessons',
            'video_url' => 'required|url|max:500|unique:lessons',
            'duration' => 'required|string',
            'order' => 'required|integer',
            'module_id' => 'required|integer|exists:modules,id',
        ]);


        $new_lesson = $this->lessonService->createLesson($validated, $module->id);
        return redirect()->route('admin.lessons.index')
            ->with('success', 'New Lesson Added Successfully')
            ->with('data', $new_lesson);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }


    public function update(Request $request, Module $module, Lesson $lesson)
    {
         $validated = $request->validate([
            'title' => 'required|string|max:255',
            'video_url' => 'required|url|max:500',
            'duration' => 'required|string',
            'order' => 'required|integer',
            'module_id' => 'required|integer|exists:modules,id',
        ]);


        $updated_lesson = $this->lessonService->updateLesson($module->id, $lesson->id, $validated);
        return redirect()->route('admin.lessons.index')
            ->with('success', 'Lesson Updated Successfully')
            ->with('data', $updated_lesson);
    }


    public function destroy(Module $module, Lesson $lesson)
    {

        $this->lessonService->deleteLesson($module->id, $lesson->id);

        return redirect()->route('admin.lessons.index')
            ->with('success', 'Lesson Deleted Successfully');
    }
}
