import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

const AddToCartButton = ({ course, isCoursePurchased }) => {

    const { cart, addToCart } = useCart();

    const isInCart = cart.some(item => item.course.id === course.id);


    const handleAddToCart = (course) => {
        try {
            addToCart(course);
            toast.success(`${course.title} has been added to your cart`, {
            description: `Price: $${course.price}`,
            position: 'bottom-right',
            duration: 3000,
        });

        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <div>
            <Button
                onClick={() => handleAddToCart(course)}
                disabled={isInCart || isCoursePurchased}
                className='cursor-pointer'
            >
               {isCoursePurchased ? 'Purchased' : isInCart ? 'In Cart' : 'Add to Cart'}
            </Button>
        </div>
    );
}

export default AddToCartButton
