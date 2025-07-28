"use client";

import { useForm, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X } from "lucide-react";
import { toast } from 'sonner';
import { useState } from 'react';

export default function ApplyCoupon({ course }) {

    const { props } = usePage();

    const [code, setCode] = useState('');

    const { flash, applied_coupon } = usePage().props;



    const { data, setData, post, processing, errors } = useForm({
        code: ''
    });

    const applyCoupon = () => {
        post(route('user.apply.coupon', { course: course.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Coupon Applied!')
                setData('code', '');
            },
            onError: (errors) => {
                console.log('erors', errors);
                toast.error('something went wrong')
            }
        });
    };

    const removeCoupon = () => {
        post(route('courses.remove-coupon', course.id), {
            preserveScroll: true,
            onSuccess: () => setData('code', ''),
        });
    };

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Apply Coupon Code
            </Label>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="SUMMER24"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        className={`pr-10 border-2 border-gray-500 my-2 ${errors.code ? 'border-red-500' : ''}`}
                        disabled={processing}
                    />
                    {data.code && !processing && (
                        <button
                            onClick={() => setData('code', '')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <Button
                    onClick={applyCoupon}
                    disabled={processing || !data.code.trim()}
                    className="min-w-[80px] my-2"
                >
                    {processing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        'Apply'
                    )}
                </Button>
            </div>

            {errors.code && (
                <p className="text-sm text-red-600">{errors.code}</p>
            )}


        </div>
    );
}
