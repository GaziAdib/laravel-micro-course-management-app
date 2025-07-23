<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Quiz;
use App\Services\QuizService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class QuizController extends Controller
{

    protected QuizService $quizService;

    public function __construct(QuizService $quizService)
    {
        $this->quizService =  $quizService;
    }
    public function index()
    {
        $quizes = $this->quizService->paginateQuizes(10);
        return Inertia::render('admin/quizzes', ['quizes' => $quizes]);
    }

    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('quizzes')->where('module_id', $module->id)
            ],
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

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'is_paid' => 'sometimes|boolean',
            'is_published' => 'sometimes|boolean',
            'order' => 'required|integer',
            'course_id' => 'required|integer|exists:courses,id',
        ]);


        $updated_quiz = $this->quizService->updateQuiz($module->id, $module->id, $validated);

        return redirect()->route('admin.quizzes.index')
            ->with('success', 'Quiz Updated Successfully')
            ->with('data', $updated_quiz);
    }

    public function destroy(Module $module, Quiz $quiz)
    {


        $this->quizService->deleteQuiz($quiz->id, $module->id);

        return redirect()->route('admin.modules.index')
            ->with('success', 'Module Deleted Successfully');
    }
}
