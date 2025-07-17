import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input} from '@/components/ui/input'
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

const breadcrumbs = [
    {
        title: 'Carts',
        href: '/user/carts',
    },
];
export default function CartPage() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart()

  return (
    <AppLayout breadcrumbs={breadcrumbs}>

      <Head title="Your Cart" />

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Your Carts</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Column */}
          <div className="lg:col-span-2">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
                <Link href="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cart?.map((item) => (
                  <CartItem
                    key={item.course.id}
                    item={item}
                    onRemove={() => removeFromCart(item.course.id)}
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
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
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
