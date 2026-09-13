<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Payment\RejectPaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminPaymentController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Payment::with('order');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('method')) {
            $query->where('payment_method', $request->input('method'));
        }

        $payments = $query->latest()
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'payments' => PaymentResource::collection($payments),
            'pagination' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $payment = Payment::with('order')->findOrFail($id);

        return response()->json([
            'success' => true,
            'payment' => new PaymentResource($payment),
        ]);
    }

    public function verify(Request $request, string $id): JsonResponse
    {
        $payment = Payment::findOrFail($id);
        $payment = $this->orderService->verifyPayment($payment, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Payment verified successfully.',
            'payment' => new PaymentResource($payment->load('order')),
        ]);
    }

    public function reject(RejectPaymentRequest $request, string $id): JsonResponse
    {
        $payment = Payment::findOrFail($id);
        $payment = $this->orderService->rejectPayment(
            $payment,
            $request->user(),
            $request->validated('reason'),
        );

        return response()->json([
            'success' => true,
            'message' => 'Payment rejected.',
            'payment' => new PaymentResource($payment->load('order')),
        ]);
    }

    public function proof(string $id)
    {
        $payment = Payment::findOrFail($id);

        if (! $payment->proof_image) {
            return response()->json([
                'success' => false,
                'message' => 'No payment proof available.',
            ], 404);
        }

        $path = $payment->proof_image;

        if (! Storage::disk('private')->exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Proof file not found.',
            ], 404);
        }

        $fullPath = Storage::disk('private')->path($path);
        $mime = mime_content_type($fullPath) ?: 'application/octet-stream';

        return response()->file($fullPath, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
        ]);
    }
}
