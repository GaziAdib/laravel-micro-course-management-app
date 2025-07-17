import { useCart } from '@/contexts/CartContext';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define props interface
interface NavbarProps {
    auth: {
        user: {
            email: string;
            name: string;
        } | null;
    };
}


export default function Navbar({ auth}: NavbarProps) {

    const { cartCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const user = auth?.user;


    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <span className="text-primary">Edu</span>Platform
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/user/courses"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Courses
                    </Link>

                    <Button asChild variant="ghost" className="relative px-3">
                        <Link href="/user/carts">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="8" cy="21" r="1" />
                                <circle cx="19" cy="21" r="1" />
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                            </svg>
                            <Badge
                                variant="destructive"
                                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                            >
                                {cartCount}
                            </Badge>
                        </Link>
                    </Button>
                </nav>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="absolute inset-x-0 top-16 bg-background shadow-lg md:hidden">
                        <div className="container px-4 py-3 space-y-4">
                            <Link
                                href="/user/courses"
                                className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Courses
                            </Link>

                            <Button
                                asChild
                                variant="ghost"
                                className="relative w-full justify-start px-0"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Link href="/cart" className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="8" cy="21" r="1" />
                                        <circle cx="19" cy="21" r="1" />
                                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                                    </svg>
                                    <span>Shopping Cart</span>
                                    <Badge
                                        variant="destructive"
                                        className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                    >
                                        {cartCount}
                                    </Badge>
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}












// import { useCart } from '@/contexts/CartContext';
// import { Link } from '@inertiajs/react';

// export default function Navbar() {

//     const {cartCount} = useCart();

//     return (
//         <header className="sticky ml-4 top-0 z-50 w-1/3 md:w-full lg:w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//             <div className="container flex h-14 items-center justify-between">
//                 <Link href="/" className="font-bold">
//                     Your Logo
//                 </Link>
//                 <nav className="flex items-center gap-4">
//                     <Link href="/user/courses">Courses</Link>
//                     {/* <CartCounter /> */}
//                     <Link href="#">Carts ({cartCount})</Link>
//                 </nav>
//             </div>
//         </header>
//     );
// }
