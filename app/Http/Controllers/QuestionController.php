<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Quiz;
use App\Services\QuestionService;
use App\Services\QuizService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class QuestionController extends Controller
{
    protected QuizService $quizService;
    protected QuestionService $questionService;

    public function __construct(QuizService $quizService, QuestionService $questionService)
    {
        $this->quizService =  $quizService;
        $this->questionService =  $questionService;
    }
    public function index()
    {
        $quizzess = $this->quizService->paginateQuizzes(10);
        $questions = $this->questionService->paginateQuestions(10);

        return Inertia::render('admin/questions', [
            'questions' => $questions,
            'quizzess' => $quizzess
        ]);
    }

    public function store(Request $request,  Quiz $quiz)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'question_text' => 'required|string|max:2000',
            'options' => [
                'required',
                'array:choices',
                function ($attribute, $value, $fail) {
                    if (!isset($value['choices'])) {
                        $fail('The options must contain a choices array.');
                    }

                    $choices = $value['choices'];
                    $correctCount = 0;
                    $keys = [];

                    // foreach ($choices as $choice) {
                    //     // Validate choice structure
                    //     if (!isset($choice['key'], $choice['text'], $choice['is_correct'])) {
                    //         $fail('Each choice must have key, text, and is_correct fields.');
                    //     }

                    //     // Count correct answers
                    //     if ($choice['is_correct']) {
                    //         $correctCount++;
                    //     }

                    //     // Track keys for uniqueness
                    //     $keys[] = $choice['key'];
                    // }

                    // Validate exactly one correct answer
                    // if ($correctCount !== 1) {
                    //     $fail('There must be exactly one correct answer.');
                    // }

                    // Validate unique keys
                    if (count($keys) !== count(array_unique($keys))) {
                        $fail('Choice keys must be unique.');
                    }
                }
            ],
            'correct_answer' => [
                'required',
                'string',
                // function ($attribute, $value, $fail) use ($request) {
                //     $choices = $request->input('options.choices', []);
                //     $correctChoiceExists = collect($choices)
                //         ->contains(fn($c) => $c['key'] === $value && $c['is_correct']);

                //     if (!$correctChoiceExists) {
                //         $fail('Correct answer must match the key of the correct choice.');
                //     }
                // }
            ],
            'points' => 'required|integer|min:1|max:100'
        ]);


        $new_question = $this->questionService->createQuestion($quiz->id, $validated);

        return redirect()->route('admin.questions.index')
            ->with('success', 'New Question Added Successfully')
            ->with('data', $new_question);
    }



    public function update(Request $request, Quiz $quiz, Question $question)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'question_text' => 'required|string|max:2000',
            'options' => [
                'required',
                'array:choices',
                function ($attribute, $value, $fail) {
                    if (!isset($value['choices'])) {
                        $fail('The options must contain a choices array.');
                    }

                    $choices = $value['choices'];
                    $correctCount = 0;
                    $keys = [];

                    // foreach ($choices as $choice) {
                    //     // Validate choice structure
                    //     if (!isset($choice['key'], $choice['text'], $choice['is_correct'])) {
                    //         $fail('Each choice must have key, text, and is_correct fields.');
                    //     }

                    //     // // Count correct answers
                    //     // if ($choice['is_correct']) {
                    //     //     $correctCount++;
                    //     // }

                    //     // Track keys for uniqueness
                    //     $keys[] = $choice['key'];
                    // }

                    // Validate exactly one correct answer
                    // if ($correctCount !== 1) {
                    //     $fail('There must be exactly one correct answer.');
                    // }

                    // Validate unique keys
                    if (count($keys) !== count(array_unique($keys))) {
                        $fail('Choice keys must be unique.');
                    }
                }
            ],
            'correct_answer' => [
                'required',
                'string'

                // function ($attribute, $value, $fail) use ($request) {
                //     $choices = $request->input('options.choices', []);
                //     $correctChoiceExists = collect($choices)
                //         ->contains(fn($c) => $c['key'] === $value && $c['is_correct']);

                //     if (!$correctChoiceExists) {
                //         $fail('Correct answer must match the key of the correct choice.');
                //     }
                // }
            ],
            'points' => 'required|integer|min:1|max:100'
        ]);


        $updated_question = $this->questionService->updateQuestion($question->id, $quiz->id, $validated);

        return redirect()->route('admin.questions.index')
            ->with('success', 'Question Updated Successfully')
            ->with('data', $updated_question);
    }

    public function destroy(Quiz $quiz, Question $question)
    {

        $this->questionService->deleteQuestion($quiz->id, $question->id);

        return redirect()->route('admin.questions.index')
            ->with('success', 'Question Deleted Successfully');
    }
}
