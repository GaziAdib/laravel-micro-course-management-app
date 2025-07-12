<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{

    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {

        $categories = $this->categoryService->paginateCategories(10);

        return Inertia::render('admin/categories', ['categories' => $categories]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        $new_category = $this->categoryService->createCategory($validated);

        return redirect()->route('admin.categories.index')
        ->with('success', 'Category Added Successfully')
        ->with('data', $new_category);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $this->categoryService->updateCategory($id, $validated);

        return redirect()->route('admin.categories.index')
        ->with('success', 'Category Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $category = $this->categoryService->findCategory($id);

        if ($category->courses()->count() > 0) {
            return redirect()->route('admin.categories.index')
        ->with('success', 'Category Cannot be Deleted Because Courses Are associated with it!');
        }

        $this->categoryService->deleteCategory($id);

        return redirect()->route('admin.categories.index')
        ->with('success', 'Category Deleted Successfully');
    }
}
