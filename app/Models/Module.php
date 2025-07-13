<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{

    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'is_paid',
        'is_published',
        'order',
        'course_id'
    ];

    protected $casts = [
    'is_published' => 'boolean',
    'is_paid' => 'boolean',
    ];

    public function lessons() {
        return $this->hasMany(Lesson::class);
    }

    public function course() {
        return $this->belongsTo(Course::class);
    }
}
