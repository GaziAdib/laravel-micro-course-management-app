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

interface Course {
    id: number;
    title: string;
}


interface Purchase {
    id: number;
    payment_gateway: string;
    amount_paid: number;
    status: string;
    courses: Course[]
    user: {
        id: number;
        name: string;
        email: string
    }
}

interface PaginatedData {
    data: Purchase[];
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

interface PurchasesPageProps {
    purchases: PaginatedData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: '/user/Purchases',
        href: '/user/purchases',
    },
];

export default function PurchasesPage({ purchases }: PurchasesPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [editStatus, setEditStatus] = useState<Purchase | null>(null);
    const [formData, setFormData] = useState({
        status: '',
    });

    const handleAdd = () => {
        setEditStatus(null);
        setFormData({ status: '' });
        setShowModal(true);
    };


    const handleStatusChange = (value) => {
        setFormData({ ...formData, status: value })

        console.log(formData)
    }


    const handleEdit = (purchase: Purchase) => {
        setEditStatus(purchase);
        setFormData({ status: purchase.status });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this purchase item?')) {
            router.delete(`/admin/purchases/${editStatus?.id}/delete`, {
                onSuccess: () => {
                    toast.success('Purchased item deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to delete purchases');
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editStatus) {
            router.put(`/admin/purchases/${editStatus?.id}/update`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Purchase updated successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to update purchase');
                },
            });
        } else {
            console.log('post')
            // router.post('/admin/purchases', formData, {
            //     onSuccess: () => {
            //         setShowModal(false);
            //         toast.success('Purchase created successfully');
            //     },
            //     onError: (errors) => {
            //         toast.error(errors.name || 'Failed to create purchase');
            //     },
            // });
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
        router.get(route('admin.purchases.index'), { page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchases" />
            <Toaster richColors closeButton position="top-right" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Purchases</h1>
                    <Button onClick={handleAdd}>
                        Add Purchases
                    </Button>
                </div>


                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Payment gateway</TableHead>
                                <TableHead>Amount Paid</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Customer Name</TableHead>
                                <TableHead>Customer Email</TableHead>
                                <TableHead>Courses Purchased</TableHead>
                                <TableHead>Actions</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchases.data.map((purchase) => (
                                <TableRow key={purchase.id}>
                                    <TableCell>{purchase.id}</TableCell>
                                    <TableCell>{purchase.payment_gateway}</TableCell>
                                    <TableCell>{purchase.amount_paid}</TableCell>
                                    <TableCell>{purchase.status}</TableCell>
                                    <TableCell>{purchase.user.name}</TableCell>
                                    <TableCell>{purchase.user.email}</TableCell>
                                    <TableCell>
                                        {purchase.courses?.map((course) => (
                                            <div key={course.id}>
                                                {course.title},
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(purchase)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(purchase.id)}
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
                            onClick={() => handlePageChange(purchases.current_page - 1)}
                            disabled={purchases.current_page === 1}
                            className="h-8 px-2"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {purchases.links.map((link, i) => {
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
                            onClick={() => handlePageChange(purchases.current_page + 1)}
                            disabled={purchases.current_page === purchases.last_page}
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
                                {editStatus ? 'Edit Category' : 'Add Category'}
                            </DialogTitle>
                            <DialogDescription>
                                {editStatus ? 'Make changes to your category here.' : 'Create a new category here.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={handleStatusChange}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>

                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="failed">failed</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                        <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
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
                                    {editStatus ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
