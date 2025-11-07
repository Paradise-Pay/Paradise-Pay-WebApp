'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '@/context/AuthProvider';
import { authService } from '@/lib/api/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle form submission with validation and API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the signup API directly
      const response = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        nickname: formData.nickname || formData.name.split(' ')[0],
      });

      // Log the user in after successful signup
      if (response.user) {
        await login(formData.email, formData.password);
      }
      
      toast.success('Account created successfully! Please check your email to verify your account.', {
        position: 'top-center',
        autoClose: 5000,
      });
      
      // Redirect to login page with success message
      router.push('/auth/login?status=success&message=Account created successfully! Please check your email to verify your account.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', py: 4 }}>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <ThemeToggle />
        </Box>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Image
            src="/logos/Paradise Pay_Logo.png"
            alt="Paradise Pay"
            width={180}
            height={60}
            style={{ margin: '0 auto 16px' }}
            priority
          />
          <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} href="/auth/login" underline="hover" color="primary.main">
              Sign in
            </MuiLink>
          </Typography>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
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
              size="small"
              sx={{ mb: 2 }}
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
              size="small"
              sx={{ mb: 2 }}
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
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}