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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface Course {
    id: number;
    title: string;
}

interface Module {
    id: number;
    title: string;
    course: Course;
    description: string;
    course_id: number | string;
    is_paid: boolean
    is_published: boolean
    lessons_count?: number;
    order: number
}


interface PaginatedData {
    data: Module[];
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

interface ModulesPageProps {
    modules: PaginatedData;
    courses: Course[]
}


interface ModuleFormData {
    title: string;
    description: string;
    course_id: number | string;
    is_paid: boolean
    is_published: boolean
    order: number
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modules',
        href: '/admin/courses/modules',
    },
];

export default function ModulesPage({ modules, courses }: ModulesPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [editModule, setEditModule] = useState<Module | null>(null);
    const [formData, setFormData] = useState<ModuleFormData>({
        title: '',
        description: '',
        course_id: '' as string | number,
        is_paid: false,
        is_published: true,
        order: 0
    });

    const handleAdd = () => {
        setEditModule(null);
        setFormData({ title: '', description: '', order: 0, course_id: '', is_paid: false, is_published: true });
        setShowModal(true);
    };

    const handleEdit = (module: Module) => {
        setEditModule(module);
        console.log('Module Info', module)
        setFormData({
            title: module.title,
            order: module.order,
            description: module.description,
            is_paid: module.is_paid,
            is_published: module.is_published,
            course_id: module.course_id
        });
        setShowModal(true);
    };

    const handleCourseChange = (value: Course) => {
        setFormData({ ...formData, course_id: value ? Number(value) : '' });
    };

    const handleDelete = (id: number, courseId: number) => {
        if (confirm('Are you sure you want to delete this module?')) {
            router.delete(`/admin/course/${courseId}/module/${id}`, {
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

        if (editModule) {
            router.put(`/admin/course/${editModule?.course_id}/module/${editModule.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Module updated successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to update module');
                },
            });
        } else {
            router.post(`/admin/course/${formData?.course_id}/module/add`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Module created successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to create module');
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
            <Head title="Modules" />
            <Toaster richColors closeButton position="top-right" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Modules</h1>
                    <Button onClick={handleAdd}>
                        Add Module
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Publish Status</TableHead>
                                <TableHead>Paid Status</TableHead>
                                <TableHead>Lessons Count</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {modules?.data?.map((module) => (
                                <TableRow key={module.id}>
                                    <TableCell>{module?.title}</TableCell>
                                    <TableCell>{module?.course?.title}</TableCell>
                                    <TableCell>{module?.order}</TableCell>
                                    <TableCell>{module?.is_published ? 'Published' : 'Pending'}</TableCell>
                                    <TableCell>{module?.is_paid ? 'Paid' : 'Free'}</TableCell>
                                    <TableCell>{module?.lessons_count}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(module)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(module.id, Number(module?.course_id))}
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
                            onClick={() => handlePageChange(modules.current_page - 1)}
                            disabled={modules.current_page === 1}
                            className="h-8 px-2"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {modules.links.map((link, i) => {
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
                            onClick={() => handlePageChange(modules.current_page + 1)}
                            disabled={modules.current_page === modules.last_page}
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
                                {editModule ? 'Edit Module' : 'Add Module'}
                            </DialogTitle>
                            <DialogDescription>
                                {editModule ? 'Make changes to your module here.' : 'Create a new module here.'}
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
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="course_id">Course</Label>
                                <Select
                                    value={formData.course_id.toString()}
                                    onValueChange={handleCourseChange}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses?.map((course) => (
                                            <SelectItem
                                                key={course.id}
                                                value={course.id.toString()}
                                            >
                                                {course.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>



                            {/* Toggle for is_paid */}
                            <div className="flex items-center justify-between">
                                <Label htmlFor="is_paid">Paid Module</Label>
                                <Switch
                                    id="is_paid"
                                    name="is_paid"
                                    checked={formData.is_paid}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_paid: checked }))}
                                />
                            </div>

                            {/* Toggle for is_published */}
                            <div className="flex items-center justify-between">
                                <Label htmlFor="is_published">Publish Module</Label>
                                <Switch
                                    id="is_published"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onCheckedChange={(checked) => setFormData(prev => ({
                                        ...prev,
                                        is_published: checked
                                    }))}
                                />
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
                                    {editModule ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
