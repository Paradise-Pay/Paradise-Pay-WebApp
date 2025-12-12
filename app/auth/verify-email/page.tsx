'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Typography, Box, Container, Paper, Link as MuiLink, CircularProgress } from '@mui/material';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authService } from '@/lib/api/auth';

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('Invalid or missing verification token');
      setIsVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setVerificationStatus('success');
        toast.success('Email verified successfully!', {
          position: 'top-center',
          autoClose: 5000,
        });
      } catch (error) {
        setVerificationStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to verify email. The link may have expired or is invalid.'
        );
        toast.error('Failed to verify email', {
          position: 'top-center',
          autoClose: 5000,
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <Container component="main" maxWidth="sm">
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
          <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Email Verification
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          {isVerifying ? (
            <Box sx={{ py: 4 }}>
              <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
              <Typography>Verifying your email address...</Typography>
            </Box>
          ) : verificationStatus === 'success' ? (
            <Box sx={{ py: 4 }}>
              <Typography color="primary" sx={{ fontSize: '4rem', lineHeight: 1, mb: 2 }}>✓</Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>Email Verified Successfully!</Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Thank you for verifying your email address. Your account is now active.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/auth/login')}
                sx={{ mt: 2 }}
              >
                Continue to Login
              </Button>
            </Box>
          ) : (
            <Box sx={{ py: 4 }}>
              <Typography color="error" sx={{ fontSize: '4rem', lineHeight: 1, mb: 2 }}>✗</Typography>
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>Verification Failed</Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                {errorMessage || 'An error occurred while verifying your email address.'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Button
                  variant="contained"
                  onClick={() => router.push('/auth/login')}
                >
                  Back to Login
                </Button>
              </Box>
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  Need help?{' '}
                  <MuiLink component={Link} href="/contact" color="primary">
                    Contact Support
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
