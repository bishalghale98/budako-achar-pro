<?php

namespace App\Http\Requests\Api\Order;

use App\Enums\OrderStatus;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $validValues = array_column(OrderStatus::cases(), 'value');

        return [
            'status' => ['required', 'string', 'in:' . implode(',', $validValues)],
        ];
    }
}
