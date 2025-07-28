<?php

namespace App\Http\Controllers;

use App\Models\UserQuizProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserQuizProgressController extends Controller
{
    public function storeOrUpdateUserCourseProgress(Request $request)
    {

        // $validatedData = $request->validate([
        //     'course_id' => 'required|exists:courses,id',
        //     'quiz_id' => 'required|exists:quizzes,id',
        //     'attempt_number' => 'required|integer',
        //     // Quiz attempt metrics
        //     'total_questions' => 'required|integer|min:1',
        //     'answered_questions' => 'required|integer|min:0|lte:total_questions',
        //     'correct_answers' => 'required|integer|min:0|lte:answered_questions',
        //     'score' => 'required|numeric|min:0',
        //     'max_score' => 'required|numeric|min:0|gte:score',

        //     // Status flags
        //     'passed' => 'required|boolean',
        //     'completed' => 'required|boolean',
        // ]);

        // $quizProgress = UserQuizProgress::create([
        //     'user_id' => Auth::id(),
        //     'course_id' => $validatedData['course_id'],
        //     'quiz_id' => $validatedData['quiz_id'],
        //     'attempt_number' => $validatedData['attempt_number'],

        //     // Quiz metrics
        //     'total_questions' => $validatedData['total_questions'],
        //     'answered_questions' => $validatedData['answered_questions'],
        //     'correct_answers' => $validatedData['correct_answers'],
        //     'score' => $validatedData['score'],       // Renamed from user_marks
        //     'max_score' => $validatedData['max_score'],  // Renamed from total_marks

        //     // Status flags
        //     'passed' => $validatedData['passed'],
        //     'completed' => !empty($validatedData['completed_at']), // Mark as completed if completed_at exists

        //     // Timestamps
        //     'started_at' => $validatedData['started_at'] ?? now(),
        //     'completed_at' => $validatedData['completed_at'] ?? null,
        // ]);

        $validated = $request->validate([
        'user_id' => 'nullable|exists:users,id',
        'quiz_id' => 'required|exists:quizzes,id',
        'course_id' => 'required|exists:courses,id',
        'total_questions' => 'required|integer',
        'answered_questions' => 'required|integer',
        'correct_answers' => 'required|integer',
        'score' => 'required|numeric',
        'max_score' => 'required|numeric',
        'attempt_number' => 'required|integer',
        'passed' => 'required|boolean',
        'completed' => 'required|boolean',
    ]);

    $userId = Auth::id();

    $userProgress = UserQuizProgress::updateOrCreate(
        [
            'user_id' => $userId,
            'quiz_id' => $validated['quiz_id'],
        ],
        [
            'course_id' => $validated['course_id'],
            'total_questions' => $validated['total_questions'],
            'answered_questions' => $validated['answered_questions'],
            'correct_answers' => $validated['correct_answers'],
            'score' => $validated['score'],
            'max_score' => $validated['max_score'],
            'attempt_number' => $validated['attempt_number'],
            'passed' => $validated['passed'],
            'completed' => $validated['completed'],
        ]
    );

        return redirect()->route('user.course.classroom.index', $userProgress->course_id)
            ->with('success', 'User Progress Created or Updated Successfully');
    }


    // public function updateUserCourseProgress(Request $request, UserQuizProgress $quizProgress)
    // {

    //     $userId = Auth::id();

    //     // Verify ownership
    //     if ($quizProgress->user_id !== $userId) {
    //         abort(403, 'Unauthorized action.');
    //     }

    //     $validatedData = $request->validate([

    //         'attempt_number' => 'required"integer',

    //         'total_questions' => 'required|integer|min:1',
    //         'answered_questions' => 'required|integer|min:0|lte:total_questions',
    //         'correct_answers' => 'required|integer|min:0|lte:answered_questions',
    //         'score' => 'required|numeric|min:0',
    //         'max_score' => 'required|numeric|min:0|gte:score',

    //         'passed' => 'required|boolean',
    //         'completed' => 'required|boolean',
    //     ]);

    //     $quizProgress = UserQuizProgress::where('quiz_id', $validatedData['quiz_id'])
    //     ->where('user_id', $userId)
    //     ->where('course_id', $validatedData['course_id'])
    //     ->first();


    //     if (!$quizProgress) {
    //         return redirect()->back()->with('error', 'User progress record not found.');
    //     }

    //     $quizProgress->update([
    //         'total_questions' => $validatedData['total_questions'],
    //         'answered_questions' => $validatedData['answered_questions'],
    //         'correct_answers' => $validatedData['correct_answers'],
    //         'score' => $validatedData['score'],
    //         'max_score' => $validatedData['max_score'],
    //         'passed' => $validatedData['passed'],
    //         'completed' => $validatedData['completed'], // Auto-complete if passed
    //         'completed_at' => $validatedData['passed'] ? now() : null
    //     ]);

    //     return redirect()->route('user.course.classroom.index', $quizProgress->course_id)
    //         ->with('success', 'User Progress Updated Successfully');
    // }
}
