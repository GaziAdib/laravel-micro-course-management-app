import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const AddToCartButton = ({ course }) => {

    const { cart, addToCart } = useCart();

    const isInCart = cart.some(item => item.course.id === course.id);

    return (
        <div>
            <Button
                onClick={() => addToCart(course)}
                disabled={isInCart}
                className='cursor-pointer'
            >
                {isInCart ? 'In Cart' : 'Add to Cart'}
            </Button>
        </div>
    );
}

export default AddToCartButton
