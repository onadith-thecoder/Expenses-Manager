<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date->format('Y-m-d'),
            'cost' => (float) $this->cost,
            'description' => $this->description,
            'expense_type' => $this->expense_type,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
