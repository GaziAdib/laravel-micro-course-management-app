// import { useEffect } from 'react';
// import { usePage } from '@inertiajs/react';
// import { useRouter } from '@inertiajs/react';

// export default function AuthGuard({ children }) {
//   const { auth } = usePage().props;
//   const router = useRouter();

//   useEffect(() => {
//     if (!auth.user) {
//       router.visit('/login');
//     }
//   }, [auth?.user]);

//   return auth?.user ? children : null;
// }
