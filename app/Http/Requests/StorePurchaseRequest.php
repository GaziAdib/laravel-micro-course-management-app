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

            // Order items validation
            'order_items' => 'required|array|min:1',
            'order_items.*.course_data' => [
                'required',
                'array',
                function ($attribute, $value, $fail) {
                    $requiredFields = ['id', 'title', 'price'];
                    foreach ($requiredFields as $field) {
                        if (!isset($value[$field])) {
                            $fail("The course_data must contain {$field} field.");
                        }
                    }
                }
            ],

            'order_items' => 'required|array|min:1',
            'order_items.*.course_data' => 'required|array',
            'order_items.*.course_data.id' => 'required|integer',
            'order_items.*.course_data.price' => 'required|numeric|min:0',
            'order_items.*.quantity' => 'required|integer|min:1',
            'order_items.*.coupon_code' => 'nullable|string|max:50',
            'order_items.*.discount_amount' => 'nullable|numeric|min:0'

        ];
    }

    public function messages()
    {
        return [
            'customer_mobile.regex' => 'Invalid Bangladeshi mobile format (e.g., 01712345678)',
            'customer_email.email' => 'Invalid email format (e.g., user@example.com)',
            'bkash_trxId.regex' => 'Bkash Transaction ID must be 10+ alphanumeric characters',
            'bank_receipt_no.min' => 'Bank receipt number must be at least 6 characters',

            'order_items.*.course_data.required' => 'Course data is required for each item',
            'order_items.*.course_data.id.integer' => 'Course ID must be an integer',
            'order_items.*.course_data.title.required' => 'Course title is required',
            'order_items.*.course_data.price.min' => 'Course price cannot be negative',
            'order_items.*.quantity.min' => 'Quantity must be at least 1',
        ];
    }




    // public function rules()
    // {
    //     return [
    //         'payment_gateway' => [
    //             'required',
    //             Rule::in(['Stripe', 'Bkash', 'Bank', 'Manual', 'Handcash']),
    //         ],
    //         'customer_mobile' => 'required|regex:/^01[3-9]\d{8}$/',
    //         'customer_email' => 'required|email:rfc,dns', // Strict email validation
    //         // Conditionally required fields
    //         'transaction_id' => [
    //             Rule::requiredIf(function () {
    //                 return $this->payment_gateway === 'Stripe';
    //             }),
    //             'string',
    //             'min:10',
    //         ],
    //         'bkash_trxId' => [
    //             Rule::requiredIf(function () {
    //                 return $this->payment_gateway === 'Bkash';
    //             }),
    //             'string',
    //             'regex:/^[A-Z0-9]{10,}$/',
    //         ],
    //         'bank_receipt_no' => [
    //             Rule::requiredIf(function () {
    //                 return $this->payment_gateway === 'Bank';
    //             }),
    //             'string',
    //             'min:6',
    //         ],
    //         'courses' => [
    //             'required',
    //             'array',
    //             'min:1',
    //         ],

    //         'courses.*' => [
    //             'integer', // or 'integer' if you're using course IDs
    //         ],



    //     ];
    // }
    // public function messages()
    // {
    //     return [
    //         'customer_mobile.regex' => 'Invalid Bangladeshi mobile format (e.g., 01712345678)',
    //         'customer_email.email' => 'Invalid email format (e.g., user@example.com)',
    //         'bkash_trxId.regex' => 'Bkash Transaction ID must be 10+ alphanumeric characters',
    //         'bank_receipt_no.min' => 'Bank receipt number must be at least 6 characters',
    //     ];
    // }


}
