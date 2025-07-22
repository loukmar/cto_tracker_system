<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('work_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->foreignId('work_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('status_id')->constrained()->onDelete('cascade');
            $table->date('work_date');
            $table->string('title');
            $table->text('description');
            $table->integer('hours_spent')->default(0);
            $table->json('kpi_metrics')->nullable();
            $table->string('location')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'work_date']);
            $table->index(['department_id', 'work_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('work_entries');
    }
};