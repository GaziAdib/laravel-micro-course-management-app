<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
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
        $purchases = $this->purchaseService->paginateUserPurchases(10, 'completed');

        return Inertia::render('user/Purchases/Index', ['purchases' => $purchases]);
    }

    public function adminShowAllPurchases(Request $request)
    {
        $purchases = $this->purchaseService->paginateAllPurchasesForAdmin(10);

        return Inertia::render('admin/purchases', ['purchases' => $purchases]);
    }

    public function changeStatus(Request $request, Purchase $purchase)
    {
        $this->purchaseService->changePurchaseStatusByAdmin($purchase->id, $request->status);

        return redirect()->route('admin.purchases.index')
            ->with('success', 'Purchase Updated Successfully');
    }

    public function destroyPurchase(Purchase $purchase)
    {
        $this->purchaseService->deletePurchaseByAdmin($purchase->id);

        return redirect()->route('admin.purchases.index')
            ->with('success', 'Purchase Deleted Successfully');
    }

}


