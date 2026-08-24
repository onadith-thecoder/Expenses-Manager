<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expenses = Expense::orderBy('date', 'desc')->get();
        return response()->json(['data' => $expenses]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpenseRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = 1; //have to change after sanctum auth is added
        $expense = Expense::create($validated);

        return response()->json(['data' => $expense], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        return response()->json(['data' => $expense]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());
        
        return response()->json(['data'=> $expense]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully.']);
    }
}
