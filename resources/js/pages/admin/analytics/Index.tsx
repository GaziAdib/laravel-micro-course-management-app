import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart } from '@/components/ui/bar-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface AdminDashboardPageProps {
    categories: { id: number; name: string; courses_count: number }[];
    courses: { id: number; title: string; student_count: number; reviews: [{ id: number, rating: number }] }[];
    modules: { id: number; name: string; lessons_count: number }[];
    lessons: { id: number; title: string; duration: number }[];
    purchases: { id: string; amount_paid: number; purchased_at: string }[];
    reviews: { id: number; rating: number; content: string }[];
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Analytics',
        href: '/admin/analytics',
    },
];

export default function AdminDashboardPage({
    categories,
    courses,
    modules,
    lessons,
    purchases,
    reviews,
}: AdminDashboardPageProps) {
    // Data for charts
    const categoryData = categories.map(cat => ({
        name: cat.name,
        value: cat.courses_count,
    }));



    // const courseData = [
    //     {
    //         name: 'Total Courses',
    //         value: courses.length,
    //     },
    //     {
    //         name: 'Avg Students',
    //         value: courses.reduce((acc, course) => acc + course.student_count, 0) / courses.length || 0,
    //     },
    // ];


    const learningData = [
        {
            name: 'Modules',
            value: modules.length,
        },
        {
            name: 'Lessons',
            value: lessons.length,
        },
        {
            name: 'Avg Lessons/Module',
            value: modules.reduce((acc, mod) => acc + mod.lessons_count, 0) / modules.length || 0,
        },
    ];

    const revenueData = purchases.map(purchase => ({
        name: new Date(purchase.purchased_at).toLocaleDateString(),
        value: purchase.amount_paid,
    }));



    // const now = new Date();
    // const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    // const revenueData = purchases
    //     .filter(purchase => {
    //         const purchaseDate = new Date(purchase.purchased_at);
    //         return purchaseDate >= threeDaysAgo && purchaseDate <= now;
    //     })
    //     .map(purchase => {
    //         const purchaseDate = new Date(purchase.purchased_at);
    //         return {
    //             // Format shows both date and time (e.g., "Jun 22, 2:30 PM")
    //             name: purchaseDate.toLocaleString('en-US', {
    //                 month: 'short',
    //                 day: 'numeric',
    //                 hour: '2-digit',
    //                 minute: '2-digit'
    //             }),
    //             value: purchase.amount_paid,
    //             // Keep original date for sorting
    //             timestamp: purchaseDate.getTime()
    //         };
    //     })
    //     // Sort by purchase time (newest first)
    //     .sort((a, b) => b.timestamp - a.timestamp);

    const reviewData = [
        {
            name: 'Total Reviews',
            value: reviews.length,
        },
        {
            name: 'Avg Rating',
            value: reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col space-y-6 p-6">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-300">
                                Total Courses
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{courses.length}</div>
                            <p className="text-xs text-muted-foreground">
                                +{courses.filter(c => c.student_count > 50).length} popular courses
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-300">
                                Learning Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{modules.length + lessons.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {modules.length} modules • {lessons.length} lessons
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-300">
                                Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{categories.length}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-300">
                                Total Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {purchases.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {purchases.length} enrollments
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-300">
                                Student Feedback
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {reviews.length > 0
                                    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
                                    : '0'}
                                /5
                            </div>
                            <p className="text-xs text-muted-foreground">
                                from {reviews.length} reviews
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Charts Section */}
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Courses by Category</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <BarChart
                                data={categoryData}
                                colors={['#3b82f6']}
                                xAxisLabel="Categories"
                                yAxisLabel="Course Count"
                            />
                        </CardContent>
                    </Card>

                    {/* <Card>
                        <CardHeader>
                            <CardTitle>Course Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <BarChart
                                data={courseData}
                                colors={['#10b981', '#3b82f6']}
                                xAxisLabel="Metrics"
                                yAxisLabel="Count"
                            />
                        </CardContent>
                    </Card> */}

                    <Card>
                        <CardHeader>
                            <CardTitle>Learning Content</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <BarChart
                                data={learningData}
                                colors={['#8b5cf6', '#ec4899', '#f59e0b']}
                                xAxisLabel="Content Type"
                                yAxisLabel="Count"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Purchases</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <BarChart
                                data={revenueData.slice(0, 5)}
                                colors={['#10b981']}
                                xAxisLabel="Date"
                                yAxisLabel="Amount"
                                showRecentDays={7}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Metrics */}
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {categories
                                    .sort((a, b) => b.courses_count - a.courses_count)
                                    .slice(0, 5)
                                    .map((category) => (
                                        <div key={category.id} className="flex items-center">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{category.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {category.courses_count} courses
                                                </p>
                                            </div>
                                            <div className="text-sm font-medium">
                                                {Math.round((category.courses_count / courses.length) * 100)}%
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Popular Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {courses
                                    .map((course) => (
                                        <div key={course.id} className="flex items-center">
                                            <div className="flex-1 truncate">
                                                <p className="text-sm font-medium truncate">{course?.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {course.reviews?.length > 0 ? (
                                                        <>
                                                            {(
                                                                course?.reviews?.reduce((acc, review) => acc + review?.rating, 0) /
                                                                course?.reviews?.length
                                                            ).toFixed(1)}
                                                            <span className="text-muted-foreground/70 ml-1">
                                                                ({course?.reviews?.length} reviews)
                                                            </span>
                                                        </>
                                                    ) : (
                                                        'No ratings yet'
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reviews.slice(0, 3).map((review) => (
                                    <div key={review.id} className="flex items-start gap-3">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/50">
                                            <span className="text-sm font-medium">{review.rating}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm line-clamp-2">{review.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
