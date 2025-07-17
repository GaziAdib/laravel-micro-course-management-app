<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        // Payment identification
        'payment_gateway',
        'transaction_id',

        // Customer information
        'customer_mobile',
        'customer_email',
        'customer_address',

        // Payment details
        'amount_paid',
        'currency',
        // 'discount_amount',
        // 'final_amount',

        // Gateway-specific fields
        'bkash_trxId',
        'bank_receipt_no',

        // Status & timestamps
        'status',
        'purchased_at',

        // Foreign keys
        'user_id',
        'courses',
        // 'coupon_id'
    ];


    protected $casts = [
        'purchased_at'     => 'datetime',  // Converts to Carbon instance
        'amount'           => 'decimal:2', // Ensures 2 decimal places
        'discount_amount'  => 'decimal:2',
        'final_amount'     => 'decimal:2',
        'courses' => 'array',
        'applicable_courses' => 'array',   // If storing JSON (e.g., for coupons)
        'is_active'        => 'boolean',   // If you have status flags
    ];
    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }
}
