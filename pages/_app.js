import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/theme.module.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Head from 'next/head';
import theme from '../lib/theme'; // You should create a theme.js file in your lib directory
import { AuthProvider } from '../context/AuthContext'; // Assuming you have an AuthContext.js for authentication state

// Custom App Component
export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check for user authentication status
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else if (router.pathname !== '/signin' && router.pathname !== '/signup' && router.pathname !== '/forgot_password') {
      // If user is not authenticated, redirect to login
      router.push('/signin');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Prompt Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./prompthub.jpg" /> {/* Add your logo as a favicon */}

      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Provide AuthContext */}
        <AuthProvider value={{ user, setUser }}>
          {/* Conditionally render based on user authentication */}
          {router.pathname === '/signin' || router.pathname === '/signup' || router.pathname === '/forgot_password'  || user ? (
            <Component {...pageProps} />
          ) : (
            <div>Loading...</div>
          )}
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
