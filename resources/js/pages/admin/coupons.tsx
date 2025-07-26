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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import { format } from 'date-fns';

interface Coupon {
    id: number;
    code: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    valid_from: string;
    valid_until: string;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
    created_at: string;
}

interface PaginatedData {
    data: Coupon[];
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

interface CouponsPageProps {
    coupons: PaginatedData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Coupons',
        href: '/admin/coupons',
    },
];

export default function CouponsPage({ coupons }: CouponsPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [openFromPopover, setOpenFromPopover] = useState(false);
    const [openUntilPopover, setOpenUntilPopover] = useState(false);
    const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 0,
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default: 30 days from now
        usage_limit: null as number | null,
        is_active: true,
    });

    const handleAdd = () => {
        setEditCoupon(null);
        setFormData({
            code: '',
            description: '',
            discount_type: 'percentage',
            discount_value: 0,
            valid_from: new Date(),
            valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            usage_limit: null,
            is_active: true,
        });
        setShowModal(true);
    };

    const handleEdit = (coupon: Coupon) => {
        setEditCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            valid_from: new Date(coupon.valid_from),
            valid_until: new Date(coupon.valid_until),
            usage_limit: coupon.usage_limit,
            is_active: coupon.is_active,
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            router.delete(`/admin/delete-coupon/${id}`, {
                onSuccess: () => {
                    toast.success('Coupon deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to delete coupon');
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            ...formData,
            valid_from: format(formData.valid_from, 'yyyy-MM-dd HH:mm:ss'),
            valid_until: format(formData.valid_until, 'yyyy-MM-dd HH:mm:ss'),
        };

        if (editCoupon) {
            router.put(`/admin/update-coupon/${editCoupon.id}`, data, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Coupon updated successfully');
                },
                onError: (errors) => {
                    toast.error(Object.values(errors).join('\n') || 'Failed to update coupon');
                },
            });
        } else {
            router.post('/admin/add-coupon', data, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Coupon created successfully');
                },
                onError: (errors) => {
                    toast.error(Object.values(errors).join('\n') || 'Failed to create coupon');
                },
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'discount_value' || name === 'usage_limit'
                ? value === '' ? null : Number(value)
                : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (field: 'valid_from' | 'valid_until') => {
        return (date: Date | undefined) => {
            if (date) {
                setFormData(prev => ({
                    ...prev,
                    [field]: date
                }));
            }
        };
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.coupons.index'), { page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (coupon: Coupon) => {
        const now = new Date();
        const validFrom = new Date(coupon.valid_from);
        const validUntil = new Date(coupon.valid_until);

        if (!coupon.is_active) {
            return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Inactive</span>;
        }

        if (now < validFrom) {
            return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Scheduled</span>;
        }

        if (now > validUntil) {
            return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Expired</span>;
        }

        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">Used Up</span>;
        }

        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Coupons" />
            <Toaster richColors closeButton position="top-right" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Coupons</h1>
                    <Button onClick={handleAdd}>
                        Add Coupon
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Validity</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.data.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell className="font-medium">{coupon.code}</TableCell>
                                    <TableCell>{coupon.description || '-'}</TableCell>
                                    <TableCell>
                                        {coupon.discount_type === 'percentage'
                                            ? `${coupon.discount_value}%`
                                            : `$${coupon.discount_value.toFixed(2)}`}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{format(new Date(coupon.valid_from), 'MMM d, yyyy')}</span>
                                            <span className="text-sm text-gray-500">to</span>
                                            <span className="text-sm">{format(new Date(coupon.valid_until), 'MMM d, yyyy')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {coupon.usage_limit
                                            ? `${coupon.used_count}/${coupon.usage_limit}`
                                            : `${coupon.used_count} uses`}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(coupon)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(coupon)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(coupon.id)}
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
                            onClick={() => handlePageChange(coupons.current_page - 1)}
                            disabled={coupons.current_page === 1}
                            className="h-8 px-2"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {coupons.links.map((link, i) => {
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
                            onClick={() => handlePageChange(coupons.current_page + 1)}
                            disabled={coupons.current_page === coupons.last_page}
                            className="h-8 px-2"
                        >
                            Next
                        </Button>
                    </nav>
                </div>

                {/* Add/Edit Coupon Modal */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editCoupon ? 'Edit Coupon' : 'Add Coupon'}
                            </DialogTitle>
                            <DialogDescription>
                                {editCoupon ? 'Update your coupon details.' : 'Create a new discount coupon.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Code *</Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="SUMMER24"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discount_type">Discount Type *</Label>
                                    <Select
                                        value={formData.discount_type}
                                        onValueChange={(value) => handleSelectChange('discount_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage</SelectItem>
                                            <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="discount_value">
                                        {formData.discount_type === 'percentage' ? 'Percentage *' : 'Amount *'}
                                    </Label>
                                    <Input
                                        id="discount_value"
                                        name="discount_value"
                                        type="number"
                                        min="0"
                                        step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                                        value={formData.discount_value}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={formData.discount_type === 'percentage' ? '10' : '50.00'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="usage_limit">Usage Limit (optional)</Label>
                                    <Input
                                        id="usage_limit"
                                        name="usage_limit"
                                        type="number"
                                        min="0"
                                        value={formData.usage_limit || ''}
                                        onChange={handleInputChange}
                                        placeholder="Unlimited if empty"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optional)</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Summer 2024 promotion"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="valid_from">Valid From *</Label>
                                    <Input
                                        id="valid_from"
                                        name="valid_from"
                                        type="datetime-local"
                                        value={formData.valid_from ? format(formData.valid_from, "yyyy-MM-dd'T'HH:mm") : ''}
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    valid_from: new Date(e.target.value)
                                                }));
                                            }
                                        }}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="valid_until">Valid Until *</Label>
                                    <Input
                                        id="valid_until"
                                        name="valid_until"
                                        type="datetime-local"
                                        value={formData.valid_until ? format(formData.valid_until, "yyyy-MM-dd'T'HH:mm") : ''}
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    valid_until: new Date(e.target.value)
                                                }));
                                            }
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="is_active">Active</Label>
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
                                    {editCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}










// import { useState } from 'react';
// import { router, Head } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Button } from "@/components/ui/button";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//     DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast, Toaster } from "sonner";
// import { format } from 'date-fns';
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";

// interface Coupon {
//     id: number;
//     code: string;
//     description: string | null;
//     discount_type: 'percentage' | 'fixed_amount';
//     discount_value: number;
//     valid_from: string;
//     valid_until: string;
//     usage_limit: number | null;
//     used_count: number;
//     is_active: boolean;
//     created_at: string;
// }

// interface PaginatedData {
//     data: Coupon[];
//     current_page: number;
//     last_page: number;
//     per_page: number;
//     total: number;
//     links: {
//         url: string | null;
//         label: string;
//         active: boolean;
//     }[];
// }

// interface CouponsPageProps {
//     coupons: PaginatedData;
// }

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Coupons',
//         href: '/admin/coupons',
//     },
// ];

// export default function CouponsPage({ coupons }: CouponsPageProps) {
//     const [showModal, setShowModal] = useState(false);
//     const [openFromPopover, setOpenFromPopover] = useState(false);
//     const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
//     const [formData, setFormData] = useState({
//         code: '',
//         description: '',
//         discount_type: 'percentage',
//         discount_value: 0,
//         valid_from: new Date(),
//         valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default: 30 days from now
//         usage_limit: null as number | null,
//         is_active: true,
//     });

//     const handleAdd = () => {
//         setEditCoupon(null);
//         setFormData({
//             code: '',
//             description: '',
//             discount_type: 'percentage',
//             discount_value: 0,
//             valid_from: new Date(),
//             valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//             usage_limit: null,
//             is_active: true,
//         });
//         setShowModal(true);
//     };

//     const handleEdit = (coupon: Coupon) => {
//         setEditCoupon(coupon);
//         setFormData({
//             code: coupon.code,
//             description: coupon.description || '',
//             discount_type: coupon.discount_type,
//             discount_value: coupon.discount_value,
//             valid_from: new Date(coupon.valid_from),
//             valid_until: new Date(coupon.valid_until),
//             usage_limit: coupon.usage_limit,
//             is_active: coupon.is_active,
//         });
//         setShowModal(true);
//     };

//     const handleDelete = (id: number) => {
//         if (confirm('Are you sure you want to delete this coupon?')) {
//             router.delete(`/admin/delete-coupon/${id}`, {
//                 onSuccess: () => {
//                     toast.success('Coupon deleted successfully');
//                 },
//                 onError: (errors) => {
//                     toast.error(errors.error || 'Failed to delete coupon');
//                 },
//             });
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const data = {
//             ...formData,
//             valid_from: format(formData.valid_from, 'yyyy-MM-dd HH:mm:ss'),
//             valid_until: format(formData.valid_until, 'yyyy-MM-dd HH:mm:ss'),
//         };

//         if (editCoupon) {
//             router.put(`/admin/update-coupon/${editCoupon.id}`, data, {
//                 onSuccess: () => {
//                     setShowModal(false);
//                     toast.success('Coupon updated successfully');
//                 },
//                 onError: (errors) => {
//                     toast.error(Object.values(errors).join('\n') || 'Failed to update coupon');
//                 },
//             });
//         } else {
//             router.post('/admin/add-coupon', data, {
//                 onSuccess: () => {
//                     setShowModal(false);
//                     toast.success('Coupon created successfully');
//                 },
//                 onError: (errors) => {
//                     toast.error(Object.values(errors).join('\n') || 'Failed to create coupon');
//                 },
//             });
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: name === 'discount_value' || name === 'usage_limit'
//                 ? value === '' ? null : Number(value)
//                 : value
//         }));
//     };

//     const handleSelectChange = (name: string, value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     //   const handleDateChange = (name: string, date: Date | undefined) => {
//     //     if (date) {
//     //       setFormData(prev => ({
//     //         ...prev,
//     //         [name]: date
//     //       }));
//     //     }
//     //   };

//     const handleDateChange = (field: 'valid_from' | 'valid_until') => {
//         return (date: Date | undefined) => {
//             if (date) {
//                 setFormData(prev => ({
//                     ...prev,
//                     [field]: date
//                 }));
//             }
//         };
//     };


//     const handlePageChange = (page: number) => {
//         router.get(route('admin.coupons.index'), { page }, {
//             preserveState: true,
//             preserveScroll: true,
//         });
//     };

//     const getStatusBadge = (coupon: Coupon) => {
//         const now = new Date();
//         const validFrom = new Date(coupon.valid_from);
//         const validUntil = new Date(coupon.valid_until);

//         if (!coupon.is_active) {
//             return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Inactive</span>;
//         }

//         if (now < validFrom) {
//             return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Scheduled</span>;
//         }

//         if (now > validUntil) {
//             return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Expired</span>;
//         }

//         if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
//             return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">Used Up</span>;
//         }

//         return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>;
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Coupons" />
//             <Toaster richColors closeButton position="top-right" />

//             <div className="flex flex-col gap-4 p-4">
//                 <div className="flex justify-between items-center mb-4">
//                     <h1 className="text-2xl font-bold">Coupons</h1>
//                     <Button onClick={handleAdd}>
//                         Add Coupon
//                     </Button>
//                 </div>

//                 <div className="rounded-md border">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Code</TableHead>
//                                 <TableHead>Description</TableHead>
//                                 <TableHead>Discount</TableHead>
//                                 <TableHead>Validity</TableHead>
//                                 <TableHead>Usage</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead>Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {coupons.data.map((coupon) => (
//                                 <TableRow key={coupon.id}>
//                                     <TableCell className="font-medium">{coupon.code}</TableCell>
//                                     <TableCell>{coupon.description || '-'}</TableCell>
//                                     <TableCell>
//                                         {coupon.discount_type === 'percentage'
//                                             ? `${coupon.discount_value}%`
//                                             : `$${coupon.discount_value.toFixed(2)}`}
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="flex flex-col">
//                                             <span className="text-sm">{format(new Date(coupon.valid_from), 'MMM d, yyyy')}</span>
//                                             <span className="text-sm text-gray-500">to</span>
//                                             <span className="text-sm">{format(new Date(coupon.valid_until), 'MMM d, yyyy')}</span>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         {coupon.usage_limit
//                                             ? `${coupon.used_count}/${coupon.usage_limit}`
//                                             : `${coupon.used_count} uses`}
//                                     </TableCell>
//                                     <TableCell>
//                                         {getStatusBadge(coupon)}
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="flex gap-2">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={() => handleEdit(coupon)}
//                                             >
//                                                 Edit
//                                             </Button>
//                                             <Button
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 onClick={() => handleDelete(coupon.id)}
//                                             >
//                                                 Delete
//                                             </Button>
//                                         </div>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex justify-start mt-4">
//                     <nav className="flex items-center space-x-2">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handlePageChange(coupons.current_page - 1)}
//                             disabled={coupons.current_page === 1}
//                             className="h-8 px-2"
//                         >
//                             Previous
//                         </Button>
//                         <div className="flex items-center space-x-1">
//                             {coupons.links.map((link, i) => {
//                                 if (link.label === '...') {
//                                     return (
//                                         <span key={i} className="px-2">...</span>
//                                     );
//                                 }

//                                 if (link.url === null) {
//                                     return null;
//                                 }

//                                 const page = parseInt(link.label);
//                                 return (
//                                     <Button
//                                         key={i}
//                                         variant={link.active ? "default" : "outline"}
//                                         size="sm"
//                                         onClick={() => handlePageChange(page)}
//                                         className="h-8 w-8 p-0"
//                                     >
//                                         {link.label}
//                                     </Button>
//                                 );
//                             })}
//                         </div>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handlePageChange(coupons.current_page + 1)}
//                             disabled={coupons.current_page === coupons.last_page}
//                             className="h-8 px-2"
//                         >
//                             Next
//                         </Button>
//                     </nav>
//                 </div>

//                 {/* Add/Edit Coupon Modal */}
//                 <Dialog open={showModal} onOpenChange={setShowModal}>
//                     <DialogContent className="sm:max-w-[600px]">
//                         <DialogHeader>
//                             <DialogTitle>
//                                 {editCoupon ? 'Edit Coupon' : 'Add Coupon'}
//                             </DialogTitle>
//                             <DialogDescription>
//                                 {editCoupon ? 'Update your coupon details.' : 'Create a new discount coupon.'}
//                             </DialogDescription>
//                         </DialogHeader>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="code">Code *</Label>
//                                     <Input
//                                         id="code"
//                                         name="code"
//                                         value={formData.code}
//                                         onChange={handleInputChange}
//                                         required
//                                         placeholder="SUMMER24"
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="discount_type">Discount Type *</Label>
//                                     <Select
//                                         value={formData.discount_type}
//                                         onValueChange={(value) => handleSelectChange('discount_type', value)}
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select type" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="percentage">Percentage</SelectItem>
//                                             <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="discount_value">
//                                         {formData.discount_type === 'percentage' ? 'Percentage *' : 'Amount *'}
//                                     </Label>
//                                     <Input
//                                         id="discount_value"
//                                         name="discount_value"
//                                         type="number"
//                                         min="0"
//                                         step={formData.discount_type === 'percentage' ? '1' : '0.01'}
//                                         value={formData.discount_value}
//                                         onChange={handleInputChange}
//                                         required
//                                         placeholder={formData.discount_type === 'percentage' ? '10' : '50.00'}
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="usage_limit">Usage Limit (optional)</Label>
//                                     <Input
//                                         id="usage_limit"
//                                         name="usage_limit"
//                                         type="number"
//                                         min="0"
//                                         value={formData.usage_limit || ''}
//                                         onChange={handleInputChange}
//                                         placeholder="Unlimited if empty"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="description">Description (optional)</Label>
//                                 <Input
//                                     id="description"
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                     placeholder="Summer 2024 promotion"
//                                 />
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="valid_from">Valid From *</Label>
//                                     <Popover open={openFromPopover} onOpenChange={setOpenFromPopover}>
//                                         <PopoverTrigger asChild>
//                                             <Button
//                                                 id="valid_from"
//                                                 variant="outline"
//                                                 className={`w-full justify-start text-left font-normal ${!formData.valid_from ? "text-muted-foreground" : ""
//                                                     }`}
//                                             >
//                                                 <CalendarIcon className="mr-2 h-4 w-4" />
//                                                 {formData.valid_from ? format(formData.valid_from, "PPP") : "Pick a date"}
//                                             </Button>
//                                         </PopoverTrigger>
//                                         <PopoverContent className="w-auto p-0" align="start">
//                                             <Calendar
//                                                 mode="single"
//                                                 selected={formData.valid_from}
//                                                 onSelect={(date) => {
//                                                     handleDateChange("valid_from")(date);
//                                                     setOpenFromPopover(false); // close after picking
//                                                 }}
//                                                 initialFocus
//                                             />
//                                         </PopoverContent>
//                                     </Popover>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label>Valid Until *</Label>
//                                     <Popover>
//                                         <PopoverTrigger asChild>
//                                             <Button
//                                                 variant="outline"
//                                                 className="w-full justify-start text-left font-normal"
//                                             >
//                                                 <CalendarIcon className="mr-2 h-4 w-4" />
//                                                 {formData.valid_until ? format(formData.valid_until, 'PPP') : <span>Pick a date</span>}
//                                             </Button>
//                                         </PopoverTrigger>
//                                         <PopoverContent className="w-auto p-0">
//                                             <Calendar
//                                                 mode="single"
//                                                 selected={formData.valid_until}
//                                                 onSelect={handleDateChange('valid_from')}
//                                                 initialFocus

//                                             />
//                                         </PopoverContent>
//                                     </Popover>
//                                 </div>
//                             </div>

//                             <div className="flex items-center space-x-2">
//                                 <input
//                                     type="checkbox"
//                                     id="is_active"
//                                     name="is_active"
//                                     checked={formData.is_active}
//                                     onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
//                                     className="h-4 w-4"
//                                 />
//                                 <Label htmlFor="is_active">Active</Label>
//                             </div>

//                             <DialogFooter>
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={() => setShowModal(false)}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button type="submit">
//                                     {editCoupon ? 'Update Coupon' : 'Create Coupon'}
//                                 </Button>
//                             </DialogFooter>
//                         </form>
//                     </DialogContent>
//                 </Dialog>
//             </div>
//         </AppLayout>
//     );
// }
