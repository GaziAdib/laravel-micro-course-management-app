<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Contracts\Pagination\Paginator;

class CategoryService
{
    public function paginateCategories(int $perPage = 10): Paginator
    {
        return Category::withCount('courses')->latest()->paginate($perPage);
    }

    public function createCategory(array $data): Category
    {
        return Category::create($data);
    }

    public function findCategory(int $id): Category
    {
        return Category::findOrFail($id);
    }

    public function updateCategory(int $id, array $data): bool
    {
        return Category::findOrFail($id)->update($data);
    }

    public function deleteCategory(int $id): bool
    {

        return Category::findOrFail($id)->delete();

    }

}
