<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Models\Category;
use App\Models\Course;
use App\Models\OrderItem;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserCourseController extends Controller
{

    public function index(Request $request)
    {

        $categories = Category::all();


        $courses = Course::with(['modules', 'category', 'reviews'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('modules', function ($moduleQuery) use ($search) {
                            $moduleQuery->where('title', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->sort, function ($query, $sort) {
                match ($sort) {
                    'price-low' => $query->orderBy('price', 'asc'),
                    'price-high' => $query->orderBy('price', 'desc'),
                    default => $query->latest(),
                };
            })
            ->when($request->category, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('category_id', 'like', "%{$search}%");
                });
            })
            ->paginate(12);

        return Inertia::render('user/Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $request->only(['search', 'sort', 'category'])
        ]);
    }


    public function showCarts(Request $request)
    {
        // Make sure this path matches exactly with your file structure
        return Inertia::render('user/Carts/Index'); // lowercase 'user' if your folder is lowercase
    }

    public function showCheckouts(Request $request)
    {
        // Make sure this path matches exactly with your file structure
        return Inertia::render('user/Checkouts/Index'); // lowercase 'user' if your folder is lowercase
    }

    public function purchaseCourse(StorePurchaseRequest $request)
    {
        // Make sure this path matches exactly with your file structure

       $purchase = Purchase::create([
            'user_id' =>  Auth::user()->id,
            'payment_gateway' => $request->payment_gateway,
            'customer_mobile' => $request->customer_mobile,
            'customer_email' => $request->customer_email,
            'customer_address' => $request->customer_address,
            'amount_paid' => $request->amount_paid,
            'bank_receipt_no' => $request->bank_receipt_no,
            'bkash_trxId' => $request->bkash_trxId,
            'transaction_id' => $request->transaction_id,
            // 'courses' => $request->courses,
            'status' => 'pending',
            'purchased_at' => now(),
        ]);

        // Create order items
        foreach ($request->order_items as $item) {
            OrderItem::create([
                'purchase_id' => $purchase->id,
                'course_data' => $item['course_data'],
                'quantity' => $item['quantity'],
                'total_price' => $item['course_data']['price'] * $item['quantity'],
                'coupon_code' => $item['coupon_code'] ?? null,
                'discount_amount' => $item['discount_amount'] ?? 0
            ]);
        }

        return redirect()->route('user.courses.index')
            ->with('success', 'Course Purchases Successfully');
    }





    public function show($courseId)
    {

        $course = Course::with([
            'category',
            'modules' => function ($query) {
                $query->orderBy('order', 'asc')
                    ->with(['lessons' => function ($q) {
                        $q->orderBy('order', 'asc');
                    }]);
            },
            'reviews.user'
        ])
            ->findOrFail($courseId);


        return Inertia::render('user/Courses/Show/Show', [
            'course' => $course
        ]);
    }
}















// <?php

// namespace App\Http\Controllers;

// use App\Models\Course;
// use Illuminate\Http\Request;
// use Inertia\Inertia;

// class UserCourseController extends Controller
// {

//     public function index(Request $request)
//     {


//         // $courses = Course::with(['modules', 'category', 'reviews'])->paginate(10);

//         // return Inertia::render('user/courses', [
//         //     'courses' => $courses,
//         //     'filters' => $request->only(['search', 'sort', 'category'])
//         // ]);


//         $courses = Course::with(['modules', 'category', 'reviews'])
//             ->when($request->search, function ($query, $search) {
//                 $query->where(function ($q) use ($search) {
//                     $q->where('title', 'like', "%{$search}%")
//                         ->orWhere('description', 'like', "%{$search}%");
//                 });
//             })
//             ->when($request->sort, function ($query, $sort) {
//                 match ($sort) {
//                     'price-low' => $query->orderBy('price', 'asc'),
//                     'price-high' => $query->orderBy('price', 'desc'),
//                     default => $query->latest(),
//                 };
//             })
//             ->paginate(12); // Actually execute the query

//         // Remove the dd() to allow execution to continue
//         return Inertia::render('user/Courses/Index', [
//             'courses' => $courses,
//             'filters' => $request->only(['search', 'sort'])
//         ]);
//     }


//     public function show($courseId)
//     {

//         // $course = Course::where('id', $courseId)
//         // ->where('is_published', true)
//         // ->with(['category', 'reviews.user', 'modules'])
//         // ->firstOrFail();

//         // $course = Course::with(['category', 'modules.lessons', 'reviews.user'])
//         //         ->order
//         //         ->findOrFail($courseId);

//         // $course = Course::find($courseId);
//         // dd($course);

//         // dd($course);

//         $course = Course::with([
//             'category',
//             'modules' => function ($query) {
//                 $query->orderBy('order', 'asc')
//                     ->with(['lessons' => function ($q) {
//                         $q->orderBy('order', 'asc');
//                     }]);
//             },
//             'reviews.user'
//         ])
//             ->findOrFail($courseId);


//         return Inertia::render('user/Courses/Show/Show', [
//             'course' => $course
//         ]);
//     }
// }
