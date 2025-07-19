import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, StarHalf, StarOff, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
const ReviewListings = ({ reviews }) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {auth} = usePage().props;


    const handleDelete = (review) => {
        setIsDeleting(true);
        router.delete(route('user.reviews.destroy', { course: review.course_id, review: review.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Review deleted successfully');
                // Optional: Update local state if needed
            },
            onError: (errors) => {
                toast.error(errors.message || 'Failed to delete review');
            },
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
            }
        });
    };


    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                        {star <= rating ? (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                            <Star className="h-4 w-4 text-gray-300" />
                        )}
                    </span>
                ))}
                <span className="ml-1 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
            </div>
        );
    };

    const getInitials = (name) => {
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
    };



    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Course Reviews ({reviews?.length})</h2>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1">
                        {reviews?.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                    </Badge>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3">
                    {reviews?.map((review) => (
                        <Card key={review.id} className="h-full transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center space-x-3 space-y-0 pb-2">



                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={review.user?.avatar_url} alt={review.user?.name} />
                                    <AvatarFallback>{getInitials(review.user.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-base font-medium">
                                        {review.user.name}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {review.user.email}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {renderStars(review.rating)}
                                <p className="text-sm dark:text-gray-200 line-clamp-4">
                                    {review.content}
                                </p>

                            </CardContent>
                            <CardFooter className="text-xs text-muted-foreground">
                                {format(new Date(review.created_at), 'MMMM d, yyyy')}

                            </CardFooter>

                            {/* Delete Button - Only show if user can delete */}


                            {(review.user_id === auth?.user?.id || auth?.user?.role === 'admin')  &&
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 mx-auto rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleDelete(review)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            }


                        </Card>
                    ))}
                </div>


            )}
        </div>
    );
};

export default ReviewListings;
