<?php

namespace App\Services;

use App\Models\Purchase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;

class PurchaseService
{




    public function paginateUserPurchases(int $perPage): LengthAwarePaginator
    {
        // return  Purchase::with(['user:id,name,email', 'orderItems'])
        //     ->where('user_id', Auth::id())
        //     ->latest()
        //     ->paginate($perPage);

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

        return Purchase::whereId($purchaseId)
            ->firstOrFail()
            ->delete();
    }
}


  // this is only for User who can see the Purchases
    //  public function paginateUserPurchases(int $perPage, string $status = 'completed'): Paginator
    // {

    //     return Purchase::with(['user:id,name,email'])
    //         ->where('user_id', Auth::id())
    //         ->where('status', $status)
    //         ->latest()
    //         ->paginate($perPage);
    // }


    // public function paginateUserPurchases(int $perPage): LengthAwarePaginator
    // {
    //     $purchases = Purchase::with(['user:id,name,email'])
    //         ->where('user_id', Auth::id())
    //         ->latest()
    //         ->paginate($perPage);

    //     // Get all unique course IDs from all paginated purchases
    //     $courseIds = $purchases->getCollection()
    //         ->pluck('courses')
    //         ->flatMap(function ($courseData) {
    //             return is_string($courseData)
    //                 ? (json_decode($courseData, true) ?? [])
    //                 : (is_array($courseData) ? $courseData : []);
    //         })
    //         ->unique()
    //         ->values();

    //     // Get all needed courses in one query
    //     $courses = $courseIds->isNotEmpty()
    //         ? Course::whereIn('id', $courseIds)
    //         ->select('id', 'title')
    //         ->get()
    //         ->keyBy('id')
    //         : collect();

    //     // Map courses to purchases
    //     $purchases->getCollection()->transform(function ($purchase) use ($courses) {
    //         $courseData = $purchase->courses;
    //         $courseIds = is_string($courseData)
    //             ? (json_decode($courseData, true) ?? [])
    //             : (is_array($courseData) ? $courseData : []);

    //         $purchase->courses = collect($courseIds)->map(function ($courseId) use ($courses) {
    //             return [
    //                 'id' => $courseId,
    //                 'title' => $courses[$courseId]->title ?? 'Unknown Course'
    //             ];
    //         })->toArray();

    //         return $purchase;
    //     });

    //     return $purchases;
    // }
