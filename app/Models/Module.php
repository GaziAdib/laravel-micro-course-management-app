<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{

    public function lessons() {
        return $this->hasMany(Lesson::class);
    }

    public function course() {
        return $this->belongsToy(Course::class);
    }
}
