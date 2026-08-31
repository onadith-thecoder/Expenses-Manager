<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;

class ExpenseController extends Controller
{

    use AuthorizesRequests;
   /**  public function __construct()
    *{
     *   $this->authorizeResource(Expense::class, 'expense');
    *} 
    */

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expenses = Expense::where('user_id', auth()->id())
        ->orderBy('date', 'desc')
        ->get();

        return ExpenseResource::collection($expenses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpenseRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $expense = Expense::create($validated);

         return (new ExpenseResource($expense))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        $this->authorize('view', $expense);
        return new ExpenseResource($expense);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $this->authorize('update', $expense);
        $expense->update($request->validated());
        
        return new ExpenseResource($expense);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $this->authorize('delete', $expense);
        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully.']);
    }
}
