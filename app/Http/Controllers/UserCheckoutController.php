<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserCheckoutController extends Controller
{
    public function showCheckouts(Request $request)
    {
        // Make sure this path matches exactly with your file structure
        return Inertia::render('user/Checkouts/Index'); // lowercase 'user' if your folder is lowercase
    }
}
