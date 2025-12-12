'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, TextField, Typography, Box, Container, Paper, Link as MuiLink, Avatar } from '@mui/material';
import { ThemeToggle } from '@/components/ThemeToggle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
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
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#0a0a0a',
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
            height: '450px',
            p: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}
        >
          <Box sx={{ textAlign: 'center', width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 56, 
                  height: 56,
                  '& .MuiSvgIcon-root': {
                    fontSize: '2rem',
                    color: 'white'
                  }
                }}
              >
                <AccountBalanceWalletIcon fontSize="large" />
              </Avatar>
            </Box>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1.5rem' }}>
              Reset Your Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '400px', mx: 'auto' }}>
              Enter the email associated with your account and we'll send you a link to reset your password.
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', maxWidth: '400px', mx: 'auto' }}>
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              variant="outlined"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '1px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  '&.Mui-focused': {
                    color: 'primary.main',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ 
                py: 1.5, 
                mb: 3,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <MuiLink 
                component={Link} 
                href="/auth/login" 
                variant="body2" 
                underline="hover"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <span>←</span> Back to Sign In
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
