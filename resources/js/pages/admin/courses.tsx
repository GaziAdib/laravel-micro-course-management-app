import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';


interface Category {
    id: number | string;
    name: string;
}

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    category: Category;
    coupon_code?: string;
    tags?: string[] | null;
    is_paid: boolean;
    is_featured: boolean;
    image_url?: string | null;
    related_images?: string[] | null;
    prerequisites?: string[] | null;
    video_url?: string | null;
    duration: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    created_at?: string;  // ISO date string
    updated_at?: string;  // ISO date string
    reviews_count?: number;
}

interface PaginatedData {
    data: Course[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface CoursesPageProps {
    courses: PaginatedData;
    categories: Category[]
}

type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

interface CourseFormData {
    title: string;
    description: string;
    price: number;
    duration: string;
    is_featured: boolean;
    level: CourseLevel | '';
    category_id: number | string;
    coupon_code: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/admin/courses',
    },
];

export default function CoursesPage({ courses, categories }: CoursesPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [editCourse, setEditCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<CourseFormData>({
        title: '',
        description: '',
        price: 0.00,
        duration: '',
        is_featured: false,
        level: '' as CourseLevel | '',
        category_id: '' as string | number | '',
        coupon_code: ''
    });

    const handleAdd = () => {
        setEditCourse(null);
        setFormData({ title: '', price: 0.00, description: '', duration: '', is_featured: false, level: '', category_id: '', coupon_code: '' });
        setShowModal(true);
    };

    const handleEdit = (course: Course) => {
        setEditCourse(course);
        setFormData({
            title: course.title,
            price: course.price,
            description: course.description,
            duration: course.duration,
            is_featured: course.is_featured,
            level: course.level,
            category_id: course.category.id,
            coupon_code: course.coupon_code as string
        });
        setShowModal(true);
    };

    const handleLevelChange = (value: CourseLevel) => {
        setFormData({ ...formData, level: value });
    };

    const handleCategoryChange = (value: Category) => {
        setFormData({ ...formData, category_id: value ? Number(value) : '' });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this course?')) {
            router.delete(`/admin/courses/${id}`, {
                onSuccess: () => {
                    toast.success('Course deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to delete course');
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editCourse) {
            router.put(`/admin/courses/${editCourse.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Course updated successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to update course');
                },
            });
        } else {
            router.post('/admin/courses', formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Course created successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to create course');
                },
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.courses.index'), { page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <Toaster richColors closeButton position="top-right" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Courses</h1>
                    <Button onClick={handleAdd}>
                        Add Course
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Category Name</TableHead>
                                <TableHead>Reviews Count</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses?.data?.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>{course.title}</TableCell>
                                    <TableCell>{course.price}</TableCell>
                                    <TableCell>{course.level}</TableCell>
                                    <TableCell>{course.category.name}</TableCell>
                                    <TableCell>{course?.reviews_count}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(course)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(course.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-start mt-4">
                    <nav className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(courses.current_page - 1)}
                            disabled={courses.current_page === 1}
                            className="h-8 px-2"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {courses.links.map((link, i) => {
                                if (link.label === '...') {
                                    return (
                                        <span key={i} className="px-2">...</span>
                                    );
                                }

                                if (link.url === null) {
                                    return null;
                                }

                                const page = parseInt(link.label);
                                return (
                                    <Button
                                        key={i}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className="h-8 w-8 p-0"
                                    >
                                        {link.label}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(courses.current_page + 1)}
                            disabled={courses.current_page === courses.last_page}
                            className="h-8 px-2"
                        >
                            Next
                        </Button>
                    </nav>
                </div>

                {/* Add/Edit Category Modal */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editCourse ? 'Edit Course' : 'Add Course'}
                            </DialogTitle>
                            <DialogDescription>
                                {editCourse ? 'Make changes to your category here.' : 'Create a new category here.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    placeholder="Enter Course Description"
                                    onChange={handleInputChange}
                                    className="min-h-[50px]"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min={0}
                                    max={10000000}
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category_id.toString()}
                                    onValueChange={handleCategoryChange}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
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

                            <div className="flex items-center justify-between">
                                <Label htmlFor="is_paid">is Featured ? (True/False)</Label>
                                <Switch
                                    id="is_featured"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                                />
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="level">Course Level</Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={handleLevelChange}
                                    required
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="coupon_code">Coupon Code</Label>
                                <Input
                                    id="coupon_code"
                                    name="coupon_code"
                                    placeholder="Ex: cse101"
                                    className="my-1"
                                    value={formData.coupon_code}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editCourse ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
