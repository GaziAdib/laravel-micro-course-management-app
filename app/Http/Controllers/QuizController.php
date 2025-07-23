<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Quiz;
use App\Services\ModuleService;
use App\Services\QuizService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{

    protected QuizService $quizService;
    protected ModuleService $moduleService;

    public function __construct(QuizService $quizService, ModuleService $moduleService)
    {
        $this->quizService =  $quizService;
        $this->moduleService =  $moduleService;
    }
    public function index()
    {
        $quizzess = $this->quizService->paginateQuizzes(10);
        $modules = $this->moduleService->fetchAllModulesWithTitle();

        return Inertia::render('admin/quizzess', [
            'quizzess' => $quizzess,
            'modules' => $modules
        ]);
    }

    public function store(Request $request, Module $module)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:modules',
            'module_id' => 'required|integer|exists:modules,id',
            'description' => 'nullable|string',
            'passing_score' => 'required|integer|min:1|max:100',
            'max_time_limit' => 'nullable|integer|min:10|max:86400', // 10s to 24h (86400s)
            'max_attempts' => 'required|integer|min:1'
        ]);



        $new_quiz = $this->quizService->createQuiz($module->id, $validated);

        return redirect()->route('admin.quizzes.index')
            ->with('success', 'New Quiz Added Successfully')
            ->with('data', $new_quiz);
    }

    public function update(Request $request, Module $module, Quiz $quiz)
    {
        // dd($request);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'module_id' => 'required|integer',
            // 'module_id' => 'required|integer|exists:modules,id',
            'description' => 'nullable|string',
            'passing_score' => 'required|integer|min:1|max:100',
            'max_time_limit' => 'nullable|integer|min:10|max:86400', // 10s to 24h (86400s)
            'max_attempts' => 'required|integer|min:1'
        ]);


        $updated_quiz = $this->quizService->updateQuiz($module->id, $quiz->id, $validated);

        return redirect()->route('admin.quizzes.index')
            ->with('success', 'Quiz Updated Successfully')
            ->with('data', $updated_quiz);
    }

    public function destroy(Module $module, Quiz $quiz)
    {

        $this->quizService->deleteQuiz($module->id, $quiz->id);

        return redirect()->route('admin.quizzes.index')
            ->with('success', 'Quiz Deleted Successfully');
    }
}
