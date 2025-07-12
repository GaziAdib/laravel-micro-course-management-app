<?php

namespace App\Http\Controllers;

use App\Services\ModuleService;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    protected ModuleService $moduleService;

    public function __construct(ModuleService $moduleService)
    {
        $this->moduleService = $moduleService;
    }

    public function index()
    {
        $modules = $this->moduleService->paginateModules(10);
        return Inertia::render('admin.modules', ['modules' => $modules]);
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
    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        $new_module = $this->moduleService->createModule($validated, $course->id);

        return redirect()->route('admin.modules.index')
            ->with('success', 'New Module Added Successfully')
            ->with('data', $new_module);
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Module $module, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:modules',
            'description' => 'nullable|string|max:1000',
            'course_id' => 'required|integer|exists:courses,id',
            'is_paid' => 'required|boolean',
            'is_published' => 'required|boolean',
            'order' => 'required|integer',
        ]);


        $updated_module = $this->moduleService->updateModule($course->id, $module->id, $validated);

        return redirect()->route('admin.modules.index')
            ->with('success', 'Module Updated Successfully')
            ->with('data', $updated_module);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course, Module $module)
    {

        $module = $this->moduleService->findModule($module->id, $course->id);

        if ($module->lessons()->count() > 0) {
            return redirect()->route('admin.modules.index')
        ->with('success', 'Module Cannot be Deleted Because Lessons Are associated with it!');
        }

        $this->moduleService->deleteModule($course->id, $module->id);

        return redirect()->route('admin.modules.index')
        ->with('success', 'Module Deleted Successfully');
    }
}
