<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserCouponController extends Controller
{
     public function applyCoupon(Request $request, Course $course)
    {
        $validated = $request->validate(['code' => 'required|string']);

        $coupon = Coupon::whereRaw('LOWER(TRIM(code)) = ?', [strtolower(trim($validated['code']))])
            ->where('is_active', true)
            ->whereDate('valid_from', '<=', now())
            ->whereDate('valid_until', '>=', now())
            ->firstOrFail();


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


        $request->session()->put('applied_coupon', $couponData);


        return redirect()->route('user.courses.show', $course->id)->with('success', 'Coupon applied!')->with('coupon_data', $couponData);

    }
}
