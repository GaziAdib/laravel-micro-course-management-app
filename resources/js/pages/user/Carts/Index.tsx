import { Head, Link, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import AuthGuard from '@/components/gurds/AuthGuard';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

import { useCart } from '../../../contexts/CartContext';
import CartItem from '../../../components/carts/CartItem';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Carts',
        href: '/user/carts',
    },
];


export default function CartPage() {

    // const { auth } = usePage().props;
      // // Load cart from localStorage
    // useEffect(() => {
    //     if (auth?.user) {
    //         const savedCart = localStorage.getItem(`cart_${auth?.user?.id}`);
    //         setCarts(savedCart ? JSON.parse(savedCart) : []);
    //     }
    // }, [auth?.user]);

    const { cart, removeFromCart, cartTotal, clearCart } = useCart()


    const handleRemoveFromCart = (courseId) => {
        try {
            removeFromCart(courseId);
            toast.success(`course has been removed from your cart`, {
                position: 'bottom-right',
                duration: 3000,
            });

        } catch (error) {
            console.log('error', error)
        }
    }

    return (
            <AppLayout breadcrumbs={breadcrumbs}>

                <Head title="Your Cart" />

                <div className="container mx-auto py-8 px-4 lg:px-2 md:px-3">
                    <h1 className="text-xl lg:text-3xl md:text-2xl font-bold mb-8">Your Carts</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Column */}
                        <div className="lg:col-span-2">
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
                                    <Link href="/user/courses">
                                        <Button>Browse Courses</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-5 px-2">
                                    {cart?.map((item) => (
                                        <CartItem
                                            key={item.course.id}
                                            item={item}
                                            onRemove={() => handleRemoveFromCart(item.course.id)}
                                        // onQuantityChange={(qty) => updateQuantity(item.course.id, qty)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Order Summary Column */}
                        {cart.length > 0 && (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax</span>
                                            <span>$0.00</span>
                                        </div>
                                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        <Button asChild className="w-full" size="lg">
                                            <Link href="/user/checkouts" className="w-full">
                                                Proceed to Checkout
                                            </Link>
                                        </Button>
                                        <Link href="/user/courses" className="w-full">
                                            <Button variant="outline" className="w-full">
                                                Continue Shopping
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </AppLayout>


    )
}


