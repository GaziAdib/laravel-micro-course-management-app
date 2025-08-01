<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Models\OrderItem;
use App\Models\Purchase;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserPurchaseController extends Controller
{

    protected PurchaseService $purchaseService;

    public function __construct(PurchaseService $purchaseService)
    {
        $this->purchaseService = $purchaseService;
    }


    public function purchaseCourse(StorePurchaseRequest $request)
    {



        $purchase = Purchase::create([
            'user_id' =>  Auth::user()->id,
            'payment_gateway' => $request->payment_gateway,
            'customer_mobile' => $request->customer_mobile,
            'customer_email' => $request->customer_email,
            'customer_address' => $request->customer_address,
            'amount_paid' => $request->amount_paid,
            'bank_receipt_no' => $request->bank_receipt_no,
            'bkash_trxId' => $request->bkash_trxId,
            'transaction_id' => $request->transaction_id,
            'status' => 'pending',
            'purchased_at' => now(),
        ]);

        // Create order items
        foreach ($request->order_items as $item) {
            OrderItem::create([
                'purchase_id' => $purchase->id,
                'course_data' => $item['course_data'],
                'quantity' => $item['quantity'],
                'total_price' => $item['course_data']['price'] * $item['quantity'],
                'coupon_code' => $item['coupon_code'] ?? null,
                'discount_amount' => $item['discount_amount'] ?? 0
            ]);
        }

        return redirect()->route('user.courses.index')
            ->with('success', 'Course Purchases Successfully');
    }


    public function showUserPurchases(Request $request)
    {

        if (!$request->user()->can('view', Purchase::class)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $purchases = $this->purchaseService->paginateUserPurchases(10);

        return Inertia::render('user/Purchases/Index', ['purchases' => $purchases]);

    }
}
