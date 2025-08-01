import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const AddToCartButton = ({ course, isCoursePurchased, finalPrice, isCouponAppliedForThisCourse }) => {


    const { cart, addToCart } = useCart();

    const priceToShow = isCouponAppliedForThisCourse ? finalPrice : course.price;

    const isInCart = cart.some(item => item.course.id === course.id);


    const handleAddToCart = (course) => {
        try {
            addToCart({
                ...course,
                price: priceToShow
            });
            toast.success(`${course.title} has been added to your cart`, {
            description: `Price: $${priceToShow}`,
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
