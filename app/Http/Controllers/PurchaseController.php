<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class PurchaseController extends Controller
{

    protected PurchaseService $purchaseService;
    public function __construct(PurchaseService $purchaseService)
    {
        $this->purchaseService = $purchaseService;
    }

    public function showUserPurchases(Request $request)
    {

        if (!$request->user()->can('view', Purchase::class)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $purchases = $this->purchaseService->paginateUserPurchases(10, 'completed');

        return Inertia::render('user/Purchases/Index', ['purchases' => $purchases]);
    }

    public function adminShowAllPurchases(Request $request)
    {
        if (!$request->user()->can('viewAny', Purchase::class)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $purchases = $this->purchaseService->paginateAllPurchasesForAdmin(10);

        return Inertia::render('admin/purchases', [
            'purchases' => $purchases,
            'can' => [
                'updateStatus' => $request->user()->can('updateStatus', Purchase::class),
                'delete' => $request->user()->can('delete', Purchase::class),
            ]
        ]);
    }

    public function changeStatus(Request $request, Purchase $purchase)
    {

        if (!$request->user()->can('updateStatus', Purchase::class)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $this->purchaseService->changePurchaseStatusByAdmin($purchase->id, $request->status);

        return redirect()->route('admin.purchases.index')
            ->with('success', 'Purchase Updated Successfully');
    }

    public function destroyPurchase(Request $request, Purchase $purchase)
    {

        if (!$request->user()->can('delete', Purchase::class)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $this->purchaseService->deletePurchaseByAdmin($purchase->id);

        return redirect()->route('admin.purchases.index')
            ->with('success', 'Purchase Deleted Successfully');
    }
}
