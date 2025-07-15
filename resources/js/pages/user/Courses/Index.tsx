import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock, Layers, MessageSquare, Search, ArrowDown, Star, Filter } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    duration: string;
    is_paid: boolean;
    level: 'beginner' | 'intermediate' | 'advanced';
    is_featured: boolean;
    category: {
        id: number;
        name: string;
    };
    image_url?: string;
    created_at: string;
    updated_at: string;
    modules?: Array<{ id: number }>;
    reviews?: Array<{ id: number }>;
}

interface Category {
    id: number;
    name: string;
}

interface PaginatedResults<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/user/courses',
    },
];

export default function CoursesPage() {
    const { courses, filters, categories } = usePage<{
        courses: PaginatedResults<Course>;
        categories: Category[];
        filters: { search?: string; sort?: string };
    }>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            route('user.courses.index'),
            { ...filters, search: value },
            { preserveState: true, replace: true }
        );
    }, 500);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
                <Head title="Courses" />

                <div className="max-w-7xl w-full text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-red-500">
                        Explore Our Courses
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Find the perfect course to advance your skills
                    </p>
                </div>

                {/* Search and Sort Controls */}
                <div className="w-full max-w-7xl mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                debouncedSearch(e.target.value);
                            }}
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <Select
                            value={filters.sort || 'default'}
                            onValueChange={(sort) => router.get(
                                route('user.courses.index'),
                                { ...filters, sort: sort !== 'default' ? sort : undefined },
                                { preserveState: true }
                            )}
                        >
                            <SelectTrigger className="w-full">
                                <ArrowDown className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Newest</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full sm:w-48">
                        <Select
                            value={filters.category || 'all'}
                            onValueChange={(selectedCategoryId) => router.get(
                                route('user.courses.index'),
                                {
                                    ...filters,
                                    category: selectedCategoryId !== 'all' ? selectedCategoryId : undefined,
                                    page: undefined
                                },
                                { preserveState: true }
                            )}
                        >
                            <SelectTrigger className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue>
                                    {filters.category
                                        ? categories?.find(c => c.id.toString() === filters.category)?.name
                                        : "Filter by category"}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories?.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>



                {/* Courses Grid */}
                {courses.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
                        {courses.data.map((course) => (
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
                                            <span className="font-semibold text-primary">${course.price}</span>
                                        ) : (
                                            <Badge variant="success">Free</Badge>
                                        )}
                                    </div>
                                </CardContent>


                                <CardFooter className="px-5 pb-5 pt-0">
                                    <Button asChild className="w-full">
                                        <Link href={route('user.courses.show', course.id)}>View Details</Link>
                                    </Button>

                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="w-full max-w-7xl py-12 flex flex-col items-center justify-center text-center">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium text-foreground">No courses found</h3>
                        <p className="text-muted-foreground mt-2">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}


// import { Head, Link, router, usePage } from '@inertiajs/react'
// import { Clock, Layers, MessageSquare, StarsIcon, Search, ArrowDown } from 'lucide-react'

// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardContent,
//     CardFooter,
// } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Star } from 'lucide-react'
// import AppLayout from '@/layouts/app-layout'
// import { BreadcrumbItem } from '@/types'
// import { Breadcrumb } from '@/components/ui/breadcrumb'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Input } from '@/components/ui/input'

// import { useDebounce, useDebouncedCallback } from 'use-debounce'
// import { useEffect, useState } from 'react'



// interface Course {
//     id: number
//     title: string
//     description: string
//     price: number
//     duration: string
//     is_paid: boolean
//     level: 'beginner' | 'intermediate' | 'advanced'
//     is_featured: boolean
//     category: {
//         id: number
//         name: string
//     }
//     image_url?: string
//     created_at: string
//     updated_at: string
// }

// interface PaginatedResults<T> {
//     data: T[]
//     links: {
//         url: string | null
//         label: string
//         active: boolean
//     }[]
//     current_page: number
//     last_page: number
//     per_page: number
//     total: number
// }


// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Courses',
//         href: '/user/courses',
//     },
// ];

// export default function CourseListingsPage() {
//     const { courses, filters } = usePage<{
//     courses: PaginatedResults<Course>;
//     filters: {
//       search?: string;
//       sort?: string;
//     };
//   }>().props;

//   console.log('courses', courses.data)

//     const [searchTerm, setSearchTerm] = useState(filters.search || '');
//     const [sortBy, setSortBy] = useState(filters.sort || '')


//     const debouncedSearch = useDebouncedCallback((value) => {
//     router.get(
//       route('courses.index'),
//       { search: value },
//       { preserveState: true, replace: true }
//     );
//   }, 500);

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 bg-background">
//                 <Head title="Courses" />

//                 <div className="max-w-7xl w-full text-center mb-10">
//                     <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-red-500">
//                         Explore Our Courses
//                     </h1>
//                     <p className="text-muted-foreground mt-2 text-lg">
//                         Find the perfect course to advance your skills
//                     </p>
//                 </div>

//                 {/* Search and Sort Controls */}
//                 <div className="w-full max-w-7xl mb-8 flex flex-col sm:flex-row gap-4">
//                     <div className="relative max-w-md mb-6">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                         <Input
//                             placeholder="Search courses..."
//                             className="pl-10"
//                             defaultValue={filters.search}
//                             onChange={(e) => {
//                                 setSearchTerm(e.target.value);
//                                 debouncedSearch(e.target.value);
//                             }}
//                         />
//                     </div>

//                     <div className="w-full sm:w-48">
//                         <Select
//                             defaultValue={filters.sort || 'default'}
//                             onValueChange={(sort) => router.get(route('user.courses.index'), { sort }, { preserveState: true })}
//                         >
//                             <SelectTrigger className="w-[180px]">
//                                 <ArrowDown className="mr-2 h-4 w-4" />
//                                 <SelectValue placeholder="Sort by" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="default">Newest</SelectItem>
//                                 <SelectItem value="price-low">Price: Low to High</SelectItem>
//                                 <SelectItem value="price-high">Price: High to Low</SelectItem>
//                                 <SelectItem value="featured">Featured First</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
//                     {courses.data?.map((course) => (
//                         <Card
//                             key={course.id}
//                             className="relative h-full flex flex-col hover:shadow-lg transition-all border border-border"
//                         >
//                             {course.is_featured && (
//                                 <div className="absolute top-3 left-3 z-10">
//                                     <Badge className="bg-green-900 border-green-200 border-2 text-white flex items-center gap-1 text-xs px-2 py-0.5 shadow-sm">
//                                         <Star className="h-3 w-3 text-white" />
//                                         Featured
//                                     </Badge>
//                                 </div>
//                             )}

//                             <CardHeader className="p-0">
//                                 <div className="aspect-video overflow-hidden rounded-t-md bg-muted">
//                                     <img
//                                         src={
//                                             course.image_url
//                                                 ? course.image_url
//                                                 : 'https://i.ytimg.com/vi/p0iWbtHPel4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAr8RkZINpmZyn-m1gZbZZLwiDHhg'
//                                         }
//                                         alt={course.title}
//                                         className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                                     />
//                                 </div>
//                             </CardHeader>

//                             <CardContent className="flex-grow p-5 flex flex-col">
//                                 <div className="flex justify-between items-center mb-3">
//                                     <Badge variant="outline">{course.category.name}</Badge>
//                                     <Badge
//                                         variant={
//                                             course.level === 'beginner'
//                                                 ? 'success'
//                                                 : course.level === 'intermediate'
//                                                     ? 'secondary'
//                                                     : 'destructive'
//                                         }
//                                     >
//                                         {course.level}
//                                     </Badge>
//                                 </div>

//                                 <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
//                                     {course.title}
//                                 </CardTitle>

//                                 {/* Meta Info Row */}
//                                 <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
//                                     <div className="flex items-center gap-2">
//                                         <Layers className="h-4 w-4" />
//                                         <span>{course.modules.length} Modules</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <MessageSquare className="h-4 w-4" />
//                                         <span>{course.reviews.length} Reviews</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <Clock className="h-4 w-4" />
//                                         <span>{course.duration}</span>
//                                     </div>
//                                 </div>

//                                 <div className="mt-auto flex justify-between items-center text-sm">
//                                     {course.is_paid ? (
//                                         <span className="font-semibold text-primary">${course.price}</span>
//                                     ) : (
//                                         <Badge variant="success">Free</Badge>
//                                     )}
//                                 </div>
//                             </CardContent>

//                             <CardFooter className="px-5 pb-5 pt-0">
//                                 <Button asChild className="w-full">
//                                     <Link href={`/courses/${course.id}`}>View Details</Link>
//                                 </Button>
//                             </CardFooter>
//                         </Card>
//                     ))}
//                 </div>
//             </div>
//         </AppLayout>
//     )
// }





































// import { Head, Link, usePage } from '@inertiajs/react'
// import { Clock, Layers, MessageSquare, StarsIcon } from 'lucide-react'
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardContent,
//     CardFooter,
// } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Star } from 'lucide-react'
// import AppLayout from '@/layouts/app-layout'
// import { BreadcrumbItem } from '@/types'
// import { Breadcrumb } from '@/components/ui/breadcrumb'

// interface Course {
//     id: number
//     title: string
//     description: string
//     price: number
//     duration: string
//     is_paid: boolean
//     level: 'beginner' | 'intermediate' | 'advanced'
//     is_featured: boolean
//     category: {
//         id: number
//         name: string
//     }
//     image_url?: string
//     created_at: string
//     updated_at: string
// }

// interface PaginatedResults<T> {
//     data: T[]
//     links: {
//         url: string | null
//         label: string
//         active: boolean
//     }[]
//     current_page: number
//     last_page: number
//     per_page: number
//     total: number
// }

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Courses',
//         href: '/user/courses',
//     },
// ];

// export default function CoursesPage() {
//     const { courses } = usePage<{ courses: PaginatedResults<Course> }>().props




//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 bg-background">
//                 <Head title="Courses" />

//                 <div className="max-w-7xl w-full text-center mb-10">
//                     <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-red-500">
//                         Explore Our Courses
//                     </h1>
//                     <p className="text-muted-foreground mt-2 text-lg">
//                         Find the perfect course to advance your skills
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
//                     {courses?.data?.map((course) => (
//                         <Card
//                             key={course.id}
//                             className="relative h-full flex flex-col hover:shadow-lg transition-all border border-border"
//                         >
//                             {course.is_featured && (
//                                 <div className="absolute top-3 left-3 z-10">
//                                     <Badge className="bg-green-900 border-green-200 border-2 text-white flex items-center gap-1 text-xs px-2 py-0.5 shadow-sm">
//                                         <Star className="h-3 w-3 text-white" />
//                                         Featured
//                                     </Badge>
//                                 </div>
//                             )}

//                             <CardHeader className="p-0">
//                                 <div className="aspect-video overflow-hidden rounded-t-md bg-muted">
//                                     <img
//                                         src={
//                                             course.image_url
//                                                 ? course.image_url
//                                                 : 'https://i.ytimg.com/vi/p0iWbtHPel4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAr8RkZINpmZyn-m1gZbZZLwiDHhg'
//                                         }
//                                         alt={course.title}
//                                         className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                                     />
//                                 </div>
//                             </CardHeader>

//                             <CardContent className="flex-grow p-5 flex flex-col">
//                                 <div className="flex justify-between items-center mb-3">
//                                     <Badge variant="outline">{course.category.name}</Badge>
//                                     <Badge
//                                         variant={
//                                             course.level === 'beginner'
//                                                 ? 'success'
//                                                 : course.level === 'intermediate'
//                                                     ? 'secondary'
//                                                     : 'destructive'
//                                         }
//                                     >
//                                         {course.level}
//                                     </Badge>
//                                 </div>

//                                 <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
//                                     {course.title}
//                                 </CardTitle>

//                                 {/* Meta Info Row */}
//                                 <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
//                                     <div className="flex items-center gap-2">
//                                         <Layers className="h-4 w-4" />
//                                         <span>{course.modules.length} Modules</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <MessageSquare className="h-4 w-4" />
//                                         <span>{course.reviews.length} Reviews</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <Clock className="h-4 w-4" />
//                                         <span>{course.duration}</span>
//                                     </div>
//                                 </div>

//                                 <div className="mt-auto flex justify-between items-center text-sm">
//                                     {course.is_paid ? (
//                                         <span className="font-semibold text-primary">${course.price}</span>
//                                     ) : (
//                                         <Badge variant="success">Free</Badge>
//                                     )}
//                                 </div>
//                             </CardContent>

//                             <CardFooter className="px-5 pb-5 pt-0">
//                                 <Button asChild className="w-full">
//                                     <Link href={`/courses/${course.id}`}>View Details</Link>
//                                 </Button>
//                             </CardFooter>
//                         </Card>
//                     ))}
//                 </div>
//             </div>
//         </AppLayout>
//     )
// }























// import { Head, Link, usePage } from '@inertiajs/react'
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Star } from 'lucide-react'

// // types/course.d.ts
// interface Course {
//   id: number
//   title: string
//   description: string
//   price: number
//   duration: string
//   is_paid: boolean
//   level: 'beginner' | 'intermediate' | 'advanced'
//   is_featured: boolean
//   category: {
//     id: number
//     name: string
//   }
//   image_url?: string
//   created_at: string
//   updated_at: string
// }

// interface PaginatedResults<T> {
//   data: T[]
//   links: {
//     url: string | null
//     label: string
//     active: boolean
//   }[]
//   current_page: number
//   last_page: number
//   per_page: number
//   total: number
// }

// export default function CoursesPage() {
//   const { courses } = usePage<{ courses: PaginatedResults<Course> }>().props

//   return (
//     <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <Head title="Courses" />

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight">Explore Our Courses</h1>
//         <p className="text-muted-foreground mt-2">
//           Find the perfect course to advance your skills
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {courses?.data?.map((course) => (
//           <Card key={course.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
//             {course.is_featured && (
//               <div className="absolute top-2 left-2">
//                 <Badge variant="secondary" className="flex items-center gap-1">
//                   <Star className="h-3 w-3" />
//                   Featured
//                 </Badge>
//               </div>
//             )}

//             <CardHeader className="p-0">
//               <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
//                 <img
//                   src={course.image_url ? course.image_url : 'https://images.pexels.com/photos/5940718/pexels-photo-5940718.jpeg'}
//                   alt={course.title}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </CardHeader>

//             <CardContent className="flex-grow p-6">
//               <div className="flex justify-between items-start mb-2">
//                 <Badge variant="outline">{course?.category?.name}</Badge>
//                 <Badge variant={course.level === 'beginner' ? 'success' : course.level === 'intermediate' ? 'warning' : 'destructive'}>
//                   {course.level}
//                 </Badge>
//               </div>

//               <CardTitle className="mb-2 line-clamp-2">{course.title}</CardTitle>
//               <CardDescription className="line-clamp-3 mb-4">
//                 {course.description}
//               </CardDescription>

//               <div className="mt-auto">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">
//                     {course.duration} hours
//                   </span>
//                   {course.is_paid ? (
//                     <span className="font-semibold">${course.price}</span>
//                   ) : (
//                     <Badge variant="success">Free</Badge>
//                   )}
//                 </div>
//               </div>
//             </CardContent>

//             <CardFooter className="p-6 pt-0">
//               <Button asChild className="w-full">
//                 <Link href={`/courses/${course.id}`}>
//                   View Details
//                 </Link>
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }















// import { Head, Link, usePage, router } from '@inertiajs/react'
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Star, Search, ArrowUpDown, Filter, Clock, Award } from 'lucide-react'
// import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
// import { useEffect } from 'react'

// interface Course {
//   id: number
//   title: string
//   description: string
//   price: number
//   duration: string
//   is_paid: boolean
//   level: 'beginner' | 'intermediate' | 'advanced'
//   is_featured: boolean
//   category: {
//     id: number
//     name: string
//   }
//   image_url?: string
// }

// interface PaginatedResults<T> {
//   data: T[]
//   links: {
//     url: string | null
//     label: string
//     active: boolean
//   }[]
//   current_page: number
//   last_page: number
//   per_page: number
//   total: number
// }

// export default function CoursesPage() {
//   const { courses = { data: [] }, filters = {} } = usePage<{
//     courses?: PaginatedResults<Course>
//     filters?: {
//       search?: string
//       sort?: string
//       level?: string
//       category?: string
//     }
//   }>().props

//   // Debugging
//   useEffect(() => {
//     console.log('Courses data:', courses)
//     console.log('Filters:', filters)
//   }, [courses, filters])

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     router.get('/user/courses', {
//       search: e.target.value
//     }, {
//       preserveState: true,
//       replace: true
//     })
//   }

//   const handleSort = (value: string) => {
//     router.get('/user/courses', {
//       sort: value
//     }, {
//       preserveState: true,
//       replace: true
//     })
//   }

//   const handleFilter = (type: string, value: string) => {
//     router.get('/user/courses', {
//       [type]: value
//     }, {
//       preserveState: true,
//       replace: true
//     })
//   }

//   return (
//     <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <Head title="Courses" />

//       {/* Header Section */}
//       <div className="mb-8 text-center">
//         <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
//           Expand Your Knowledge
//         </h1>
//         <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
//           Discover {courses?.total || 0} expertly crafted courses to boost your skills
//         </p>
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
//         {/* Search Input */}
//         <div className="md:col-span-2 relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search courses..."
//             className="pl-9"
//             value={filters?.search || ''}
//             onChange={handleSearch}
//           />
//         </div>

//         {/* Category Filter */}
//         <Select
//           value={filters?.category || ''}
//           onValueChange={(value) => handleFilter('category', value)}
//         >
//           <SelectTrigger className="w-full">
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4" />
//               <SelectValue placeholder="Category" />
//             </div>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="">All Categories</SelectItem>
//             <SelectItem value="web">Web Development</SelectItem>
//             <SelectItem value="mobile">Mobile Development</SelectItem>
//             <SelectItem value="data">Data Science</SelectItem>
//             <SelectItem value="design">UI/UX Design</SelectItem>
//           </SelectContent>
//         </Select>

//         {/* Sort Selector */}
//         <Select
//           value={filters?.sort || ''}
//           onValueChange={handleSort}
//         >
//           <SelectTrigger className="w-full">
//             <div className="flex items-center gap-2">
//               <ArrowUpDown className="h-4 w-4" />
//               <SelectValue placeholder="Sort by" />
//             </div>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="newest">Newest First</SelectItem>
//             <SelectItem value="oldest">Oldest First</SelectItem>
//             <SelectItem value="price_high">Price: High to Low</SelectItem>
//             <SelectItem value="price_low">Price: Low to High</SelectItem>
//             <SelectItem value="duration">Duration</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Courses Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//         {courses.data?.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Empty State */}
//       {(!courses.data || courses.data.length === 0) && (
//         <div className="text-center py-12">
//           <h3 className="text-lg font-medium">No courses found</h3>
//           <p className="text-muted-foreground mt-2">
//             {courses.total === 0 ? 'No courses available' : 'Try adjusting your search or filter criteria'}
//           </p>
//         </div>
//       )}

//       {/* Pagination */}
//       {courses.last_page > 1 && (
//         <Pagination className="mt-8">
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious
//                 href={courses.links[0].url || '#'}
//                 preserveScroll
//               />
//             </PaginationItem>

//             {courses.links.slice(1, -1).map((link, index) => (
//               <PaginationItem key={index}>
//                 <PaginationLink
//                   href={link.url || '#'}
//                   isActive={link.active}
//                   preserveScroll
//                 >
//                   {link.label}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}

//             <PaginationItem>
//               <PaginationNext
//                 href={courses.links[courses.links.length - 1].url || '#'}
//                 preserveScroll
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       )}
//     </div>
//   )
// }

// // CourseCard component remains the same

// interface CourseCardProps {
//   course: {
//     id: number
//     title: string
//     description: string
//     price: number
//     duration: string
//     is_paid: boolean
//     level: 'beginner' | 'intermediate' | 'advanced'
//     is_featured: boolean
//     category: {
//       id: number
//       name: string
//     }
//     image_url?: string
//     students_count?: number
//     rating?: number
//   }
// }

// export function CourseCard({ course }: CourseCardProps) {
//   return (
//     <Card className="h-full flex flex-col group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border">
//       {/* Card Header with Image */}
//       <CardHeader className="p-0 relative">
//         <div className="aspect-video overflow-hidden">
//           <img
//             src={course.image_url || '/images/course-placeholder.jpg'}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//             loading="lazy"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
//         </div>

//         {/* Featured Badge */}
//         {course.is_featured && (
//           <Badge
//             variant="secondary"
//             className="absolute top-3 left-3 flex items-center gap-1 shadow-sm z-10"
//           >
//             <Star className="h-3 w-3" />
//             Featured
//           </Badge>
//         )}

//         {/* Level Badge */}
//         <Badge
//           variant={
//             course.level === 'beginner' ? 'success' :
//             course.level === 'intermediate' ? 'warning' : 'destructive'
//           }
//           className="absolute top-3 right-3 capitalize"
//         >
//           {course.level}
//         </Badge>
//       </CardHeader>

//       {/* Card Content */}
//       <CardContent className="flex-grow p-6">
//         {/* Category and Rating */}
//         <div className="flex justify-between items-center mb-3">
//           <Badge variant="outline" className="text-xs">
//             {course.category?.name || 'General'}
//           </Badge>
//         </div>

//         {/* Course Title */}
//         <CardTitle className="mb-2 line-clamp-2 text-lg font-semibold leading-snug">
//           {course.title}
//         </CardTitle>

//         {/* Course Description */}
//         <CardDescription className="line-clamp-3 mb-4 text-sm text-muted-foreground">
//           {course.description}
//         </CardDescription>

//         {/* Stats and Duration */}
//         <div className="mt-auto space-y-2">
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Clock className="h-4 w-4 mr-2" />
//             <span>{course.duration} hours</span>
//           </div>
//         </div>
//       </CardContent>

//       {/* Card Footer */}
//       <CardFooter className="p-6 pt-0">
//         <div className="w-full flex items-center justify-between">
//           <div className="font-medium">
//             {course.is_paid ? (
//               <span className="text-primary">${course.price}</span>
//             ) : (
//               <Badge variant="success">Free</Badge>
//             )}
//           </div>

//           <Button asChild variant="outline" className="hover:bg-primary hover:text-primary-foreground">
//             <Link href={`/courses/${course.id}`}>
//               View Details
//             </Link>
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }

















// import { Head, Link, usePage } from '@inertiajs/react'
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Star } from 'lucide-react'

// // types/course.d.ts
// interface Course {
//   id: number
//   title: string
//   description: string
//   price: number
//   duration: string
//   is_paid: boolean
//   level: 'beginner' | 'intermediate' | 'advanced'
//   is_featured: boolean
//   category: {
//     id: number
//     name: string
//   }
//   image_url?: string
//   created_at: string
//   updated_at: string
// }

// interface PaginatedResults<T> {
//   data: T[]
//   links: {
//     url: string | null
//     label: string
//     active: boolean
//   }[]
//   current_page: number
//   last_page: number
//   per_page: number
//   total: number
// }

// export default function CoursesPage() {
//   const { courses } = usePage<{ courses: PaginatedResults<Course> }>().props

//   return (
//     <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <Head title="Courses" />

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight">Explore Our Courses</h1>
//         <p className="text-muted-foreground mt-2">
//           Find the perfect course to advance your skills
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {courses?.data?.map((course) => (
//           <Card key={course.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
//             {course.is_featured && (
//               <div className="absolute top-2 left-2">
//                 <Badge variant="secondary" className="flex items-center gap-1">
//                   <Star className="h-3 w-3" />
//                   Featured
//                 </Badge>
//               </div>
//             )}

//             <CardHeader className="p-0">
//               <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
//                 <img
//                   src={course.image_url ? course.image_url : 'https://www.pexels.com/photo/ethnic-student-having-studies-in-library-with-professor-5940718/'}
//                   alt={course.title}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </CardHeader>

//             <CardContent className="flex-grow p-6">
//               <div className="flex justify-between items-start mb-2">
//                 <Badge variant="outline">{course?.category?.name}</Badge>
//                 <Badge variant={course.level === 'beginner' ? 'success' : course.level === 'intermediate' ? 'warning' : 'destructive'}>
//                   {course.level}
//                 </Badge>
//               </div>

//               <CardTitle className="mb-2 line-clamp-2">{course.title}</CardTitle>
//               <CardDescription className="line-clamp-3 mb-4">
//                 {course.description}
//               </CardDescription>

//               <div className="mt-auto">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">
//                     {course.duration} hours
//                   </span>
//                   {course.is_paid ? (
//                     <span className="font-semibold">${course.price}</span>
//                   ) : (
//                     <Badge variant="success">Free</Badge>
//                   )}
//                 </div>
//               </div>
//             </CardContent>

//             <CardFooter className="p-6 pt-0">
//               <Button asChild className="w-full">
//                 <Link href={`/courses/${course.id}`}>
//                   View Details
//                 </Link>
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
