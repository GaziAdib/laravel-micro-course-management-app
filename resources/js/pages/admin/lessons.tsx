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


interface ModuleWithCourse {
    id: number;
    title: string;
    course_id: number;
    course: {
        id: number;
        title:string;
    }
}


interface Lesson {
    id: number;
    title: string;
    video_url: string;
    duration: string;
    order: number;
    module_id: number | string;
    created_at?: string | Date;
    updated_at?: string | Date;
}


interface PaginatedData {
    data: Lesson[];
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

interface LessonsPageProps {
    lessons: PaginatedData;
    modules: ModuleWithCourse[]
}


interface LessonFormData {
    title: string;
    video_url: string;
    duration: string;
    order: number;
    module_id: number | string;
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lessons',
        href: '/admin/lessons',
    },
];

export default function LessonsPage({ lessons, modules }: LessonsPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [editLesson, setEditLesson] = useState<Lesson | null>(null);
    const [formData, setFormData] = useState<LessonFormData>({
        title: '',
        video_url: '',
        duration: '',
        order: 0,
        module_id: '' as string | number
    });


    const handleAdd = () => {
        setEditLesson(null);
        setFormData({ title: '', video_url: '', duration: '', order: 0, module_id: '' });
        setShowModal(true);
    };

    const handleEdit = (lesson: Lesson) => {
        setEditLesson(lesson);
        setFormData({
            title: lesson.title,
            video_url: lesson.video_url,
            order: lesson.order,
            duration: lesson.duration,
            module_id: lesson.module_id
        });
        setShowModal(true);
    };

    const handleModuleChange = (value: ModuleWithCourse) => {
        setFormData({ ...formData, module_id: value ? Number(value) : '' });
    };

    const handleDelete = (id: number, moduleId: number) => {
        if (confirm('Are you sure you want to delete this module?')) {
            router.delete(`/admin/${moduleId}/lesson/${id}`, {
                onSuccess: () => {
                    toast.success('Module deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to delete Module');
                },
            });
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editLesson) {
            router.put(`/admin/${editLesson?.module_id}/lesson/${editLesson.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Lesson updated successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to update lesson');
                },
            });
        } else {
            router.post(`/admin/${formData?.module_id}/lesson/add`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Lesson created successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to create lesson');
                },
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.modules.index'), { page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lessons" />
            <Toaster richColors closeButton position="top-right" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Lessons</h1>
                    <Button onClick={handleAdd}>
                        Add Lesson
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Module Name</TableHead>
                                <TableHead>Video URL</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lessons?.data?.map((lesson) => (
                                <TableRow key={lesson.id}>
                                    <TableCell>{lesson?.title}</TableCell>
                                    <TableCell>{lesson?.module.title}</TableCell>
                                    <TableCell>{lesson?.video_url}</TableCell>
                                    <TableCell>{lesson?.duration}</TableCell>
                                    <TableCell>{lesson?.order}</TableCell>

                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(lesson)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(lesson.id, Number(lesson?.module_id))}
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
                            onClick={() => handlePageChange(lessons.current_page - 1)}
                            disabled={lessons.current_page === 1}
                            className="h-8 px-2"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {lessons.links.map((link, i) => {
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
                            onClick={() => handlePageChange(lessons.current_page + 1)}
                            disabled={lessons.current_page === lessons.last_page}
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
                                {editLesson ? 'Edit Lesson' : 'Add Lesson'}
                            </DialogTitle>
                            <DialogDescription>
                                {editLesson ? 'Make changes to your lesson here.' : 'Create a new lesson here.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="video_url">Video Url</Label>
                                <Input
                                    id="video_url"
                                    name="video_url"
                                    value={formData.video_url}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    placeholder="ex: 2 hr 40 min"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="course_id">Modules</Label>
                                <Select
                                    value={formData.module_id.toString()}
                                    onValueChange={handleModuleChange}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modules?.map((module) => (
                                            <SelectItem
                                                key={module.id}
                                                value={module.id.toString()}
                                            >
                                                {module.title} - {module.course.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Display Order</Label>
                                <Input
                                    id="order"
                                    name="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={handleInputChange}
                                    min="0"
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
                                    {editLesson ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
