import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { X } from 'lucide-react'

const  CartItem = ({ item, onRemove, onQuantityChange }) => {
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
export default CartItem
