'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, TextField, Typography, Box, Container, Paper, Link as MuiLink } from '@mui/material';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authService } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.forgotPassword(email);
      
      toast.success('Password reset link sent to your email', {
        position: 'top-center',
        autoClose: 5000,
      });
      
      // Redirect to login with success message
      router.push('/auth/login?status=success&message=Password reset link sent to your email');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset link';
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your email and we'll send you a link to reset your password
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ py: 1.5, mb: 2 }}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink component={Link} href="/auth/login" variant="body2" underline="hover">
                Back to Sign In
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
