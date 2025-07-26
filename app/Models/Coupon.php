<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    // In app/Models/Coupon.php

    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'valid_from',
        'valid_until',
        'usage_limit',
        'used_count',
        'is_active'
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean',
    ];


    public static function validate(string $code, Course $course): Coupon
    {
        $coupon = self::where('code', $code)
            ->where('is_active', true)
            ->where('valid_from', '<=', now())
            ->where('valid_until', '>=', now())
            ->firstOrFail();

        // Check usage limits
        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            throw new \Exception('This coupon has reached its usage limit');
        }

        // Optional: Check if coupon is already applied
        if ($course->coupon_code === $code) {
            throw new \Exception('This coupon is already applied');
        }

        return $coupon;
    }


    // check if the coupon code is valid or not
    public function isValid(): bool
    {
        $now = now();

        return $this->is_active
            && $now->between($this->valid_from, $this->valid_until)
            && ($this->usage_limit === null || $this->used_count < $this->usage_limit);
    }


    // calculate the dicount anount based on original price

    public function calculateDiscount($originalPrice): float
    {
        return $this->discount_type === 'percentage'
            ? $originalPrice * ($this->discount_value / 100)
            : min($this->discount_value, $originalPrice);
    }
}
