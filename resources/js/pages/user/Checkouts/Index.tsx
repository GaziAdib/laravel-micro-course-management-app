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
    const { cart, cartTotal } = useCart();
    const { auth } = usePage().props;
    const user = auth.user;

    var { data, setData, post, processing, errors } = useForm({
        payment_gateway: '',
        customer_mobile: '',
        customer_email: user?.email || '',
        customer_address: '', // Add this line
        bkash_trxId: '',
        amount_paid: cartTotal,
        agree_terms: false,
        courses: cart.map(item => item.course.id)
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

        // Client-side validation
        if (data.payment_gateway === 'Bkash' && !/^[A-Z0-9]{10,}$/i.test(data.bkash_trxId)) {
            toast.error("Please enter a valid 10+ character Bkash Transaction ID");
            return;
        }

        post(route('checkout.store'), {
            onSuccess: () => toast.success("Order placed successfully!"),
            onError: () => toast.error("Please check your form for errors")
        });
    };

    return (
        <div className="container dark:text-white mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - User Info & Payment */}
                    <div className="md:col-span-2 space-y-6">
                        {/* User Information */}
                        <div className="rounded-lg shadow p-6 dark:bg-gray-800">
                            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.customer_email}
                                        readOnly
                                        className="bg-gray-100 dark:bg-gray-700"
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
                                        className={errors.customer_mobile ? 'border-red-500' : ''}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* ... other fields ... */}
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
                                {errors.customer_address && (
                                    <p className="text-sm text-red-500 mt-1">{errors.customer_address}</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-lg shadow p-6 dark:bg-gray-800">
                            <h2 className="text-lg font-semibold mb-4">Payment Method*</h2>

                            <RadioGroup
                                value={data.payment_gateway}
                                onValueChange={(value) => setData('payment_gateway', value)}
                                className="space-y-3"
                                required
                            >
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
                            </RadioGroup>

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
                                            onChange={(e) => setData('amount_paid', e.target.value)}
                                            required
                                            min={1}
                                            className={errors.amount_paid ? 'border-red-500' : ''}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
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
                                    <input
                                        type="checkbox"
                                        id="agree_terms"
                                        checked={data.agree_terms}
                                        onChange={(e) => setData('agree_terms', e.target.checked)}
                                        className="h-4 w-4"
                                        required
                                    />
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
