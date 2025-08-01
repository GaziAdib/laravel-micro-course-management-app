import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/contexts/CartContext"
import { useForm, usePage } from "@inertiajs/react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useEffect } from "react"

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        payment_gateway: '',
        customer_mobile: '',
        customer_email: user?.email || '',
        customer_address: '',
        bkash_trxId: undefined,  // instead of empty string
        bank_receipt_no: undefined,
        transaction_id: undefined,
        amount_paid: cartTotal,
        order_items: cart.map(item => ({
            course_data: {
                id: item.course.id,
                title: item.course.title,
                price: item.course.price,
                image_url: item.course.image_url,
                duration: item.course.duration
            },
            quantity: item.quantity || 1,
            coupon_code: item.coupon_code || null,
            discount_amount: item.discount_amount || 0
        }))
    });


    // Show form errors as toasts
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach(error => {
                toast.error(error);
            });
        }
    }, [errors]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side validation based on payment method
        if (data.payment_gateway === 'Bkash') {
            if (!/^[A-Z0-9]{10,}$/i.test(data.bkash_trxId || '')) {
                toast.error("Please enter a valid 10+ character Bkash Transaction ID");
                return;
            }
        } else if (data.payment_gateway === 'Bank') {
            if (!data.bank_receipt_no) {
                toast.error("Please enter your bank receipt ID");
                return;
            }
        }

        // Prepare the data to send
        const formData = {
            payment_gateway: data.payment_gateway,
            customer_mobile: data.customer_mobile,
            customer_email: data.customer_email,
            customer_address: data.customer_address,
            amount_paid: data.amount_paid,
            courses: data.courses,
            ...(data.payment_gateway === 'Stripe' && { transaction_id: data.transaction_id }),
            // Include payment method specific fields
            ...(data.payment_gateway === 'Bkash' && { bkash_trxId: data.bkash_trxId }),
            ...(data.payment_gateway === 'Bank' && { bank_receipt_no: data.bank_receipt_no })
        };

        post(route('checkout.store'), {
            data: formData,
            onSuccess: () => {
                toast.success("Order placed successfully!");
                clearCart();
            },
            onError: (errors) => {
                if (errors.bank_receipt_no) {
                    toast.error(errors.bank_receipt_no);
                }
                // Handle other errors...
            }
        });
    };



    return (
        <div className="container dark:text-white mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - User Info & Payment */}
                    <div className="dark:bg-gray-950 md:col-span-2 space-y-6">
                        {/* User Information */}
                        <div className="rounded-lg shadow p-6 dark:bg-black border-2">
                            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.customer_email}
                                        readOnly
                                        className="bg-gray-100 dark:bg-gray-950"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="customer_mobile">Mobile Number*</Label>
                                    <Input
                                        id="customer_mobile"
                                        value={data.customer_mobile}
                                        onChange={(e) => setData('customer_mobile', e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        required
                                        className={errors.customer_mobile ? 'border-red-500' : 'bg-gray-100 dark:bg-gray-950'}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="customer_address">Delivery Address*</Label>
                                    <Input
                                        id="customer_address"
                                        value={data.customer_address}
                                        onChange={(e) => setData('customer_address', e.target.value)}
                                        placeholder="Your full address"
                                        required
                                        className={errors.customer_address ? 'border-red-500' : ''}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-lg shadow p-6 dark:bg-black border-2">
                            <h2 className="text-lg font-semibold mb-4">Payment Method*</h2>

                            <RadioGroup
                                value={data.payment_gateway}
                                onValueChange={(value) => setData('payment_gateway', value)}
                                className="space-y-3"
                                required
                            >

                                <div className="flex items-center space-x-3 border rounded-lg p-4">
                                    <RadioGroupItem value="Stripe" id="Stripe" />
                                    <div className="flex-1">
                                        <Label htmlFor="Stripe" className="flex items-center gap-2">
                                            <span>Stripe</span>
                                        </Label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Pay via Stripe app using your mobile number
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 border rounded-lg p-4">
                                    <RadioGroupItem value="Bkash" id="Bkash" />
                                    <div className="flex-1">
                                        <Label htmlFor="Bkash" className="flex items-center gap-2">
                                            <span>Bkash</span>
                                        </Label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Pay via bKash app using your mobile number
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 border rounded-lg p-4">
                                    <RadioGroupItem value="Bank" id="Bank" />
                                    <div className="flex-1">
                                        <Label htmlFor="Bank" className="flex items-center gap-2">
                                            <span>Bank Transfer</span>
                                        </Label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Pay via bank transfer and upload receipt
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 border rounded-lg p-4">
                                    <RadioGroupItem value="HandCash" id="HandCash" />
                                    <div className="flex-1">
                                        <Label htmlFor="HandCash" className="flex items-center gap-2">
                                            <span>Hand Cash</span>
                                        </Label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Pay with cash on delivery
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>

                            {data.payment_gateway === 'Stripe' && (
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <Label>Payment Instructions</Label>
                                        <div className="bg-blue-50 dark:bg-gray-900 p-4 rounded-lg text-sm mt-2">
                                            <ol className="list-decimal pl-5 space-y-1">
                                                <li>Go to Stripe</li>
                                                <li>Select "Make Payment"</li>
                                                <li>Enter Card Stripe Number: <strong>0123456789</strong></li>
                                                <li>Enter Amount: <strong>৳{cartTotal}</strong></li>
                                                <li>Complete the transaction</li>
                                            </ol>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="transaction_id">Stripe Transaction ID*</Label>
                                        <Input
                                            id="transaction_id"
                                            value={data.transaction_id}
                                            onChange={(e) => setData('transaction_id', e.target.value)}
                                            placeholder="Ex: 8A7D6F5G4H"
                                            required
                                            className={errors.transaction_id ? 'border-red-500' : ''}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="amount_paid">Paid Amount (৳)*</Label>
                                        <Input
                                            id="amount_paid"
                                            type="number"
                                            value={data.amount_paid}
                                            readOnly
                                            required
                                            min={cartTotal}
                                            className={errors.amount_paid ? 'border-red-500' : ''}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Bkash Payment Details */}
                            {data.payment_gateway === 'Bkash' && (
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <Label>Payment Instructions</Label>
                                        <div className="bg-blue-50 dark:bg-gray-900 p-4 rounded-lg text-sm mt-2">
                                            <ol className="list-decimal pl-5 space-y-1">
                                                <li>Go to bKash app</li>
                                                <li>Select "Make Payment"</li>
                                                <li>Enter Merchant Number: <strong>0123456789</strong></li>
                                                <li>Enter Amount: <strong>৳{cartTotal}</strong></li>
                                                <li>Complete the transaction</li>
                                            </ol>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="bkash_trxId">bKash Transaction ID*</Label>
                                        <Input
                                            id="bkash_trxId"
                                            value={data.bkash_trxId}
                                            onChange={(e) => setData('bkash_trxId', e.target.value)}
                                            placeholder="Ex: 8A7D6F5G4H"
                                            required
                                            className={errors.bkash_trxId ? 'border-red-500' : ''}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="amount_paid">Paid Amount (৳)*</Label>
                                        <Input
                                            id="amount_paid"
                                            type="number"
                                            value={data.amount_paid}
                                            readOnly
                                            required
                                            min={cartTotal}
                                            className={errors.amount_paid ? 'border-red-500' : ''}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Bank Payment Details */}
                            {data.payment_gateway === 'Bank' && (
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <Label>Payment Instructions</Label>
                                        <div className="bg-blue-50 dark:bg-gray-900 p-4 rounded-lg text-sm mt-2">
                                            <ol className="list-decimal pl-5 space-y-1">
                                                <li>Transfer to our bank account</li>
                                                <li>Bank: Example Bank</li>
                                                <li>Account Number: 1234567890</li>
                                                <li>Amount: <strong>৳{cartTotal}</strong></li>
                                                <li>Keep your transaction receipt</li>
                                            </ol>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="bank_receipt_no">Bank Receipt ID*</Label>
                                        <Input
                                            id="bank_receipt_no"
                                            value={data.bank_receipt_no}
                                            onChange={(e) => setData('bank_receipt_no', e.target.value)}
                                            placeholder="Enter your bank transaction reference"
                                            required
                                            className={errors.bank_receipt_no ? 'border-red-500' : ''}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="amount_paid">Paid Amount (৳)*</Label>
                                        <Input
                                            id="amount_paid"
                                            type="number"
                                            value={data.amount_paid}
                                            onChange={(e) => setData('amount_paid', e.target.value)}
                                            required
                                            readOnly
                                            min={cartTotal}
                                            className={errors.amount_paid ? 'border-red-500' : ''}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Hand Cash Payment Details */}
                            {data.payment_gateway === 'HandCash' && (
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <Label>Payment Instructions</Label>
                                        <div className="bg-blue-50 dark:bg-gray-900 p-4 rounded-lg text-sm mt-2">
                                            <p>Our delivery agent will collect the payment in cash when delivering your order.</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="amount_paid">Amount to Pay (৳)*</Label>
                                        <Input
                                            id="amount_paid"
                                            type="number"
                                            value={data.amount_paid}
                                            onChange={(e) => setData('amount_paid', e.target.value)}
                                            required
                                            min={cartTotal}
                                            className={errors.amount_paid ? 'border-red-500' : ''}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Please enter the exact amount you'll pay in cash</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-black border-2 rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.course.id} className="flex justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.course.image_url}
                                                alt={item.course.title}
                                                className="w-12 h-12 rounded-md object-cover"
                                            />
                                            <span className="line-clamp-1">{item.course.title}</span>
                                        </div>
                                        <span>৳{item.course.price}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Order Totals */}
                            <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>৳{cartTotal}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>৳{cartTotal}</span>
                                </div>
                            </div>

                            {/* Terms & Submit */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center space-x-2">
                                    {/* <input
                                        type="checkbox"
                                        id="agree_terms"
                                        checked={data.agree_terms}
                                        onChange={(e) => setData('agree_terms', e.target.checked)}
                                        className="h-4 w-4"
                                        required
                                    /> */}
                                    <label htmlFor="agree_terms" className="text-sm">
                                        I agree to the terms and conditions*
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full mt-4"
                                >
                                    {processing ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Complete Purchase
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}












// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { useCart } from "@/contexts/CartContext"
// import { useForm, usePage } from "@inertiajs/react"
// import { Loader2 } from "lucide-react"
// import { toast } from "sonner"
// import { useEffect } from "react"

// export default function CheckoutPage() {
//     const { cart, cartTotal, clearCart } = useCart();
//     const { auth } = usePage().props;
//     const user = auth.user;

//     var { data, setData, post, processing, errors } = useForm({
//         payment_gateway: '',
//         customer_mobile: '',
//         customer_email: user?.email || '',
//         customer_address: '', // Add this line
//         bkash_trxId: '',
//         amount_paid: cartTotal,
//         agree_terms: false,
//         courses: cart.map(item => item.course.id)
//     });

//     // Show form errors as toasts
//     useEffect(() => {
//         if (Object.keys(errors).length > 0) {
//             Object.values(errors).forEach(error => {
//                 toast.error(error);
//             });
//         }
//     }, [errors]);

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // Client-side validation
//         if (data.payment_gateway === 'Bkash' && !/^[A-Z0-9]{10,}$/i.test(data.bkash_trxId)) {
//             toast.error("Please enter a valid 10+ character Bkash Transaction ID");
//             return;
//         }

//         post(route('checkout.store'), {
//            onSuccess: () => {
//             toast.success("Order placed successfully!");
//             clearCart();
//         },
//             onError: () => toast.error("Please check your form for errors")
//         });
//     };

//     return (
//         <div className="container dark:text-white mx-auto py-8">
//             <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>

//             <form onSubmit={handleSubmit}>
//                 <div className="grid md:grid-cols-3 gap-8">
//                     {/* Left Column - User Info & Payment */}
//                     <div className="md:col-span-2 space-y-6">
//                         {/* User Information */}
//                         <div className="rounded-lg shadow p-6 dark:bg-gray-800">
//                             <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="email">Email</Label>
//                                     <Input
//                                         id="email"
//                                         type="email"
//                                         value={data.customer_email}
//                                         readOnly
//                                         className="bg-gray-100 dark:bg-gray-700"
//                                     />
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="customer_mobile">Mobile Number*</Label>
//                                     <Input
//                                         id="customer_mobile"
//                                         value={data.customer_mobile}
//                                         onChange={(e) => setData('customer_mobile', e.target.value)}
//                                         placeholder="01XXXXXXXXX"
//                                         required
//                                         className={errors.customer_mobile ? 'border-red-500' : ''}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             {/* ... other fields ... */}
//                             <div>
//                                 <Label htmlFor="customer_address">Delivery Address*</Label>
//                                 <Input
//                                     id="customer_address"
//                                     value={data.customer_address}
//                                     onChange={(e) => setData('customer_address', e.target.value)}
//                                     placeholder="Your full address"
//                                     required
//                                     className={errors.customer_address ? 'border-red-500' : ''}
//                                 />
//                                 {errors.customer_address && (
//                                     <p className="text-sm text-red-500 mt-1">{errors.customer_address}</p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Payment Method */}
//                         <div className="rounded-lg shadow p-6 dark:bg-gray-800">
//                             <h2 className="text-lg font-semibold mb-4">Payment Method*</h2>

//                             <RadioGroup
//                                 value={data.payment_gateway}
//                                 onValueChange={(value) => setData('payment_gateway', value)}
//                                 className="space-y-3"
//                                 required
//                             >
//                                 <div className="flex items-center space-x-3 border rounded-lg p-4">
//                                     <RadioGroupItem value="Bkash" id="Bkash" />
//                                     <div className="flex-1">
//                                         <Label htmlFor="Bkash" className="flex items-center gap-2">
//                                             <span>Bkash</span>
//                                         </Label>
//                                         <p className="text-sm text-gray-500 mt-1">
//                                             Pay via bKash app using your mobile number
//                                         </p>
//                                     </div>
//                                 </div>
//                             </RadioGroup>

//                             {/* Bkash Payment Details */}
//                             {data.payment_gateway === 'Bkash' && (
//                                 <div className="mt-6 space-y-4">
//                                     <div>
//                                         <Label>Payment Instructions</Label>
//                                         <div className="bg-blue-50 dark:bg-gray-900 p-4 rounded-lg text-sm mt-2">
//                                             <ol className="list-decimal pl-5 space-y-1">
//                                                 <li>Go to bKash app</li>
//                                                 <li>Select "Make Payment"</li>
//                                                 <li>Enter Merchant Number: <strong>0123456789</strong></li>
//                                                 <li>Enter Amount: <strong>৳{cartTotal}</strong></li>
//                                                 <li>Complete the transaction</li>
//                                             </ol>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="bkash_trxId">bKash Transaction ID*</Label>
//                                         <Input
//                                             id="bkash_trxId"
//                                             value={data.bkash_trxId}
//                                             onChange={(e) => setData('bkash_trxId', e.target.value)}
//                                             placeholder="Ex: 8A7D6F5G4H"
//                                             required
//                                             className={errors.bkash_trxId ? 'border-red-500' : ''}
//                                         />
//                                     </div>

//                                     <div>
//                                         <Label htmlFor="amount_paid">Paid Amount (৳)*</Label>
//                                         <Input
//                                             id="amount_paid"
//                                             type="number"
//                                             value={data.amount_paid}
//                                             onChange={(e) => setData('amount_paid', e.target.value)}
//                                             required
//                                             min={1}
//                                             className={errors.amount_paid ? 'border-red-500' : ''}
//                                         />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Right Column - Order Summary */}
//                     <div className="md:col-span-1">
//                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
//                             <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

//                             {/* Cart Items */}
//                             <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
//                                 {cart.map((item) => (
//                                     <div key={item.course.id} className="flex justify-between">
//                                         <div className="flex items-center gap-3">
//                                             <img
//                                                 src={item.course.image_url}
//                                                 alt={item.course.title}
//                                                 className="w-12 h-12 rounded-md object-cover"
//                                             />
//                                             <span className="line-clamp-1">{item.course.title}</span>
//                                         </div>
//                                         <span>৳{item.course.price}</span>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Order Totals */}
//                             <div className="border-t pt-3 space-y-2">
//                                 <div className="flex justify-between">
//                                     <span>Subtotal</span>
//                                     <span>৳{cartTotal}</span>
//                                 </div>
//                                 <div className="flex justify-between font-bold text-lg">
//                                     <span>Total</span>
//                                     <span>৳{cartTotal}</span>
//                                 </div>
//                             </div>

//                             {/* Terms & Submit */}
//                             <div className="mt-6 space-y-3">
//                                 <div className="flex items-center space-x-2">
//                                     <input
//                                         type="checkbox"
//                                         id="agree_terms"
//                                         checked={data.agree_terms}
//                                         onChange={(e) => setData('agree_terms', e.target.checked)}
//                                         className="h-4 w-4"
//                                         required
//                                     />
//                                     <label htmlFor="agree_terms" className="text-sm">
//                                         I agree to the terms and conditions*
//                                     </label>
//                                 </div>

//                                 <Button
//                                     type="submit"
//                                     disabled={processing}
//                                     className="w-full mt-4"
//                                 >
//                                     {processing ? (
//                                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                     ) : null}
//                                     Complete Purchase
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     )
// }

















// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { useCart } from "@/contexts/CartContext"
// import { useForm, usePage } from "@inertiajs/react"
// import { Loader2 } from "lucide-react"
// import { toast } from "sonner"

// export default function CheckoutPage() {

//     const { cart, cartTotal, cartCount } = useCart();

//     const { auth } = usePage().props;
//     const user = auth.user

//     const { data, setData, post, processing, errors } = useForm({
//         payment_method: 'Bkash',
//         customer_phone: '',
//         customer_email: '',
//         bkash_trxId: '',
//         amount_paid: cartTotal,
//         courses: cart?.length > 0 ? cart?.map(item => item.course.id) : []
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         post(route('checkout.store'), {
//             // No need to nest in 'data' object - Inertia handles this automatically
//             onSuccess: () => toast.success("Order placed successfully!"),
//             onError: () => toast.error("Failed to process order")
//         });
//     };

//     return (
//         <div className="container dark:text-white  mx-auto py-8">
//             <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>

//             <div className="grid md:grid-cols-3 gap-8">
//                 {/* Left Column - User Info & Payment */}
//                 <div className="md:col-span-2 space-y-6">
//                     {/* User Information */}
//                     <div className="rounded-lg shadow p-6">
//                         <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
//                         <div className="space-y-4">
//                             <div>
//                                 <Label htmlFor="email">Email</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     name="email"
//                                     onChange={(e) => setData('customer_email', e.target.value)}

//                                     value={user?.email}
//                                     className=""
//                                     readOnly
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="customer_phone">Mobile Number</Label>
//                                 <Input
//                                     id="customer_phone"
//                                     name="customer_phone"
//                                     value={data.customer_phone}
//                                     onChange={(e) => setData('customer_phone', e.target.value)}
//                                     placeholder="01XXXXXXXXX"
//                                     className={errors.customer_phone ? 'border-red-500' : ''}
//                                 />
//                                 {errors.customer_phone && (
//                                     <p className="text-sm text-red-500 mt-1">{errors.customer_phone}</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Payment Method */}
//                     <div className=" rounded-lg shadow p-6">
//                         <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

//                         <RadioGroup
//                             name="payment_method"
//                             defaultValue="Bkash"
//                             value={data.payment_method}
//                             onValueChange={(value) => setData('payment_method', value)}
//                             className="space-y-3"
//                         >
//                             <div className="flex items-center space-x-3 border rounded-lg p-4">
//                                 <RadioGroupItem value="Bkash" id="Bkash" />
//                                 <div className="flex-1">
//                                     <Label htmlFor="Bkash" className="flex items-center gap-2">
//                                         {/* <img src="/images/bkash-logo.png" alt="Bkash" className="h-6" /> */}
//                                         <span>Bkash</span>
//                                     </Label>
//                                     <p className="text-sm text-gray-500 mt-1">
//                                         Pay via bKash app using your mobile number
//                                     </p>
//                                 </div>
//                             </div>
//                         </RadioGroup>

//                         {/* Bkash Payment Details */}
//                         {data.payment_method === 'Bkash' && (
//                             <div className="mt-6 space-y-4">
//                                 <div>
//                                     <Label>Payment Instructions</Label>
//                                     <div className="bg-blue-50 dark:bg-gray-900 p-4 rounded-lg text-sm mt-2">
//                                         <ol className="list-decimal pl-5 space-y-1">
//                                             <li>Go to bKash app</li>
//                                             <li>Select "Make Payment"</li>
//                                             <li>Enter Merchant Number: <strong>0123456789</strong></li>
//                                             <li>Enter Amount: <strong>৳{cartTotal}</strong></li>
//                                             {/* <li>Enter Reference: <strong>ORDER-{cart.id}</strong></li> */}
//                                             <li>Complete the transaction</li>
//                                         </ol>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <Label htmlFor="bkash_trxId">bKash Transaction ID</Label>
//                                     <Input
//                                         id="bkash_trxId"
//                                         name="bkash_trxId"
//                                         value={data.bkash_trxId}
//                                         onChange={(e) => setData('bkash_trxId', e.target.value)}
//                                         placeholder="Ex: 8A7D6F5G4H"
//                                         className={errors.bkash_trxId ? 'border-red-500' : ''}
//                                     />
//                                     {errors.bkash_trxId && (
//                                         <p className="text-sm text-red-500 mt-1">{errors.bkash_trxId}</p>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <Label htmlFor="amount_paid">Paid Amount (৳)</Label>
//                                     <Input
//                                         id="amount_paid"
//                                         type="number"
//                                         name="amount_paid"
//                                         value={data.amount_paid}
//                                         onChange={(e) => setData('amount_paid', e.target.value)}
//                                         className={errors.amount_paid ? 'border-red-500' : ''}
//                                     />
//                                     {errors.amount_paid && (
//                                         <p className="text-sm text-red-500 mt-1">{errors.amount_paid}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Right Column - Order Summary */}
//                 <div className="md:col-span-1">
//                     <div className="bg-white rounded-lg shadow p-6 sticky top-4">
//                         <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

//                         {/* Cart Items */}
//                         <div className="space-y-3 mb-4">
//                             {cart?.map((item) => (
//                                 <div key={item.course.id} className="flex justify-between">
//                                     <div className="flex items-center gap-3">
//                                         <img
//                                             src={item.course.image_url}
//                                             alt={item.course.title}
//                                             className="w-12 h-12 rounded-md object-cover"
//                                         />
//                                         <span className="line-clamp-1">{item.course.title}</span>
//                                     </div>
//                                     <span>৳{item.course.price}</span>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Order Totals */}
//                         <div className="border-t pt-3 space-y-2">
//                             <div className="flex justify-between">
//                                 <span>Subtotal</span>
//                                 <span>৳{cartTotal}</span>
//                             </div>
//                             <div className="flex justify-between font-bold text-lg">
//                                 <span>Total</span>
//                                 <span>৳{cartTotal}</span>
//                             </div>
//                         </div>

//                         {/* Terms & Submit */}
//                         <div className="mt-6 space-y-3">
//                             <Button
//                                 type="submit"
//                                 onClick={handleSubmit}
//                                 className="w-full mt-4"
//                             >
//                                 {processing ? (
//                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 ) : null}
//                                 Complete Purchase
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }






















// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { useCart } from "@/contexts/CartContext"
// import { useForm, usePage } from "@inertiajs/react"
// import { Loader2 } from "lucide-react"

// export default function CheckoutPage() {

//     const { cart, cartTotal, cartCount } = useCart();

//     const { auth } = usePage().props;
//     const user = auth.user

//     const { data, setData, post, processing, errors } = useForm({
//         payment_method: 'Bkash',
//         customer_phone: user?.mobile || '',
//         customer_email: user?.email || '',
//         bkash_trxId: '',
//         amount_paid: cartTotal,
//         agree_terms: false
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault()
//         post(route('checkout.process', {data: data}))
//     }

//     return (
//         <div className="container dark:text-white  mx-auto py-8">
//             <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>

//             <div className="grid md:grid-cols-3 gap-8">
//                 {/* Left Column - User Info & Payment */}
//                 <div className="md:col-span-2 space-y-6">
//                     {/* User Information */}
//                     <div className="rounded-lg shadow p-6">
//                         <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
//                         <div className="space-y-4">
//                             <div>
//                                 <Label htmlFor="email">Email</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     value={user?.email}
//                                     readOnly
//                                     className=""
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="mobile">Mobile Number</Label>
//                                 <Input
//                                     id="mobile"
//                                     value={data.customer_phone}
//                                     onChange={(e) => setData('customer_phone', e.target.value)}
//                                     placeholder="01XXXXXXXXX"
//                                     className={errors.customer_phone ? 'border-red-500' : ''}
//                                 />
//                                 {errors.customer_phone && (
//                                     <p className="text-sm text-red-500 mt-1">{errors.customer_phone}</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Payment Method */}
//                     <div className=" rounded-lg shadow p-6">
//                         <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

//                         <RadioGroup
//                             value={data.payment_method}
//                             onValueChange={(value) => setData('payment_method', value)}
//                             className="space-y-3"
//                         >
//                             <div className="flex items-center space-x-3 border rounded-lg p-4">
//                                 <RadioGroupItem value="bkash" id="bkash" />
//                                 <div className="flex-1">
//                                     <Label htmlFor="bkash" className="flex items-center gap-2">
//                                         {/* <img src="/images/bkash-logo.png" alt="Bkash" className="h-6" /> */}
//                                         <span>Bkash</span>
//                                     </Label>
//                                     <p className="text-sm text-gray-500 mt-1">
//                                         Pay via bKash app using your mobile number
//                                     </p>
//                                 </div>
//                             </div>
//                         </RadioGroup>

//                         {/* Bkash Payment Details */}
//                         {data.payment_method === 'bkash' && (
//                             <div className="mt-6 space-y-4">
//                                 <div>
//                                     <Label>Payment Instructions</Label>
//                                     <div className="bg-blue-50 dark:bg-gray-900 p-4 rounded-lg text-sm mt-2">
//                                         <ol className="list-decimal pl-5 space-y-1">
//                                             <li>Go to bKash app</li>
//                                             <li>Select "Make Payment"</li>
//                                             <li>Enter Merchant Number: <strong>0123456789</strong></li>
//                                             <li>Enter Amount: <strong>৳{cartTotal}</strong></li>
//                                             {/* <li>Enter Reference: <strong>ORDER-{cart.id}</strong></li> */}
//                                             <li>Complete the transaction</li>
//                                         </ol>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <Label htmlFor="bkash_trxId">bKash Transaction ID</Label>
//                                     <Input
//                                         id="bkash_trxId"
//                                         value={data.bkash_trxId}
//                                         onChange={(e) => setData('bkash_trxId', e.target.value)}
//                                         placeholder="Ex: 8A7D6F5G4H"
//                                         className={errors.bkash_trxId ? 'border-red-500' : ''}
//                                     />
//                                     {errors.bkash_trxId && (
//                                         <p className="text-sm text-red-500 mt-1">{errors.bkash_trxId}</p>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <Label htmlFor="amount_paid">Paid Amount (৳)</Label>
//                                     <Input
//                                         id="amount_paid"
//                                         type="number"
//                                         value={data.amount_paid}
//                                         onChange={(e) => setData('amount_paid', e.target.value)}
//                                         className={errors.amount_paid ? 'border-red-500' : ''}
//                                     />
//                                     {errors.amount_paid && (
//                                         <p className="text-sm text-red-500 mt-1">{errors.amount_paid}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Right Column - Order Summary */}
//                 <div className="md:col-span-1">
//                     <div className="bg-white rounded-lg shadow p-6 sticky top-4">
//                         <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

//                         {/* Cart Items */}
//                         <div className="space-y-3 mb-4">
//                             {cart?.map((item) => (
//                                 <div key={item.course.id} className="flex justify-between">
//                                     <div className="flex items-center gap-3">
//                                         <img
//                                             src={item.course.image_url}
//                                             alt={item.course.title}
//                                             className="w-12 h-12 rounded-md object-cover"
//                                         />
//                                         <span className="line-clamp-1">{item.course.title}</span>
//                                     </div>
//                                     <span>৳{item.course.price}</span>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Order Totals */}
//                         <div className="border-t pt-3 space-y-2">
//                             <div className="flex justify-between">
//                                 <span>Subtotal</span>
//                                 <span>৳{cartTotal}</span>
//                             </div>
//                             <div className="flex justify-between font-bold text-lg">
//                                 <span>Total</span>
//                                 <span>৳{cartTotal}</span>
//                             </div>
//                         </div>

//                         {/* Terms & Submit */}
//                         <div className="mt-6 space-y-3">
//                             <div className="flex items-center space-x-2">
//                                 <input
//                                     type="checkbox"
//                                     id="agree_terms"
//                                     checked={data.agree_terms}
//                                     onChange={(e) => setData('agree_terms', e.target.checked)}
//                                     className="h-4 w-4"
//                                 />
//                                 <label htmlFor="agree_terms" className="text-sm">
//                                     I agree to the <a href="#" className="text-blue-600">terms and conditions</a>
//                                 </label>
//                             </div>
//                             {errors.agree_terms && (
//                                 <p className="text-sm text-red-500">{errors.agree_terms}</p>
//                             )}

//                             <Button
//                                 type="submit"
//                                 onClick={handleSubmit}
//                                 disabled={processing || !data.agree_terms}
//                                 className="w-full mt-4"
//                             >
//                                 {processing ? (
//                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 ) : null}
//                                 Complete Purchase
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
