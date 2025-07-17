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


import { X } from 'lucide-react'
import { useCart } from '../../../contexts/CartContext';
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

function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Course Image */}
        <div className="sm:w-1/3">
          <img
            src={item.course.image_url || '/placeholder-course.jpg'}
            alt={item.course.title}
            className="w-full h-full object-cover rounded-l-lg"
            style={{ minHeight: '200px' }}
          />
        </div>

        {/* Course Details */}
        <div className="sm:w-2/3 p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{item.course.title}</h2>
              <p className="text-sm text-muted-foreground mb-2 mx-1 py-1">
                {item.course.category?.name || 'No Category'}
              </p>
              <p className="text-sm rounded-2xl inline-block px-2 bg-gray-900 mx-auto line-clamp-2 mb-4">
                 {item.course.level}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(item.quantity + 1)}
              >
                +
              </Button>
            </div>

            <div className="text-lg font-bold">
              ${(item.course.price * item.quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
