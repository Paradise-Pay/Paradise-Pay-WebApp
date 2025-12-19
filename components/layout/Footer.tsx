'use client';

import { Box, Container, Grid, Link as MuiLink, Typography, Divider, IconButton } from '@mui/material';
import Link from 'next/link';
import { Facebook, Instagram, YouTube } from '@mui/icons-material';
import { SiTiktok, SiX } from 'react-icons/si';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number>(2024); // Default year

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme: { palette: { mode: string; grey: { [key: number]: string } } }) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800],
        p: 6,
        mt: 'auto',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontFamily: 'inherit', fontWeight: 700 }}>
              Paradise Pay
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'inherit', fontWeight: 500 }}>
              Your trusted ticketing platform for all events. Fast, secure, and reliable ticket purchasing experience.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <IconButton aria-label="Facebook" component="a" href="https://facebook.com" target="_blank" rel="noopener">
                <Facebook />
              </IconButton>
              <IconButton aria-label="X (Twitter)" component="a" href="https://x.com" target="_blank" rel="noopener">
                <SiX />
              </IconButton>
              <IconButton aria-label="Instagram" component="a" href="https://instagram.com" target="_blank" rel="noopener">
                <Instagram />
              </IconButton>
              <IconButton aria-label="YouTube" component="a" href="https://youtube.com" target="_blank" rel="noopener">
                <YouTube />
              </IconButton>
              <IconButton aria-label="TikTok" component="a" href="https://tiktok.com" target="_blank" rel="noopener">
                <SiTiktok />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
              Company
            </Typography>
            <MuiLink component={Link} href="/about-us" color="inherit" display="block" mb={1}>
              About Us
            </MuiLink>
            <MuiLink component={Link} href="/careers" color="inherit" display="block" mb={1}>
              Careers
            </MuiLink>
            <MuiLink component={Link} href="/blog" color="inherit" display="block" mb={1}>
              Blog
            </MuiLink>
            <MuiLink component={Link} href="/press" color="inherit" display="block" mb={1}>
              Press
            </MuiLink>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
              Support
            </Typography>
            <MuiLink component={Link} href="/contact" color="inherit" display="block" mb={1}>
              Contact Us
            </MuiLink>
            <MuiLink component={Link} href="/help" color="inherit" display="block" mb={1}>
              Help Center
            </MuiLink>
            <MuiLink component={Link} href="/faq" color="inherit" display="block" mb={1}>
              FAQs
            </MuiLink>
            <MuiLink component={Link} href="/privacy" color="inherit" display="block" mb={1}>
              Privacy Policy
            </MuiLink>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
              Subscribe to our newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontFamily: 'inherit', fontWeight: 500 }}>
              Get the latest updates on new events and special offers.
            </Typography>
            <Box component="form" sx={{ display: 'flex', gap: 1 }}>
              <Box
                component="input"
                type="email"
                placeholder="Enter your email"
                sx={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid',
                  borderColor: 'divider',
                  fontSize: '0.875rem',
                  '&:focus': {
                    outline: 'none',
                    borderColor: 'primary.main',
                  }
                }}
              />
              <Box
                component="button"
                type="submit"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Subscribe
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={{ xs: 2, sm: 0 }} sx={{ fontFamily: 'inherit', fontWeight: 500 }}>
            © {currentYear} Paradise Pay. All rights reserved.
          </Typography>
          <Box>
            <MuiLink component={Link} href="/terms" color="text.secondary" variant="body2" mr={2} sx={{ fontWeight: 500 }}>
              Terms of Service
            </MuiLink>
            <MuiLink component={Link} href="/privacy" color="text.secondary" variant="body2" mr={2} sx={{ fontWeight: 500 }}>
              Privacy Policy
            </MuiLink>
            <MuiLink component={Link} href="/cookies" color="text.secondary" variant="body2" sx={{ fontWeight: 500 }}>
              Cookie Policy
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
