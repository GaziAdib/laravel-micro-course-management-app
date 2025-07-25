<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    // In app/Models/Coupon.php
    protected $casts = [
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'applicable_courses' => 'array',
        'is_active' => 'boolean',
    ];


    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function isApplicableToCourse($courseId): bool
    {
        if (empty($this->applicable_courses)) {
            return true; // Applies to all courses
        }

        return in_array($courseId, $this->applicable_courses);
    }

    public function isValid(): bool
    {
        $now = now();

        return $this->is_active
            && $now->between($this->valid_from, $this->valid_until)
            && ($this->usage_limit === null || $this->used_count < $this->usage_limit);
    }



    public function calculateDiscount($originalPrice): float
    {
        return $this->discount_type === 'percentage'
            ? $originalPrice * ($this->discount_value / 100)
            : min($this->discount_value, $originalPrice);
    }
}
