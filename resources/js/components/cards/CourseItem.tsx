import { Link} from '@inertiajs/react';
import { Clock, Layers, MessageSquare, Star } from 'lucide-react';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import AddToCartButton from '@/components/carts/AddToCartButton';

const CourseItem = ({ course }) => {
    return (
        <Card key={course.id} className="relative h-full flex flex-col hover:shadow-lg transition-all border border-border">
            {course.is_featured && (
                <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-green-900 border-green-200 border-2 text-white flex items-center gap-1 text-xs px-2 py-0.5 shadow-sm">
                        <Star className="h-3 w-3 text-white" />
                        Featured
                    </Badge>
                </div>
            )}

            <CardHeader className="p-0">
                <div className="aspect-video overflow-hidden rounded-t-md bg-muted">
                    <img
                        src={course.image_url || 'https://i.ytimg.com/vi/p0iWbtHPel4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAr8RkZINpmZyn-m1gZbZZLwiDHhg'}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
            </CardHeader>

            <CardContent className="flex-grow p-5 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <Badge variant="outline">{course.category.name}</Badge>
                    <Badge
                        variant={
                            course.level === 'beginner' ? 'success' :
                                course.level === 'intermediate' ? 'secondary' :
                                    'destructive'
                        }
                    >
                        {course.level}
                    </Badge>
                </div>

                <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                    {course.title}
                </CardTitle>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        <span>{course.modules?.length || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{course.reviews?.length || 0} Reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-center text-sm">
                    {course.is_paid ? (
                        <span className="font-extrabold text-primary">$ {course.price}</span>
                    ) : (
                        <Badge variant="success">Free</Badge>
                    )}
                </div>
            </CardContent>



            <CardFooter className="px-4 pt-0">
                <div className="flex gap-3 w-full">
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1 hover:bg-primary/10"
                    >
                        <Link href={route('user.courses.show', course.id)}>
                            View Details
                        </Link>
                    </Button>

                    <AddToCartButton
                        course={course}
                    />
                </div>
            </CardFooter>
        </Card>
    )
}

export default CourseItem
