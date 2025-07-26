<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Services\CouponService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    protected CouponService $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    public function index()
    {

        $coupons = $this->couponService->paginateCoupons(10);

        return Inertia::render('admin/coupons', ['coupons' => $coupons]);
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons',
            'description' => 'nullable|string|max:255',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->discount_type === 'percentage' && ($value < 1 || $value > 100)) {
                        $fail('Percentage discount must be between 1% and 100%');
                    }
                    if ($request->discount_type === 'fixed_amount' && $value < 0) {
                        $fail('Fixed amount cannot be negative');
                    }
                }
            ],
            'valid_from' => 'required|date|after_or_equal:today',
            'valid_until' => 'required|date|after:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'sometimes|boolean'
        ], [
            'code.unique' => 'This coupon code already exists',
            'valid_until.after' => 'End date must be after start date'
        ]);

        $new_coupon = $this->couponService->createCoupon($validated);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon Added Successfully')
            ->with('data', $new_coupon);
    }


    public function show(string $id)
    {
        //
    }



    public function update(Request $request, Coupon $coupon)
    {

        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'description' => 'nullable|string|max:255',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->discount_type === 'percentage' && ($value < 1 || $value > 100)) {
                        $fail('Percentage discount must be between 1% and 100%');
                    }
                    if ($request->discount_type === 'fixed_amount' && $value < 0) {
                        $fail('Fixed amount cannot be negative');
                    }
                }
            ],
            'valid_from' => 'required|date|after_or_equal:today',
            'valid_until' => 'required|date|after:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'sometimes|boolean'
        ], [
            'code.unique' => 'This coupon code already exists',
            'valid_until.after' => 'End date must be after start date'
        ]);

        $this->couponService->updateCoupon($coupon->id, $validated);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon Updated Successfully');
    }


    public function destroy(int $id)
    {


        $this->couponService->deleteCoupon($id);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon Deleted Successfully');
    }
}
