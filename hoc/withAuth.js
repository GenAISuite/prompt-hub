// hoc/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const storedUser = JSON.parse(localStorage.getItem('user'))|| null;
    useEffect(() => {
      if (!storedUser) {
        router.push('/signin'); // Redirect to login if not authenticated
      }
    }, [storedUser, router]);

    return storedUser ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
