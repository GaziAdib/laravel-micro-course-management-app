import { Head, Link, usePage, useRemember } from '@inertiajs/react';
import { Clock, Layers, Users, Star, ArrowLeft, BookOpen } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModuleLists from '@/components/listings/ModuleLists';
import CourseReviewForm from '@/components/forms/CourseReviewForm';
import ReviewListings from '@/components/listings/ReviewListings';
import AddToCartButton from '@/components/carts/AddToCartButton';
import ApplyCoupon from '@/components/forms/ApplyCoupon';
import { useEffect, useState } from 'react';

export default function CourseDetailPage({ course }) {

    const { course: data } = usePage().props;

    const { applied_coupon } = usePage().props;

    const isCouponAppliedForThisCourse =
        applied_coupon && applied_coupon?.course_id === course.id;

    const discountAmount = applied_coupon?.discount_type === 'percentage'
        ? (course.price * parseFloat(applied_coupon?.discount_value)) / 100
        : parseFloat(applied_coupon?.discount_value);

    const finalPrice = (course.price - Number(discountAmount)).toFixed(2);

    console.log('final price', finalPrice);



    // find avg Rating for this course
    const averageRating = data?.reviews?.length > 0
        ? (data?.reviews?.reduce((sum, review) => sum + review.rating, 0) / data?.reviews?.length)
        : 0;


    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);


    // count total lessons -> course.modules then lessons

    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);

    // review count function

    const formatReviewCount = (count) => {
        if (!count) return '0';

        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`.replace('.0', ''); // 1M, 1.5M
        }

        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`.replace('.0', ''); // 1k, 1.5k
        }

        return count.toString(); // Under 1000 shows actual number
    }

    const breadcrumbs = [
        {
            title: `Courses / ${course?.title} / Detail`,
            href: `/user/courses/${course?.id}`,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Button asChild variant="ghost" className="mb-6">
                    <Link href={route('user.courses.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Courses
                    </Link>
                </Button>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <div className="bg-dark rounded-lg shadow overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src={course.image_url || '/images/course-placeholder.jpg'}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4 md:p-6 lg:p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <Badge variant="secondary">
                                        {course.category.name}
                                    </Badge>
                                    <Badge variant={
                                        course.level === 'beginner' ? 'success' :
                                            course.level === 'intermediate' ? 'warning' :
                                                'destructive'
                                    }>
                                        {course.level}
                                    </Badge>

                                    <AddToCartButton course={course} finalPrice={finalPrice} isCouponAppliedForThisCourse={isCouponAppliedForThisCourse}  />

                                    <ApplyCoupon course={course} />
                                </div>

                                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>



                                <div className="flex items-center md:justify-start lg:justify-start justify-around gap-8 lg:gap-4 md:gap-6 mb-6">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="mr-2 h-4 w-4" />
                                        {course?.modules?.length} modules
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        {totalLessons}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        {/* Full stars */}
                                        {Array.from({ length: fullStars }).map((_, i) => (
                                            <Star key={`full-${i}`} className="h-4 w-4 fill-current text-yellow-500" />
                                        ))}

                                        {/* Half star */}
                                        {hasHalfStar && (
                                            <div className="relative h-4 w-4">
                                                <Star className="absolute h-4 w-4 fill-current text-gray-300" />
                                                <Star className="absolute h-4 w-4 fill-current text-yellow-500" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                                            </div>
                                        )}

                                        {/* Empty stars */}
                                        {Array.from({ length: emptyStars }).map((_, i) => (
                                            <Star key={`empty-${i}`} className="h-4 w-4 fill-current text-gray-300" />
                                        ))}

                                        {/* Rating text */}
                                        <span className="ml-2">
                                            {averageRating?.toFixed(1) || '0.0'} ({formatReviewCount(course?.reviews?.length)})
                                        </span>
                                    </div>
                                </div>

                                <div className="prose max-w-none mb-8 text-justify">
                                    {course.description}
                                </div>

                                <div className="prose max-w-none mb-8 text-xl text-green-400 text-justify">
                                    $ {isCouponAppliedForThisCourse ? finalPrice : course.price}
                                </div>

                                <h2 className="text-xl font-semibold mb-4">Course Modules ({course?.modules?.length})</h2>

                                <ModuleLists modules={course.modules} />

                                <div className='my-4 py-4'>
                                    <ReviewListings reviews={data?.reviews} />
                                </div>

                                <div className="prose my-4 py-4 max-w-none mb-8 text-justify">
                                    <h2 className="text-xl font-semibold mb-4">Course Reviews ({course?.reviews?.length})</h2>
                                    <CourseReviewForm course={course} />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </AppLayout>
    );
}



















// import { Head, Link, usePage } from '@inertiajs/react';
// import { Clock, Layers, Users, Star, ArrowLeft } from 'lucide-react';
// import AppLayout from '@/layouts/app-layout';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import ModuleLists from '@/components/listings/ModuleLists';
// import CourseReviewForm from  '@/components/forms/CourseReviewForm';
// import ReviewListings from  '@/components/listings/ReviewListings';


// export default function CourseDetailPage({ course }) {

//     const {course: data} = usePage().props;

//      console.log('reviews', data.reviews);


// const averageRating = data?.reviews?.length > 0
//         ? (data?.reviews?.reduce((sum, review) => sum + review.rating, 0) / data?.reviews?.length)
//         : 0;


//     const fullStars = Math.floor(averageRating);
//     const hasHalfStar = averageRating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     const breadcrumbs = [
//     {
//         title: `Courses / ${course?.title} / Detail`,
//         href: `/user/courses/${course?.id}`,
//     },
// ];
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title={course.title} />

//             <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//                 <Button asChild variant="ghost" className="mb-6">
//                     <Link href={route('user.courses.index')}>
//                         <ArrowLeft className="mr-2 h-4 w-4" />
//                         Back to Courses
//                     </Link>
//                 </Button>

//                 <div className="grid md:grid-cols-3 gap-8">
//                     {/* Main Content */}
//                     <div className="md:col-span-2">
//                         <div className="bg-dark rounded-lg shadow overflow-hidden">
//                             <div className="aspect-w-16 aspect-h-9">
//                                 <img
//                                     src={course.image_url || '/images/course-placeholder.jpg'}
//                                     alt={course.title}
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div>

//                             <div className="p-6">
//                                 <div className="flex items-center gap-4 mb-4">
//                                     <Badge variant="secondary">
//                                         {course.category.name}
//                                     </Badge>
//                                     <Badge variant={
//                                         course.level === 'beginner' ? 'success' :
//                                         course.level === 'intermediate' ? 'warning' :
//                                         'destructive'
//                                     }>
//                                         {course.level}
//                                     </Badge>
//                                 </div>

//                                 <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

//                                 <div className="flex items-center gap-4 mb-6">
//                                     <div className="flex items-center text-sm text-muted-foreground">
//                                         <Users className="mr-2 h-4 w-4" />
//                                         {course?.modules?.length} modules
//                                     </div>
//                                     <div className="flex items-center text-sm text-muted-foreground">
//                                         <Star className="mr-2 h-4 w-4" />
//                                         {/* {course.average_rating} ({course.reviews_count} reviews) */}
//                                         {averageRating.toFixed(1)} ({data.reviews.length}) ratings

//                                     </div>
//                                 </div>

//                                 <div className="prose max-w-none mb-8 text-justify">
//                                     {course.description}
//                                 </div>

//                                 <h2 className="text-xl font-semibold mb-4">Course Modules ({course?.modules?.length})</h2>

//                                 <ModuleLists modules={course.modules} />

//                                 <div className='my-4 py-4'>
//                                     <ReviewListings reviews={data?.reviews}  />
//                                 </div>

//                                 <div className="prose my-4 py-4 max-w-none mb-8 text-justify">
//                                     <h2 className="text-xl font-semibold mb-4">Course Reviews ({course?.reviews?.length})</h2>
//                                     <CourseReviewForm course={course} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>


//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
