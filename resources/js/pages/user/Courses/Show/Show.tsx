import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, Layers, Users, Star, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModuleLists from '@/components/listings/ModuleLists';
import CourseReviewForm from  '@/components/forms/CourseReviewForm';
import ReviewListings from  '@/components/listings/ReviewListings';



export default function CourseDetailPage({ course }) {

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

                            <div className="p-6">
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
                                </div>

                                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="mr-2 h-4 w-4" />
                                        {course?.modules?.length} modules
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Star className="mr-2 h-4 w-4" />
                                        {/* {course.average_rating} ({course.reviews_count} reviews) */}
                                        {course?.reviews?.length} ratings
                                    </div>
                                </div>

                                <div className="prose max-w-none mb-8 text-justify">
                                    {course.description}
                                </div>

                                <h2 className="text-xl font-semibold mb-4">Course Modules ({course?.modules?.length})</h2>

                                <ModuleLists modules={course.modules} />

                                <div className='my-4 py-4'>
                                    <ReviewListings reviews={course?.reviews}  />
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
