<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchaseRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules()
    {
        return [
            'payment_gateway' => [
                'required',
                Rule::in(['Stripe', 'Bkash', 'Bank', 'Manual', 'Handcash']),
            ],
            'customer_mobile' => 'required|regex:/^01[3-9]\d{8}$/',
            'customer_email' => 'required|email:rfc,dns', // Strict email validation
            // Conditionally required fields
            'transaction_id' => [
                Rule::requiredIf(function () {
                    return $this->payment_gateway === 'Stripe';
                }),
                'string',
                'min:10',
            ],
            'bkash_trxId' => [
                Rule::requiredIf(function () {
                    return $this->payment_gateway === 'Bkash';
                }),
                'string',
                'regex:/^[A-Z0-9]{10,}$/',
            ],
            'bank_receipt_no' => [
                Rule::requiredIf(function () {
                    return $this->payment_gateway === 'Bank';
                }),
                'string',
                'min:6',
            ],
        ];
    }
     public function messages()
    {
        return [
            'customer_mobile.regex' => 'Invalid Bangladeshi mobile format (e.g., 01712345678)',
            'customer_email.email' => 'Invalid email format (e.g., user@example.com)',
            'bkash_trxId.regex' => 'Bkash Transaction ID must be 10+ alphanumeric characters',
            'bank_receipt_no.min' => 'Bank receipt number must be at least 6 characters',
        ];
    }
}
