import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface Course {
    id: number;
}

interface ReviewFormData {
    content: string;
    rating: number;
    [key: string]: any;
}

interface CourseReviewFormProps {
    course: Course;
}

export default function CourseReviewForm({ course }: CourseReviewFormProps) {
    const [rating, setRating] = useState<number>(1);
    const [hoverRating, setHoverRating] = useState<number>(1);

    const { data, setData, post, processing, errors, reset } = useForm<ReviewFormData>({
        content: '',
        rating: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user.reviews.store', { course: course.id }), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                console.error('Review submission failed:', errors);
            }
        });
    };

    const handleRatingClick = (selectedRating: number) => {
        setRating(selectedRating);
        setData('rating', selectedRating);
    };

    return (
        <Card className="w-full max-w-2xl my-5 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Add Your Review</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = star <= (hoverRating || rating);
                            return (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none"
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                                >
                                    {isFilled ? (
                                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                    ) : (
                                        <Star className="h-6 w-6 text-gray-300" />
                                    )}
                                </button>
                            );
                        })}
                        <span className="ml-2 text-sm font-medium text-gray-600">
                            {rating > 0 ? `${rating} out of 5` : 'Select rating'}
                        </span>
                    </div>
                    {errors.rating && (
                        <p className="text-sm text-red-500">{errors.rating}</p>
                    )}

                    <div className="space-y-2">
                        <Textarea
                            id="content"
                            value={data.content}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setData('content', e.target.value)
                            }
                            placeholder="Share your experience with this course..."
                            className="min-h-[120px]"
                        />
                        {errors.content && (
                            <p className="text-sm text-red-500">{errors.content}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t px-6 py-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}















// import { useState } from 'react';
// import { useForm } from '@inertiajs/react';
// import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Textarea } from '@/components/ui/textarea';
// import { Star, StarHalf, StarOff } from 'lucide-react';

// export default function CourseReviewForm({ course }) {
//     const [rating, setRating] = useState(1);
//     const [hoverRating, setHoverRating] = useState(1);
//     const { data, setData, post, processing, errors, reset } = useForm({
//         content: '',
//         rating: 0
//     });

//     const handleSubmit = (e:) => {
//         e.preventDefault();

//         post(route('user.reviews.store', { course: course.id }), {
//             content: data.content,
//             rating: Number(data.rating), // Ensure numeric value
//             preserveScroll: true,
//             onSuccess: () => reset(),
//             onError: (errors) => {
//                 console.error('Review submission failed:', errors);
//             }
//         });
//     };

//     const handleRatingClick = (selectedRating:number) => {
//         setRating(selectedRating);
//         setData('rating', selectedRating);
//     };

//     return (
//         <Card className="w-full max-w-2xl my-5 shadow-lg">
//             <CardHeader>
//                 <CardTitle className="text-xl font-semibold">Add Your Review</CardTitle>
//             </CardHeader>
//             <form onSubmit={handleSubmit}>
//                 <CardContent className="space-y-4">
//                     <div className="flex items-center gap-1">
//                         {[1, 2, 3, 4, 5].map((star) => {
//                             const isFilled = star <= (hoverRating || rating);
//                             return (
//                                 <button
//                                     key={star}
//                                     type="button"
//                                     className="focus:outline-none"
//                                     onClick={() => handleRatingClick(star)}
//                                     onMouseEnter={() => setHoverRating(star)}
//                                     onMouseLeave={() => setHoverRating(0)}
//                                     aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
//                                 >
//                                     {isFilled ? (
//                                         <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
//                                     ) : (
//                                         <Star className="h-6 w-6 text-gray-300" />
//                                     )}
//                                 </button>
//                             );
//                         })}
//                         <span className="ml-2 text-sm font-medium text-gray-600">
//                             {rating > 0 ? `${rating} out of 5` : 'Select rating'}
//                         </span>
//                     </div>
//                     {errors.rating && (
//                         <p className="text-sm text-red-500">{errors.rating}</p>
//                     )}

//                     <div className="space-y-2">
//                         <Textarea
//                             id="content"
//                             value={data.content}
//                             onChange={(e) => setData('content', e.target.value)}
//                             placeholder="Share your experience with this course..."
//                             className="min-h-[120px]"
//                         />
//                         {errors.content && (
//                             <p className="text-sm text-red-500">{errors.content}</p>
//                         )}
//                     </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-end border-t px-6 py-4">
//                     <Button type="submit" disabled={processing}>
//                         {processing ? 'Submitting...' : 'Submit Review'}
//                     </Button>
//                 </CardFooter>
//             </form>
//         </Card>
//     );
// }
