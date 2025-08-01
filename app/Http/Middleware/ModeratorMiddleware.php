<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ModeratorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if (!$request->user()) {
            return redirect()->route('login');
        }

        if ($request->user()->role !== 'moderator') {
            return redirect('/dashboard'); // Or abort(403)
        }

        return $next($request);
    }
}
