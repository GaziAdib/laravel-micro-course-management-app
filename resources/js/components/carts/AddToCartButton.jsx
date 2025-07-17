import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const AddToCartButton = ({ course }) => {

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
                disabled={isInCart}
                className='cursor-pointer'
            >
                {isInCart ? 'In Cart' : 'Add to Cart'}
            </Button>
        </div>
    );
}

export default AddToCartButton
