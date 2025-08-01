<?php

namespace App\Services;

use App\Models\Purchase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;

class PurchaseService
{

    public function paginateUserPurchases(int $perPage): LengthAwarePaginator
    {


        return Purchase::query()
        ->with([
            'user:id,name,email',
            'orderItems' => function ($query) {
                $query->select([
                    'id',
                    'purchase_id',
                    'course_data',
                    'quantity',
                    'total_price',
                    'created_at'
                ]);
            }
        ])
        ->where('user_id', Auth::id())
        ->select([
            'id',
            'user_id',
            'payment_gateway',
            'amount_paid',
            'bkash_trxId',
            'bank_receipt_no',
            'customer_email',
            'customer_mobile',
            'status',
            'created_at'
        ])
        ->latest()
        ->paginate($perPage);
    }



    public function paginateAllPurchasesForAdmin(int $perPage): LengthAwarePaginator
    {
        return Purchase::query()
        ->with([
            'user:id,name,email',
            'orderItems' => function ($query) {
                $query->select([
                    'id',
                    'purchase_id',
                    'course_data',
                    'quantity',
                    'total_price',
                    'created_at'
                ]);
            }
        ])
        ->select([
            'id',
            'user_id',
            'payment_gateway',
            'bkash_trxId',
            'bank_receipt_no',
            'amount_paid',
            'customer_email',
            'customer_mobile',
            'status',
            'created_at'
        ])
        ->latest()
        ->paginate($perPage);
    }



    public function changePurchaseStatusByAdmin(int $purchaseId, string $status): bool
    {
        return Purchase::whereId($purchaseId)
            ->firstOrFail()
            ->update(['status' => $status]);
    }


    public function deletePurchaseByAdmin(int $purchaseId): bool
    {

        return Purchase::where('id', $purchaseId)
            ->firstOrFail()
            ->delete();
    }
}

