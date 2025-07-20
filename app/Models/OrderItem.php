<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{

     protected $fillable = [
        'purchase_id',
        'course_data',
        'total_price',
        'coupon_code',
        'quantity',
        'discount_amount'
    ];

    protected $casts = [
        'course_data' => 'array'
    ];

    public function purchase()
    {
        $this->belongsTo(Purchase::class);
    }

}
