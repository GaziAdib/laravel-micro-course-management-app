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
            'name' => 'required|string|max:255|unique:coupons',
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
            'name' => 'required|string|max:255',
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
