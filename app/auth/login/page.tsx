"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { Button, TextField, Typography, Box, Link as MuiLink, Container, Paper, InputAdornment, IconButton, Divider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for success messages in URL parameters
  useEffect(() => {
    const message = searchParams.get('message');
    const status = searchParams.get('status');
    
    if (message && status) {
      const toastMethod = status === 'success' ? toast.success : toast.error;
      toastMethod(message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Clean up the URL
      window.history.replaceState({}, '', '/auth/login');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      
      toast.success('Login successful', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Redirect to dashboard or intended page
      router.push('/dashboard');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#ffc03a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>
      
      <Container maxWidth="xs">
        <Paper 
          elevation={3} 
          sx={{ 
            width: '552px',
            minHeight: '678.267px',
            p: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
            <Image
              src="/logos/Paradise Pay_Logo.png"
              alt="Paradise Pay Logo"
              width={180}
              height={60}
              style={{ margin: '0 auto 16px' }}
              priority
            />
            <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Sign in to your account
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              variant="outlined"
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 2 }}>
              <MuiLink
                component={Link}
                href="/auth/forgot-password"
                variant="body2"
                underline="hover"
              >
                Forgot password?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <Image
                  src="/google-icon.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  style={{ marginRight: 8 }}
                />
              }
              onClick={() => {
                toast.info('Google login will be implemented soon', {
                  position: 'top-center',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
              }}
              sx={{ mb: 2 }}
            >
              Continue with Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <MuiLink
                  component={Link}
                  href="/auth/signup"
                  underline="hover"
                  fontWeight="medium"
                >
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
