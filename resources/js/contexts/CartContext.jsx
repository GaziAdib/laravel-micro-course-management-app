import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children, initialCart = [] }) => {
    const [cart, setCart] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`cart`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(`cart`, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (course) => {

        setCart(prev => {
            const existing = prev.find(item => item.course.id === course.id);
            if (existing) {
                return prev.map(item =>
                    item.course.id === course.id
                        ? {
                            ...item,
                            quantity: Number(item.quantity) + 1
                          }
                        : item
                );
            }
            return [...prev, {
                course: {
                    ...course,
                    price: Number(course.price) || 0
                   // price: course.is_paid === false ? Number(course.price) : 0
                },
                quantity: 1
            }];
        });
    };

    const updateQuantity = (courseId, quantity) => {
        setCart(prev =>
            prev.map(item =>
                item.course.id === courseId
                    ? {
                        ...item,
                        quantity: Math.max(1, Number(quantity))
                      }
                    : item
            )
        );
    };

    const removeFromCart = (courseId) => {
        setCart(prev => prev.filter(item => item.course.id !== courseId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
    const cartTotal = cart.reduce(
        (sum, item) => sum + (Number(item.course.price) * Number(item.quantity)),
        0
    );

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            cartTotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            setCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);






// import { createContext, useContext, useEffect, useState } from 'react';
// import { usePage } from '@inertiajs/react';

// const CartContext = createContext();

// export const CartProvider = ({ children, initialCart = [] }) => {
//      const { auth } = usePage().props;

//     const [cart, setCart] = useState(() => {
//         if (typeof window !== 'undefined') {
//             const saved = localStorage.getItem(`cart_${auth?.user?.id}`);
//             return saved ? JSON.parse(saved) : [];
//         }
//         return [];
//     });

//     useEffect(() => {
//         localStorage.setItem(`cart_${auth?.user?.id}`, JSON.stringify(cart));
//     }, [cart]);

//     const addToCart = (course) => {


//         setCart(prev => {
//             const existing = prev.find(item => item.course.id === course.id);
//             if (existing) {
//                 return prev.map(item =>
//                     item.course.id === course.id
//                         ? {
//                             ...item,
//                             quantity: Number(item.quantity) + 1
//                           }
//                         : item
//                 );
//             }
//             return [...prev, {
//                 course: {
//                     ...course,
//                     price: Number(course.price) || 0
//                    // price: course.is_paid === false ? Number(course.price) : 0
//                 },
//                 quantity: 1
//             }];
//         });
//     };

//     const updateQuantity = (courseId, quantity) => {
//         setCart(prev =>
//             prev.map(item =>
//                 item.course.id === courseId
//                     ? {
//                         ...item,
//                         quantity: Math.max(1, Number(quantity))
//                       }
//                     : item
//             )
//         );
//     };

//     const removeFromCart = (courseId) => {
//         setCart(prev => prev.filter(item => item.course.id !== courseId));
//     };

//     const clearCart = () => {
//         setCart([]);
//     };

//     const cartCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
//     const cartTotal = cart.reduce(
//         (sum, item) => sum + (Number(item.course.price) * Number(item.quantity)),
//         0
//     );

//     return (
//         <CartContext.Provider value={{
//             cart,
//             cartCount,
//             cartTotal,
//             addToCart,
//             removeFromCart,
//             updateQuantity,
//             clearCart,
//             setCart
//         }}>
//             {children}
//         </CartContext.Provider>
//     );
// };

// export const useCart = () => useContext(CartContext);















// import { createContext, useContext, useEffect, useState } from 'react';

// const CartContext = createContext();


// export const CartProvider = ({ children, initialCart = [] }) => {

//     const [cart, setCart] = useState(() => {
//         // Try to load from localStorage, fallback to initialCart from server
//         if (typeof window !== 'undefined') {
//             const saved = localStorage.getItem('cart');
//             return saved ? JSON.parse(saved) : []
//         }
//         return []
//     });

//     useEffect(() => {
//         localStorage.setItem('cart', JSON.stringify(cart))
//     }, [cart])

//     const addToCart = (course) => {
//         setCart(prev => {
//             const existing = prev.find(item => item.course.id === course.id)
//             if (existing) {
//                 return prev.map(item =>
//                     item.id === course.id
//                         ? { ...item, quantity: item.course.quantity + 1 }
//                         : item
//                 )
//             }
//             return [...prev, { course, quantity: 1 }]
//         })
//     }

//     const removeFromCart = (courseId) => {
//         setCart(prevCart => prevCart.filter(item => item.course.id !== courseId));
//     };

//     const clearCart = () => {
//         setCart([]);
//     };

//     const cartCount = cart.reduce((sum, item) => sum + Number(item.course.quantity), 0);
//     const cartTotal = cart.reduce((sum, item) => sum + (Number(item.course.price) * Number(item.course.quantity)), 0);


//     return (
//         <CartContext.Provider value={{
//             cart,
//             cartCount,
//             cartTotal,
//             addToCart,
//             removeFromCart,
//             clearCart,
//             setCart
//         }}>
//             {children}

//         </CartContext.Provider>
//     )
// }


// export const useCart = () => useContext(CartContext)
