<?php

namespace App\Models;

use App\CourseLevel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PHPUnit\Framework\Constraint\Count;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'duration',
        'is_paid',
        'level',
        'is_featured',
        'category_id'
    ];

    protected $casts = [
        'level' => CourseLevel::class
    ];


    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function lessons()
    {
        return $this->hasManyThrough(Lesson::class, Module::class, 'course_id', 'module_id', 'id', 'id');
    }

    public function coupons()
    {
        return $this->hasMany(Coupon::class);
    }
}
