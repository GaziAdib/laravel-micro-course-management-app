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
import { Textarea } from '@/components/ui/textarea';



interface Quiz {
    id: number;
    title: string;
    description: string;
    passing_score: number;
    max_time_limit: number;
    max_attempts: number;
    module_id: number | string;
}

interface Module {
    id: number,
    title: string
}


interface PaginatedData {
    data: Quiz[];
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

interface QuizzesPageProps {
    quizzess: PaginatedData;
    modules: Module[]
}


interface QuizFormData {
    title: string;
    description: string;
    passing_score: number;
    max_time_limit: number;
    max_attempts: number;
    module_id: number | string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Quizzess',
        href: '/admin/quizzess',
    },
];

export default function QuizzesPage({ quizzess, modules }: QuizzesPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
    const [formData, setFormData] = useState<QuizFormData>({
        title: '',
        description: '',
        module_id: '' as string | number,
        passing_score: 0,
        max_time_limit: 0,
        max_attempts: 0
    });


    const handleAdd = () => {
        setEditQuiz(null);
        setFormData({ title: '', description: '', passing_score: 0, module_id: '', max_time_limit: 0, max_attempts: 0 });
        setShowModal(true);
    };

    const handleEdit = (quiz: Quiz) => {
        setEditQuiz(quiz);
        console.log('Quiz Info', quiz)
        setFormData({
            title: quiz.title,
            description: quiz.description,
            module_id: quiz.module_id,
            passing_score: quiz.passing_score,
            max_attempts: quiz.max_attempts,
            max_time_limit: quiz.max_time_limit
        });
        setShowModal(true);
    };


    const handleModuleChange = (value: Module) => {
        setFormData({ ...formData, module_id: value ? Number(value) : '' });
    };

    const handleDelete = (id: number, moduleId: number) => {
        if (confirm('Are you sure you want to delete this module?')) {
            router.delete(`/admin/${moduleId}/delete-quiz/${id}`, {
                onSuccess: () => {
                    toast.success('Quiz deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to delete Quiz');
                },
            });
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();



        if (editQuiz) {
            console.log('edit', editQuiz);
            router.put(`/admin/${editQuiz.module_id}/update-quiz/${editQuiz.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('quiz updated successfully');
                },
                onError: (errors) => {
                    console.log('errors', errors);
                    toast.error(errors.name || 'Failed to quiz module');
                },
            });
        } else {
            router.post(`/admin/${formData.module_id}/add-quiz`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Quiz created successfully');
                },
                onError: (errors) => {
                    console.log('errors', errors);
                    toast.error(errors.name || 'Failed to create quiz');
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
        router.get(route('admin.quizzes.index'), { page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quizzess" />
            <Toaster richColors closeButton position="top-right" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Quizzess</h1>
                    <Button onClick={handleAdd}>
                        Add Quiz
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Module Name</TableHead>
                                <TableHead>Passing Score</TableHead>
                                <TableHead>Max Attempts</TableHead>
                                <TableHead>Max Time Limits</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizzess?.data?.map((quiz) => (
                                <TableRow key={quiz.id}>
                                    <TableCell>{quiz.title}</TableCell>
                                    <TableCell>{quiz?.description}</TableCell>
                                    <TableCell>{quiz?.module?.title}</TableCell>
                                    <TableCell>{quiz?.passing_score}</TableCell>
                                    <TableCell>{quiz?.max_attempts}</TableCell>
                                    <TableCell>{quiz?.max_time_limit}</TableCell>

                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(quiz)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(quiz.id, Number(quiz?.module_id))}
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
                            onClick={() => handlePageChange(quizzess?.current_page - 1)}
                            disabled={quizzess?.current_page === 1}
                            className="h-8 px-2"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {quizzess?.links.map((link, i) => {
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
                            onClick={() => handlePageChange(quizzess?.current_page + 1)}
                            disabled={quizzess?.current_page === quizzess?.last_page}
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
                                {editQuiz ? 'Edit Quiz' : 'Add Quiz'}
                            </DialogTitle>
                            <DialogDescription>
                                {editQuiz ? 'Make changes to your module here.' : 'Create a new module here.'}
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
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter Module Desciption ..."
                                    required
                                />
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="passing_score">Passing Score</Label>
                                <Input
                                    id="passing_score"
                                    type="number"
                                    name="passing_score"
                                    min={1}
                                    max={100}
                                    value={formData.passing_score}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>



                             <div className="space-y-2">
                                <Label htmlFor="max_attempts">Max Attempts</Label>
                                <Input
                                    id="max_attempts"
                                    type="number"
                                    name="max_attempts"
                                    min={0}
                                    max={100}
                                    value={formData.max_attempts}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="max_time_limit">Max Time Limits (in Sec)</Label>
                                <Input
                                    id="max_time_limit"
                                    type="number"
                                    name="max_time_limit"
                                    min={10}
                                    value={formData.max_time_limit}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>



                            <div className="space-y-2">
                                <Label htmlFor="module_id">Module</Label>
                                <Select
                                    value={formData.module_id.toString()}
                                    onValueChange={handleModuleChange}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select module" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modules?.map((module) => (
                                            <SelectItem
                                                key={module.id}
                                                value={module.id.toString()}
                                            >
                                                {module.title} -{module?.course?.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    {editQuiz ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
