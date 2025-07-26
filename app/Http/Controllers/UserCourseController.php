<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Course;
use App\Models\OrderItem;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserCourseController extends Controller
{



    public function index(Request $request)
    {

        $categories = Category::all();

        // new for purchase info so that courses ui shows you purchased it already in home user page
        $purchases = Purchase::with(['orderItems', 'user'])->where('user_id', Auth::id())->paginate(10);


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
            'purchases' => $purchases,
            'categories' => $categories,
            'filters' => $request->only(['search', 'sort', 'category'])
        ]);
    }





    // user can view their classroom for purchased course
    public function userCourseClassroom(Request $request, $courseId)
    {



        $course = Course::with([
            'category',
            'modules' => function ($query) {
                $query->orderBy('order', 'asc')
                    ->with([
                        'lessons' => function ($q) {
                            $q->orderBy('order', 'asc');
                        },
                        'quiz' => function ($q) {  // Changed to singular 'quiz'
                            $q->with(['questions' => function ($query) {
                                $query->orderBy('order', 'asc');
                            }]);
                        }
                    ]);
            },
            'reviews.user'
        ])->findOrFail($courseId);



        // $course = Course::with([
        //     'category',
        //     'modules' => function ($query) {
        //         $query->orderBy('order', 'asc')
        //             ->with(['lessons' => function ($q) {
        //                 $q->orderBy('order', 'asc');
        //             }]);
        //     },
        //     'reviews.user'
        // ])
        //     ->findOrFail($courseId);

        //  $purchase = Purchase::with('orderItems')->where('user_id', Auth::id())->get();

        //  dd($purchase);

        //  $exists = Purchase::where('user_id', Auth::id())
        //     ->whereHas('orderItems', function($query) use ($courseId) {
        //         $query->whereJsonContains('course_data->->id', $courseId);
        //     })
        //     ->exists();

        //     dd($exists);

        $user = $request->user();

        if (!$user->can('view', $course)) {
            abort(403, 'You do not have permission to view this course');
        }

        // $canViewFreeModule = $user->can('canViewFreeModule', $user, $course, Module::class);

        // dd($canViewFreeModule);

        $hasPurchased =  Purchase::where('user_id', Auth::id())
            ->whereHas('orderItems', function ($query) use ($courseId) {
                // For MySQL 5.7+ with JSON support
                $query->where('course_data', 'like', '%"id":' . $courseId . '%');
                #$query->whereJsonContains('course_data->id', $courseId);

                // Alternative for other databases:
                // $query->where('course_data', 'like', '%"id":'.$courseId.'%');
            })
            ->exists();

        // dd($canAccess);

        // $canAccessModule = $user->can('canViewFreeModule', $user, $course);

        // if (!$request->user()->can('canViewFreeModule', User::class, Course::class, Module::class)) {
        //     abort(Response::HTTP_FORBIDDEN);
        // }

        $firstModule = $course->modules->first();

        $canViewFreeModule = $firstModule
            ? $user->can('canViewFreeModule', [$course, $firstModule])
            : true; // if no modules, allow access

        // Get all modules with access status
        $modules = $course->modules->map(function ($module) use ($user, $course) {
            return [
                ...$module->toArray(),
                'can_access' => $user->can('canViewFreeModule', [$course, $module])
            ];
        });


        return Inertia::render('user/Classroom/Index', [
            'course' => $course,
            'modules' => $modules,
            'canAccessModule' => $canViewFreeModule,
            'hasPurchased' => $hasPurchased
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

        //Get your custom coupon cookie

        // $appliedCouponData = null;

        // if (request()->hasCookie('applied_coupon')) {
        //     $cookieValue = request()->cookie('applied_coupon');

        //     try {
        //         $appliedCouponData = json_decode($cookieValue, true);

        //         // Validate the cookie data
        //         if (
        //             $appliedCouponData &&
        //             isset($appliedCouponData['course_id'], $appliedCouponData['user_id'], $appliedCouponData['code']) &&
        //             $appliedCouponData['course_id'] == $course->id &&
        //             $appliedCouponData['user_id'] == Auth::id()
        //         ) {

        //             // Verify coupon is still valid
        //             $coupon = Coupon::whereRaw('LOWER(TRIM(code)) = ?', [strtolower(trim($appliedCouponData['code']))])
        //                 ->where('is_active', true)
        //                 ->where('valid_until', '>=', now())
        //                 ->first();

        //             if (!$coupon) {
        //                 $appliedCouponData = null;
        //             }
        //         } else {
        //             $appliedCouponData = null;
        //         }
        //     } catch (\Exception $e) {
        //         // \Log::error('Error parsing applied_coupon cookie: ' . $e->getMessage());
        //         // $appliedCouponData = null;
        //     }
        // }

        return Inertia::render('user/Courses/Show/Show', [
            'course' => $course
            // 'appliedCoupon' => $appliedCouponData, // This was missing!
            // 'originalPrice' => $course->price,
            // 'discountedPrice' => $appliedCouponData ? $this->calculateDiscountedPrice($course->price, $appliedCouponData) : null,
        ]);
    }

    // private function calculateDiscountedPrice($originalPrice, $couponData)
    // {
    //     if ($couponData['discount_type'] === 'percentage') {
    //         return $originalPrice - ($originalPrice * $couponData['discount_value'] / 100);
    //     } else {
    //         return max(0, $originalPrice - $couponData['discount_value']);
    //     }
    // }


    // user apply coupon

    // public function applyCoupon(Request $request, Course $course)
    // {
    //     $validated = $request->validate(['code' => 'required|string']);

    //     dd($validated);

    //     try {
    //         // Check if a coupon is already applied in the session
    //         if ($request->session()->has('applied_coupon')) {
    //             $existingCoupon = json_decode($request->session()->get('applied_coupon'), true);

    //             // Optional: Check if it's the same coupon being reapplied
    //             if (strtolower(trim($existingCoupon['code'])) === strtolower(trim($validated['code']))) {
    //                 return back()->with('info', 'This coupon is already applied');
    //             }

    //             // Or force them to remove the existing coupon first
    //             // return back()->with('error', 'Please remove the existing coupon first');
    //         }

    //         $coupon = Coupon::whereRaw('LOWER(TRIM(code)) = ?', [strtolower(trim($validated['code']))])
    //             ->where('is_active', true)
    //             ->whereDate('valid_from', '<=', now())
    //             ->whereDate('valid_until', '>=', now())
    //             ->firstOrFail();

    //         if ($course->coupon_code !== $coupon->code) {
    //             throw new \Exception('This coupon is not valid for the selected course');
    //         }

    //         if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
    //             throw new \Exception('This coupon has reached its usage limit');
    //         }

    //         $couponData = [
    //             'code' => $coupon->code,
    //             'discount_value' => $coupon->discount_value,
    //             'discount_type' => $coupon->discount_type,
    //             'course_id' => $course->id,
    //             'user_id' => Auth::id(),
    //             'applied_at' => now()->timestamp,
    //             'expires_at' => $coupon->valid_until->timestamp
    //         ];

    //         $coupon->increment('used_count');

    //         // Store in session
    //         $request->session()->put('applied_coupon', $couponData);


    //         return redirect()->route('user.courses.index', $course->id)->with('success', 'Coupon applied!')->with('coupon_data', $couponData);
    //     } catch (\Exception $e) {
    //         return back()->with('error', $e->getMessage());
    //     }
    // }







    public function applyCoupon(Request $request, Course $course)
    {
        $validated = $request->validate(['code' => 'required|string']);




        $coupon = Coupon::whereRaw('LOWER(TRIM(code)) = ?', [strtolower(trim($validated['code']))])
            ->where('is_active', true)
            ->whereDate('valid_from', '<=', now())
            ->whereDate('valid_until', '>=', now())
            ->firstOrFail();

        // if ($course->coupon_code !== $coupon->code) {
        //     throw new \Exception('This coupon is not valid for the selected course');
        // }

        // if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
        //     throw new \Exception('This coupon has reached its usage limit');
        // }

        if (!$coupon) {
            return back()->withErrors(['code' => 'Invalid or expired coupon.']);
        }

        if ($course->coupon_code !== $coupon->code) {
            return back()->withErrors(['code' => 'This coupon code is not applicable for this course!']);
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return back()->withErrors(['code' => 'This coupon has reached its usage limit']);
        }

        $couponData = [
            'code' => $coupon->code,
            'discount_value' => $coupon->discount_value,
            'discount_type' => $coupon->discount_type,
            'course_id' => $course->id,
            'user_id' => Auth::id(),
            'applied_at' => now()->timestamp,
            'expires_at' => $coupon->valid_until->timestamp
        ];

        $coupon->increment('used_count');

        // Store in session
        $request->session()->put('applied_coupon', $couponData);


        return redirect()->route('user.courses.show', $course->id)->with('success', 'Coupon applied!')->with('coupon_data', $couponData);
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
