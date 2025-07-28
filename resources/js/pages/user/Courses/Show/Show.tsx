import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, Layers, Users, Star, ArrowLeft, BookOpen, CheckCircle, Award, BarChart2, FileText, Globe, LifeBuoy, FileQuestionIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModuleLists from '@/components/listings/ModuleLists';
import CourseReviewForm from '@/components/forms/CourseReviewForm';
import ReviewListings from '@/components/listings/ReviewListings';
import AddToCartButton from '@/components/carts/AddToCartButton';
import ApplyCoupon from '@/components/forms/ApplyCoupon';
import { Progress } from '@/components/ui/progress';

export default function CourseDetailPage({ course, purchases, totalPurchasesCount, userProgressPercentage }) {
    const { course: data } = usePage().props;
    const { applied_coupon } = usePage().props;

    // find quiz info

    const totalQuizzess = course?.modules?.map((module) => module?.quiz).length


    // Coupon calculations
    const isCouponAppliedForThisCourse = applied_coupon?.course_id === course.id;
    const discountAmount = applied_coupon?.discount_type === 'percentage'
        ? (course.price * parseFloat(applied_coupon?.discount_value)) / 100
        : parseFloat(applied_coupon?.discount_value);
    const finalPrice = (course.price - Number(discountAmount)).toFixed(2);

    // Purchase logic
    const purchasedCourseIds = purchases?.data?.flatMap(purchase =>
        purchase?.order_items?.map(item => item.course_data.id)
    );
    const isCoursePurchased = (courseId: number) => purchasedCourseIds.includes(courseId);

    // Rating calculations
    const averageRating = data?.reviews?.length > 0
        ? (data?.reviews?.reduce((sum, review) => sum + review.rating, 0) / data?.reviews?.length)
        : 0;
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Course stats
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const totalDuration = course?.modules?.reduce((acc, module) => acc + module.duration, 0) || 0;

    const formatReviewCount = (count) => {
        if (!count) return '0';
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`.replace('.0', '');
        if (count >= 1000) return `${(count / 1000).toFixed(1)}k`.replace('.0', '');
        return count.toString();
    }

    const breadcrumbs = [
        { title: 'Courses', href: route('user.courses.index') },
        { title: course.title, href: route('user.courses.show', course.id) },
    ];

    const courseRequirements =
        [
            'Reactjs', 'Nextjs', 'Javascript', 'Laravel', 'Nodejs'
        ]


    const learning_outcomes = [
        'Master javascript', 'Nextjs Mastery', 'Backend Achitecture Builder', 'API Development'
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />

            <div className="bg-white dark:bg-black">
                {/* Blurred Gradient Background */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-green-400 via-cyan-400 to-indigo-400 opacity-20 blur-3xl rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>
                {/* Hero Section */}
                <div className="relative bg-white dark:bg-black overflow-hidden">
                    {/* Blurred Gradient Backgrounds */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-30 dark:opacity-20 blur-3xl rounded-full"></div>
                        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-gradient-to-tr from-green-400 via-cyan-400 to-indigo-500 opacity-30 dark:opacity-20 blur-3xl rounded-full"></div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <Button asChild variant="ghost" className="mb-6 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10">
                            <Link href={route('user.courses.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Courses
                            </Link>
                        </Button>

                        <div className="grid md:grid-cols-3 gap-8 items-start">
                            {/* Course Info */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white">
                                        {course.category.name}
                                    </Badge>
                                    <Badge variant={
                                        course.level === 'beginner' ? 'success' :
                                            course.level === 'intermediate' ? 'warning' : 'destructive'
                                    }>
                                        {course.level}
                                    </Badge>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{course.title}</h1>

                                <p className="text-lg text-gray-700 dark:text-white/90 max-w-3xl">
                                    {course.short_description || course.description.substring(0, 500) + '...'}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 text-gray-800 dark:text-white/80">
                                    <div className="flex items-center">
                                        <Users className="mr-2 h-5 w-5" />
                                        <span>{totalPurchasesCount} students</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="mr-2 h-5 w-5 fill-current text-yellow-400" />
                                        <span>{averageRating.toFixed(1)} ({formatReviewCount(course.reviews?.length)} reviews)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-5 w-5" />
                                        <span>{course.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Course Card */}
                            <div className="bg-white dark:bg-black rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <div className="aspect-w-16 aspect-h-9">
                                    <img
                                        src={course.image_url || '/images/course-placeholder.jpg'}
                                        alt={course.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>

                                <div className="p-4 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-gray-50 dark:bg-black rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ${isCouponAppliedForThisCourse ? finalPrice : course.price}
                                                {isCouponAppliedForThisCourse && (
                                                    <span className="ml-2 text-sm line-through text-gray-500 dark:text-gray-400">
                                                        ${course.price}
                                                    </span>
                                                )}
                                            </span>

                                            <div className="mt-2">
                                                <ApplyCoupon course={course} />
                                            </div>

                                            {isCouponAppliedForThisCourse && (
                                                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                                                    Coupon Applied! Saved ${discountAmount.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <AddToCartButton
                                        course={course}
                                        isCoursePurchased={isCoursePurchased(course.id)}
                                        finalPrice={finalPrice}
                                        isCouponAppliedForThisCourse={isCouponAppliedForThisCourse}
                                    />

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center">
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                            <span className='text-gray-900 dark:text-white'>Full lifetime access</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Award className="mr-2 h-4 w-4 text-blue-500" />
                                            <span className='text-gray-900 dark:text-white'>Certificate of completion</span>
                                        </div>
                                        <div className="flex items-center">
                                            <LifeBuoy className="mr-2 h-4 w-4 text-purple-500" />
                                            <span className='text-gray-900 dark:text-white'>24/7 support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Main Content */}
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Content */}
                        <div className="md:col-span-2 space-y-12">
                            {/* What You'll Learn */}
                            <section className="bg-gray-50 dark:bg-gray-950 rounded-xl p-6">
                                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {learning_outcomes?.map((outcome, index) => (
                                        <div key={index} className="flex items-start">
                                            <CheckCircle className="mt-1 mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                                            <span>{outcome}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Course Content */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Course Content</h2>
                                    <div className="text-sm text-gray-500">
                                        {course?.modules?.length} modules • {totalLessons} lessons
                                    </div>
                                </div>

                                <ModuleLists modules={course.modules} />
                            </section>

                            {/* Requirements */}
                            <section>
                                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                                <ul className="space-y-2 list-disc pl-5">
                                    {courseRequirements?.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </section>

                            {/* Description */}
                            <section>
                                <h2 className="text-2xl lg:text-3xl text-justify  md:text-2xl font-bold mb-4">Description</h2>
                                <div className="prose max-w-none text-gray-700 dark:text-gray-300">
                                    {course.description}
                                </div>
                            </section>

                            {/* Instructor */}
                            {/* <section className="bg-gray-50 dark:bg-black border-2 rounded-xl p-6">
                                <h2 className="text-2xl font-bold mb-4">Instructor</h2>
                                <div className="flex items-start gap-4">
                                    <img
                                        src={course.instructor.avatar || '/images/avatar-placeholder.png'}
                                        alt={course.instructor.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">Instructor Name</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Gazi Adib</p>
                                        <div className="flex items-center mt-2">
                                            <Star className="h-4 w-4 fill-current text-yellow-500 mr-1" />
                                            <span className="text-sm">
                                                {5} Instructor Rating
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span className="text-sm">{5} Reviews</span>
                                            <span className="mx-2">•</span>
                                            <span className="text-sm">{10} Students</span>
                                        </div>
                                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                                            Gazi Adib BIo
                                        </p>
                                    </div>
                                </div>
                            </section> */}


                        </div>


                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Course Features */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
                                <h3 className="font-semibold text-lg">This course includes:</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center">
                                        <Clock className="mr-3 h-5 w-5 text-blue-500" />
                                        <span>{Math.floor(totalDuration / 60)} hours on-demand video</span>

                                    </li>
                                    <li className="flex items-center">
                                        <FileQuestionIcon className="mr-3 h-5 w-5 text-green-500" />
                                        <span>{totalQuizzess} Quizzess</span>
                                    </li>
                                    <li className="flex items-center">
                                        <FileText className="mr-3 h-5 w-5 text-green-500" />
                                        <span>{totalLessons} Lessons</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Globe className="mr-3 h-5 w-5 text-purple-500" />
                                        <span>Access on mobile and TV</span>
                                    </li>
                                    <li className="flex items-center">
                                        <BarChart2 className="mr-3 h-5 w-5 text-yellow-500" />
                                        <span>Assignments</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Award className="mr-3 h-5 w-5 text-red-500" />
                                        <span>Certificate of completion</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Progress for enrolled students */}
                            {isCoursePurchased(course.id) && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 space-y-3">
                                    <h3 className="font-semibold text-lg">Your Progress</h3>
                                    <Progress value={userProgressPercentage} className="h-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {/* 12 of {totalLessons} lessons completed (45%) */}
                                        {userProgressPercentage} % completed out of  100 %
                                    </p>
                                    <Button className="w-full" asChild>
                                        <Link href={route('user.course.classroom.index', { course: course.id })}>
                                            Continue Learning
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            {/* Share Course */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-3">
                                <h3 className="font-semibold text-lg">Share this course</h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <span className="sr-only">Facebook</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <span className="sr-only">LinkedIn</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>


                        </div>




                    </div>

                    {/* Reviews */}
                    <section className='my-5 py-5'>
                        <ReviewListings reviews={data?.reviews} />
                        <CourseReviewForm course={course} />
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}



























// import { Head, Link, usePage } from '@inertiajs/react';
// import { Clock, Layers, Users, Star, ArrowLeft, BookOpen, CheckCircle, Award, BarChart2, FileText, Globe, LifeBuoy, FileQuestionIcon } from 'lucide-react';
// import AppLayout from '@/layouts/app-layout';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import ModuleLists from '@/components/listings/ModuleLists';
// import CourseReviewForm from '@/components/forms/CourseReviewForm';
// import ReviewListings from '@/components/listings/ReviewListings';
// import AddToCartButton from '@/components/carts/AddToCartButton';
// import ApplyCoupon from '@/components/forms/ApplyCoupon';
// import { Progress } from '@/components/ui/progress';

// export default function CourseDetailPage({ course, purchases, totalPurchasesCount, userProgressPercentage }) {
//     const { course: data } = usePage().props;
//     const { applied_coupon } = usePage().props;

//     // find quiz info

//     const totalQuizzess = course?.modules?.map((module) => module?.quiz).length


//     // Coupon calculations
//     const isCouponAppliedForThisCourse = applied_coupon?.course_id === course.id;
//     const discountAmount = applied_coupon?.discount_type === 'percentage'
//         ? (course.price * parseFloat(applied_coupon?.discount_value)) / 100
//         : parseFloat(applied_coupon?.discount_value);
//     const finalPrice = (course.price - Number(discountAmount)).toFixed(2);

//     // Purchase logic
//     const purchasedCourseIds = purchases?.data?.flatMap(purchase =>
//         purchase?.order_items?.map(item => item.course_data.id)
//     );
//     const isCoursePurchased = (courseId: number) => purchasedCourseIds.includes(courseId);

//     // Rating calculations
//     const averageRating = data?.reviews?.length > 0
//         ? (data?.reviews?.reduce((sum, review) => sum + review.rating, 0) / data?.reviews?.length)
//         : 0;
//     const fullStars = Math.floor(averageRating);
//     const hasHalfStar = averageRating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     // Course stats
//     const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
//     const totalDuration = course?.modules?.reduce((acc, module) => acc + module.duration, 0) || 0;

//     const formatReviewCount = (count) => {
//         if (!count) return '0';
//         if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`.replace('.0', '');
//         if (count >= 1000) return `${(count / 1000).toFixed(1)}k`.replace('.0', '');
//         return count.toString();
//     }

//     const breadcrumbs = [
//         { title: 'Courses', href: route('user.courses.index') },
//         { title: course.title, href: route('user.courses.show', course.id) },
//     ];

//     const courseRequirements =
//         [
//             'Reactjs', 'Nextjs', 'Javascript', 'Laravel', 'Nodejs'
//         ]


//     const learning_outcomes = [
//         'Master javascript', 'Nextjs Mastery', 'Backend Achitecture Builder', 'API Development'
//     ]

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title={course.title} />

//             <div className="bg-white dark:bg-black">
//                 {/* Blurred Gradient Background */}
//   <div className="absolute inset-0 z-0 overflow-hidden">
//     <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
//     <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-green-400 via-cyan-400 to-indigo-400 opacity-20 blur-3xl rounded-full translate-x-1/3 translate-y-1/3"></div>
//   </div>
//                 {/* Hero Section */}
//                 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//                     <div className="max-w-7xl mx-auto">
//                         <Button asChild variant="ghost" className="mb-6 text-white hover:bg-white/10 dark:hover:bg-white/10">
//                             <Link href={route('user.courses.index')}>
//                                 <ArrowLeft className="mr-2 h-4 w-4" />
//                                 Back to Courses
//                             </Link>
//                         </Button>

//                         <div className="grid md:grid-cols-3 gap-8 items-start">
//                             <div className="md:col-span-2 space-y-6">
//                                 <div className="flex flex-wrap gap-2">
//                                     <Badge variant="secondary" className="bg-white/20 text-white">
//                                         {course.category.name}
//                                     </Badge>
//                                     <Badge variant={
//                                         course.level === 'beginner' ? 'success' :
//                                             course.level === 'intermediate' ? 'warning' :
//                                                 'destructive'
//                                     }>
//                                         {course.level}
//                                     </Badge>
//                                 </div>

//                                 <h1 className="text-3xl md:text-4xl font-bold text-white">{course.title}</h1>

//                                 <p className="text-lg text-white/90 max-w-3xl">{course.short_description || course.description.substring(0, 160) + '...'}</p>

//                                 <div className="flex flex-wrap items-center gap-6 text-white/90">
//                                     <div className="flex items-center">
//                                         <Users className="mr-2 h-5 w-5" />
//                                         <span>{totalPurchasesCount} students</span>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <Star className="mr-2 h-5 w-5 fill-current text-yellow-400" />
//                                         <span>{averageRating.toFixed(1)} ({formatReviewCount(course.reviews?.length)} reviews)</span>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <Clock className="mr-2 h-5 w-5" />
//                                         <span>{course.duration}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Course Card */}
//                             <div className="bg-white dark:bg-black rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
//                                 <div className="aspect-w-16 aspect-h-9">
//                                     <img
//                                         src={course.image_url || '/images/course-placeholder.jpg'}
//                                         alt={course.title}
//                                         className="w-full h-48 object-cover"
//                                     />
//                                 </div>

//                                 <div className="p-4 space-y-4">
//                                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-gray-50 dark:bg-black rounded-lg">
//                                         {/* Price Display */}
//                                         <div className="flex-1 min-w-0">
//                                             <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                                                 ${isCouponAppliedForThisCourse ? finalPrice : course.price}
//                                                 {isCouponAppliedForThisCourse && (
//                                                     <span className="ml-2 text-sm line-through text-gray-500 dark:text-gray-400">
//                                                         ${course.price}
//                                                     </span>
//                                                 )}

//                                                 {/* Coupon Form */}
//                                                 <div className="">
//                                                     <ApplyCoupon course={course} />
//                                                 </div>
//                                             </span>

//                                             {isCouponAppliedForThisCourse && (
//                                                 <div className="text-sm text-green-600 dark:text-green-400 mt-1">
//                                                     Coupon Applied! Saved ${discountAmount.toFixed(2)}
//                                                 </div>
//                                             )}
//                                         </div>


//                                     </div>

//                                     <AddToCartButton
//                                         course={course}
//                                         isCoursePurchased={isCoursePurchased(course.id)}
//                                         finalPrice={finalPrice}
//                                         isCouponAppliedForThisCourse={isCouponAppliedForThisCourse}
//                                     />

//                                     <div className="space-y-2 text-sm">
//                                         <div className="flex items-center">
//                                             <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
//                                             <span className='text-gray-900 dark:text-white'>Full lifetime access</span>
//                                         </div>
//                                         <div className="flex items-center">
//                                             <Award className="mr-2 h-4 w-4 text-blue-500" />
//                                             <span className='text-gray-900 dark:text-white'>Certificate of completion</span>
//                                         </div>
//                                         <div className="flex items-center">
//                                             <LifeBuoy className="mr-2 h-4 w-4 text-purple-500" />
//                                             <span className='text-gray-900 dark:text-white'>24/7 support</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//                     <div className="grid md:grid-cols-3 gap-8">
//                         {/* Left Content */}
//                         <div className="md:col-span-2 space-y-12">
//                             {/* What You'll Learn */}
//                             <section className="bg-gray-50 dark:bg-gray-950 rounded-xl p-6">
//                                 <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
//                                 <div className="grid sm:grid-cols-2 gap-4">
//                                     {learning_outcomes?.map((outcome, index) => (
//                                         <div key={index} className="flex items-start">
//                                             <CheckCircle className="mt-1 mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
//                                             <span>{outcome}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </section>

//                             {/* Course Content */}
//                             <section>
//                                 <div className="flex items-center justify-between mb-6">
//                                     <h2 className="text-2xl font-bold">Course Content</h2>
//                                     <div className="text-sm text-gray-500">
//                                         {course?.modules?.length} modules • {totalLessons} lessons
//                                     </div>
//                                 </div>

//                                 <ModuleLists modules={course.modules} />
//                             </section>

//                             {/* Requirements */}
//                             <section>
//                                 <h2 className="text-2xl font-bold mb-4">Requirements</h2>
//                                 <ul className="space-y-2 list-disc pl-5">
//                                     {courseRequirements?.map((req, index) => (
//                                         <li key={index}>{req}</li>
//                                     ))}
//                                 </ul>
//                             </section>

//                             {/* Description */}
//                             <section>
//                                 <h2 className="text-2xl font-bold mb-4">Description</h2>
//                                 <div className="prose max-w-none text-gray-700 dark:text-gray-300">
//                                     {course.description}
//                                 </div>
//                             </section>

//                             {/* Instructor */}
//                             <section className="bg-gray-50 dark:bg-black border-2 rounded-xl p-6">
//                                 <h2 className="text-2xl font-bold mb-4">Instructor</h2>
//                                 <div className="flex items-start gap-4">
//                                     {/* <img
//                                         src={course.instructor.avatar || '/images/avatar-placeholder.png'}
//                                         alt={course.instructor.name}
//                                         className="w-16 h-16 rounded-full object-cover"
//                                     /> */}
//                                     <div>
//                                         <h3 className="text-lg font-semibold">Instructor Name</h3>
//                                         <p className="text-gray-600 dark:text-gray-400">Gazi Adib</p>
//                                         <div className="flex items-center mt-2">
//                                             <Star className="h-4 w-4 fill-current text-yellow-500 mr-1" />
//                                             <span className="text-sm">
//                                                 {5} Instructor Rating
//                                             </span>
//                                             <span className="mx-2">•</span>
//                                             <span className="text-sm">{5} Reviews</span>
//                                             <span className="mx-2">•</span>
//                                             <span className="text-sm">{10} Students</span>
//                                         </div>
//                                         <p className="mt-2 text-gray-700 dark:text-gray-300">
//                                             Gazi Adib BIo
//                                         </p>
//                                     </div>
//                                 </div>
//                             </section>

//                             {/* Reviews */}
//                             <section>

//                                 <ReviewListings reviews={data?.reviews} />

//                                 <CourseReviewForm course={course} />
//                             </section>
//                         </div>

//                         {/* Right Sidebar */}
//                         <div className="space-y-6">
//                             {/* Course Features */}
//                             <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
//                                 <h3 className="font-semibold text-lg">This course includes:</h3>
//                                 <ul className="space-y-3">
//                                     <li className="flex items-center">
//                                         <Clock className="mr-3 h-5 w-5 text-blue-500" />
//                                         <span>{Math.floor(totalDuration / 60)} hours on-demand video</span>

//                                     </li>
//                                      <li className="flex items-center">
//                                         <FileQuestionIcon className="mr-3 h-5 w-5 text-green-500" />
//                                         <span>{totalQuizzess} Quizzess</span>
//                                     </li>
//                                     <li className="flex items-center">
//                                         <FileText className="mr-3 h-5 w-5 text-green-500" />
//                                         <span>{totalLessons} Lessons</span>
//                                     </li>
//                                     <li className="flex items-center">
//                                         <Globe className="mr-3 h-5 w-5 text-purple-500" />
//                                         <span>Access on mobile and TV</span>
//                                     </li>
//                                     <li className="flex items-center">
//                                         <BarChart2 className="mr-3 h-5 w-5 text-yellow-500" />
//                                         <span>Assignments</span>
//                                     </li>
//                                     <li className="flex items-center">
//                                         <Award className="mr-3 h-5 w-5 text-red-500" />
//                                         <span>Certificate of completion</span>
//                                     </li>
//                                 </ul>
//                             </div>

//                             {/* Progress for enrolled students */}
//                             {isCoursePurchased(course.id) && (
//                                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 space-y-3">
//                                     <h3 className="font-semibold text-lg">Your Progress</h3>
//                                     <Progress value={userProgressPercentage} className="h-2" />
//                                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                                         {/* 12 of {totalLessons} lessons completed (45%) */}
//                                         {userProgressPercentage} % completed out of  100 %
//                                     </p>
//                                     <Button className="w-full" asChild>
//                                         <Link href={route('user.course.classroom.index', { course: course.id })}>
//                                             Continue Learning
//                                         </Link>
//                                     </Button>
//                                 </div>
//                             )}

//                             {/* Share Course */}
//                             <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-3">
//                                 <h3 className="font-semibold text-lg">Share this course</h3>
//                                 <div className="flex gap-2">
//                                     <Button variant="outline" size="icon">
//                                         <span className="sr-only">Twitter</span>
//                                         <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                                             <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                                         </svg>
//                                     </Button>
//                                     <Button variant="outline" size="icon">
//                                         <span className="sr-only">Facebook</span>
//                                         <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                                             <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
//                                         </svg>
//                                     </Button>
//                                     <Button variant="outline" size="icon">
//                                         <span className="sr-only">LinkedIn</span>
//                                         <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                                             <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
//                                         </svg>
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }























// import { Head, Link, usePage, useRemember } from '@inertiajs/react';
// import { Clock, Layers, Users, Star, ArrowLeft, BookOpen } from 'lucide-react';
// import AppLayout from '@/layouts/app-layout';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import ModuleLists from '@/components/listings/ModuleLists';
// import CourseReviewForm from '@/components/forms/CourseReviewForm';
// import ReviewListings from '@/components/listings/ReviewListings';
// import AddToCartButton from '@/components/carts/AddToCartButton';
// import ApplyCoupon from '@/components/forms/ApplyCoupon';


// export default function CourseDetailPage({ course, purchases }) {

//     const { course: data } = usePage().props;


//     const { applied_coupon } = usePage().props;

//     // checking coupon for course
//     const isCouponAppliedForThisCourse =
//         applied_coupon && applied_coupon?.course_id === course.id;

//     const discountAmount = applied_coupon?.discount_type === 'percentage'
//         ? (course.price * parseFloat(applied_coupon?.discount_value)) / 100
//         : parseFloat(applied_coupon?.discount_value);

//     const finalPrice = (course.price - Number(discountAmount)).toFixed(2);




//     // adding IsPurchases Logic for user who purchases it already;

//     // Extract purchased course IDs
//     const purchasedCourseIds = purchases?.data?.flatMap((purchase) =>
//         purchase?.order_items?.map((item) => item.course_data.id)
//     );

//     console.log(purchasedCourseIds);

//     const isCoursePurchased = (courseId: number) => {
//         return purchasedCourseIds.includes(courseId);
//     };


//     // find avg Rating for this course
//     const averageRating = data?.reviews?.length > 0
//         ? (data?.reviews?.reduce((sum, review) => sum + review.rating, 0) / data?.reviews?.length)
//         : 0;


//     const fullStars = Math.floor(averageRating);
//     const hasHalfStar = averageRating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);


//     // count total lessons -> course.modules then lessons

//     const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);

//     // review count function

//     const formatReviewCount = (count) => {
//         if (!count) return '0';

//         if (count >= 1000000) {
//             return `${(count / 1000000).toFixed(1)}M`.replace('.0', ''); // 1M, 1.5M
//         }

//         if (count >= 1000) {
//             return `${(count / 1000).toFixed(1)}k`.replace('.0', ''); // 1k, 1.5k
//         }

//         return count.toString(); // Under 1000 shows actual number
//     }

//     const breadcrumbs = [
//         {
//             title: `Courses / ${course?.title} / Detail`,
//             href: `/user/courses/${course?.id}`,
//         },
//     ];
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

//                             <div className="p-4 md:p-6 lg:p-6">
//                                 <div className="flex items-center gap-4 mb-4">
//                                     <Badge variant="secondary">
//                                         {course.category.name}
//                                     </Badge>
//                                     <Badge variant={
//                                         course.level === 'beginner' ? 'success' :
//                                             course.level === 'intermediate' ? 'warning' :
//                                                 'destructive'
//                                     }>
//                                         {course.level}
//                                     </Badge>

//                                     <AddToCartButton
//                                         course={course}
//                                         isCoursePurchased={isCoursePurchased(course.id)}
//                                         finalPrice={finalPrice}
//                                         isCouponAppliedForThisCourse={isCouponAppliedForThisCourse} />

//                                     <ApplyCoupon course={course} />
//                                 </div>

//                                 <h1 className="text-3xl font-bold mb-4">{course.title}</h1>



//                                 <div className="flex items-center md:justify-start lg:justify-start justify-around gap-8 lg:gap-4 md:gap-6 mb-6">
//                                     <div className="flex items-center text-sm text-muted-foreground">
//                                         <Users className="mr-2 h-4 w-4" />
//                                         {course?.modules?.length} modules
//                                     </div>
//                                     <div className="flex items-center text-sm text-muted-foreground">
//                                         <BookOpen className="mr-2 h-4 w-4" />
//                                         {totalLessons}
//                                     </div>
//                                     <div className="flex items-center text-sm text-muted-foreground">
//                                         {/* Full stars */}
//                                         {Array.from({ length: fullStars }).map((_, i) => (
//                                             <Star key={`full-${i}`} className="h-4 w-4 fill-current text-yellow-500" />
//                                         ))}

//                                         {/* Half star */}
//                                         {hasHalfStar && (
//                                             <div className="relative h-4 w-4">
//                                                 <Star className="absolute h-4 w-4 fill-current text-gray-300" />
//                                                 <Star className="absolute h-4 w-4 fill-current text-yellow-500" style={{ clipPath: 'inset(0 50% 0 0)' }} />
//                                             </div>
//                                         )}

//                                         {/* Empty stars */}
//                                         {Array.from({ length: emptyStars }).map((_, i) => (
//                                             <Star key={`empty-${i}`} className="h-4 w-4 fill-current text-gray-300" />
//                                         ))}

//                                         {/* Rating text */}
//                                         <span className="ml-2">
//                                             {averageRating?.toFixed(1) || '0.0'} ({formatReviewCount(course?.reviews?.length)})
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="prose max-w-none mb-8 text-justify">
//                                     {course.description}
//                                 </div>

//                                 <div className="prose max-w-none mb-8 text-xl text-green-400 text-justify">
//                                     $ {isCouponAppliedForThisCourse ? finalPrice : course.price}
//                                 </div>

//                                 <h2 className="text-xl font-semibold mb-4">Course Modules ({course?.modules?.length})</h2>

//                                 <ModuleLists modules={course.modules} />

//                                 <div className='my-4 py-4'>
//                                     <ReviewListings reviews={data?.reviews} />
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






















