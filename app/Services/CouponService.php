<?php

namespace App\Services;

use App\Models\Coupon;
use Illuminate\Contracts\Pagination\Paginator;

class CouponService
{
    public function paginateCoupons(int $perPage = 10): Paginator
    {
        return Coupon::paginate($perPage);
    }

    public function createCoupon(array $data): Coupon
    {
        return Coupon::create($data);
    }

    public function updateCoupon($id, array $data): bool
    {
        $coupon = Coupon::where('id', $id)
            ->firstOrFail();

        return $coupon->update($data);
    }

    public function deleteCoupon(int $id): bool
    {
        $coupon = Coupon::where('id', $id)
            ->firstOrFail();

        return $coupon->delete();
    }


}
