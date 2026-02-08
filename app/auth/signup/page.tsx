'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Avatar,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, AccountBalanceWallet as AccountBalanceWalletIcon, Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/api/auth';
import { googleLogin } from '@/lib/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  nickname: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    nickname: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});

  // --- Initialize Google Button ---
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          use_fedcm_for_prompt: false,
          callback: async (response: any) => {
            try {
              setIsLoading(true);
              await googleLogin(response.credential);
              toast.success("Account created via Google!", { position: "top-center" });
              router.push('/dashboard');
            } catch (error) {
              toast.error("Google signup failed", { position: "top-center" });
            } finally {
              setIsLoading(false);
            }
          }
        });
      } catch (e) {
        console.error("Google SDK init error", e);
      }
    }
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    
    try {
      await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        nickname: formData.nickname || formData.name.split(' ')[0],
      });

      await login(formData.email, formData.password);
      
      toast.success('Account created successfully! Please check your email.', {
        position: 'top-center',
        autoClose: 5000,
      });
      
      router.push('/auth/login?status=success&message=Account created successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      toast.error(errorMessage, { position: 'top-center', autoClose: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: {xs:'110vh', sm: '110vh', md: '175vh'},
        width: '100%',
        bgcolor: '#2f89ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        position: "relative", 
        backgroundImage: "url('/assets/images/sign-up-page-bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "black", opacity: 0.5, zIndex: 0 }} />
      
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            width: '100%',
            p: { xs: 4, sm: 4}, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center', width: '100%' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mx: "auto", mb: 2, width: 56, height: 56 }}>
              <AccountBalanceWalletIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
              Create Your Account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password || 'At least 8 characters'}
              variant="outlined"
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              variant="outlined"
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
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>

            <Divider sx={{ my: 2 }}>OR</Divider>

            {/* Google Sign Up Button */}
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<GoogleIcon />}
              sx={{ mb: 2, py: 1 }}
              onClick={() => {
                if ((window as any).google) {
                  (window as any).google.accounts.id.prompt();
                } else {
                  toast.error("Google SDK not loaded");
                }
              }}
            >
              Sign up with Google
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <MuiLink component={Link} href="/auth/login" underline="hover" sx={{ fontWeight: 600 }}>
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}