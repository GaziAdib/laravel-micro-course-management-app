<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserCartController extends Controller
{
    public function showCarts(Request $request)
    {
        // Make sure this path matches exactly with your file structure
        return Inertia::render('user/Carts/Index'); // lowercase 'user' if your folder is lowercase
    }
}
