// Contact Page with improved layout and styling
'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton as MuiIconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';
import { Theme } from '@mui/material/styles';
import {
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Map as MapIcon,
  Chat as ChatIcon,
  AccessTime as AccessTimeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as AlertColor,
  });

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com' },
    { icon: <TwitterIcon />, url: 'https://twitter.com' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com' },
    { icon: <InstagramIcon />, url: 'https://instagram.com' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setSnackbar({
          open: true,
          message: 'Your message has been sent successfully!',
          severity: 'success',
        });
      }, 1500);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section with Gradient Background */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #1a3d6d 0%, #2f89ff 50%, #0f2d5a 100%)',
          color: 'white',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          minHeight: { xs: '50vh', md: '60vh' },
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255, 192, 58, 0.15) 0%, transparent 70%)',
            top: '-100px',
            right: '-150px',
            borderRadius: '50%',
            zIndex: 0,
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(47, 137, 255, 0.1) 0%, transparent 70%)',
            bottom: '-50px',
            left: '-100px',
            borderRadius: '50%',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: { xs: 3, sm: 4 }, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          <Box sx={{ maxWidth: '800px', mx: 'auto', px: { xs: 0, sm: 2 } }}>
            <Typography variant="h3" component="h1" sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
              Contact Paradise Pay
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'var(--secondary)',
              opacity: 0.9, 
              fontSize: { xs: '1rem', sm: '1.1rem' }, 
              lineHeight: 1.6,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}>
              Have questions about our payment solutions? Our team is here to help you with any inquiries.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box component="section" sx={{ py: { xs: 0, md: 6 }, bgcolor: 'background.paper' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          maxWidth: '1400px',
          mx: 'auto',
          boxShadow: { xs: 'none', md: 3 },
          borderRadius: { xs: 0, md: 2 },
          overflow: 'hidden',
        }}>
          {/* Contact Information - Left Side */}
          <Box
            sx={{
              width: { xs: '100%', md: '40%' },
              p: { xs: 6, md: 8 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'background.paper',
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.95) 0%, rgba(33, 150, 243, 0.95) 100%)',
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '600px', mx: 'auto', width: '100%' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4, color: 'white' }}>
                Contact Information
              </Typography>
              <Typography variant="body1" paragraph sx={{ opacity: 0.9, mb: 4, color: 'rgba(255,255,255,0.9)' }}>
                We&apos;re here to help with any questions about our payment solutions. Reach out to us through any of these channels.
              </Typography>

              {/* Address */}
              <Box sx={{ display: 'flex', mb: 4, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 192, 58, 0.2)',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffc03a',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 192, 58, 0.3)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <LocationIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Our Office</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    123 Payment Plaza<br />
                    Financial District, NY 10005<br />
                    United States
                  </Typography>
                  <Button
                    startIcon={<MapIcon />}
                    variant="text"
                    href="https://maps.google.com"
                    target="_blank"
                    sx={{ color: 'background.paper', mt: 1 }}
                  >
                    View on map
                  </Button>
                </Box>
              </Box>

              {/* Email */}
              <Box sx={{ display: 'flex', mb: 4, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 192, 58, 0.2)',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffc03a',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 192, 58, 0.3)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <EmailIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Email Us</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>We&apos;ll respond as soon as possible</Typography>
                  <Button
                    href="mailto:info@paradisepay.com"
                    startIcon={<EmailIcon />}
                    variant="text"
                    sx={{ color: 'background.paper', justifyContent: 'flex-start' }}
                  >
                    info@paradisepay.com
                  </Button>
                  <br />
                  <Button
                    href="mailto:support@paradisepay.com"
                    startIcon={<EmailIcon />}
                    variant="text"
                    sx={{ color: 'background.paper', justifyContent: 'flex-start' }}
                  >
                    support@paradisepay.com
                  </Button>
                </Box>
              </Box>

              {/* Phone */}
              <Box sx={{ display: 'flex', mb: 4, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 192, 58, 0.2)',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffc03a',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 192, 58, 0.3)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <PhoneIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Call Us</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Available during business hours</Typography>
                  <Button
                    href="tel:+18885551234"
                    startIcon={<PhoneIcon />}
                    variant="text"
                    sx={{ color: 'white' }}
                  >
                    +1 (888) 555-1234
                  </Button>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
                    Mon - Fri, 9:00 AM - 6:00 PM EST
                  </Typography>
                </Box>
              </Box>

              {/* Social Links */}
              <Box sx={{ mt: 6 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {socialLinks.map((social, index) => (
                    <MuiIconButton
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'background.paper',
                        bgcolor: 'action.selected',
                        '&:hover': {
                          bgcolor: 'rgba(255, 192, 58, 0.3)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {social.icon}
                    </MuiIconButton>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Contact Form - Right Side */}
          <Box
            sx={{
              width: { xs: '100%', md: '60%' },
              p: { xs: 6, md: 8 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.9)',
              boxShadow: 3,
              position: 'relative',
              color: 'white',
              border: '2px solid',
              borderColor: '#ffc03a',
              '&:hover': {
                boxShadow: '0 0 15px #ffc03a',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '600px', mx: 'auto', width: '100%' }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  mb: 4, 
                  textAlign: 'center',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    display: 'block',
                    width: '60px',
                    height: '4px',
                    background: '#ffc03a',
                    margin: '12px auto 0',
                    borderRadius: '2px'
                  }
                }}
              >
                Send us a Message
              </Typography>
              <Typography color="white" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </Typography>

              {isSuccess ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
                  <Typography variant="h5" gutterBottom>
                    Message Sent Successfully!
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setIsSuccess(false)}
                    startIcon={<ChatIcon />}
                    sx={{ mt: 2 }}
                  >
                    Send another message
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'white',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: 'white',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: 'white',
                          },
                          '& .MuiFormHelperText-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.23)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: (theme: Theme) => theme.palette.primary.main,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: (theme: Theme) => theme.palette.primary.main,
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: 'white',
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'white',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: 'white',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: 'white',
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        multiline
                        rows={6}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.23)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: (theme: Theme) => theme.palette.primary.main,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: (theme: Theme) => theme.palette.primary.main,
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: 'white',
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? null : <ChatIcon />}
                        sx={{
                          bgcolor: 'primary.main',
                          mt: 2,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'translateY(-2px)',
                            boxShadow: 3,
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'rgba(255, 192, 58, 0.1)',
                  borderRadius: 1,
                  borderLeft: '4px solid',
                  borderColor: '#ffc03a',
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 192, 58, 0.2)',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'rgba(255, 192, 58, 0.4)',
                  }}
                >
                  <AccessTimeIcon sx={{ mr: 1, color: '#ffc03a' }} />
                  <Typography variant="body2" color="#ffc03a">
                    Response time: Usually within 24 hours
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Map Section - Now constrained to same max width and centered */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.default' }}>
        <Box
          sx={{
            maxWidth: '1400px',
            mx: 'auto',
            px: { xs: 3, md: 4 },
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            position: 'relative',
            height: { xs: '50vh', md: '70vh' },
          }}
        >
          <Box
            component="iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209057621!2d-73.98784492400694!3d40.74844047139064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus"
            title="Our Location - Paradise Pay Office"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
              filter: 'grayscale(20%)',
              transition: 'filter 0.3s ease',
              '&:hover': {
                filter: 'grayscale(0%)',
              },
            }}
          />
        </Box>
      </Box>

      {/* FAQ Section */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 3, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 8, maxWidth: '800px', mx: 'auto' }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: '60px',
                  height: '4px',
                  background: '#ffc03a',
                  margin: '12px auto 0',
                  borderRadius: '2px'
                }
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: '48rem', mx: 'auto', opacity: 0.9 }}>
              Can&apos;t find what you&apos;re looking for? Check out our FAQ or contact our support team.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            {[
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, bank transfers, and various digital payment methods including PayPal and Apple Pay.',
              },
              {
                question: 'How secure is my payment information?',
                answer: 'Your payment information is encrypted and processed through PCI-compliant systems. We never store your full card details on our servers.',
              },
              {
                question: 'How long do refunds take to process?',
                answer: 'Refunds typically take 5-10 business days to appear in your account, depending on your bank or card issuer.',
              },
              {
                question: 'Do you offer international payments?',
                answer: 'Yes, we support payments in multiple currencies and can process transactions to most countries worldwide.',
              },
              {
                question: 'What are your customer support hours?',
                answer: 'Our customer support team is available 24/7 via email and live chat. Phone support is available Monday to Friday, 9 AM to 6 PM EST.',
              },
              {
                question: 'How do I update my billing information?',
                answer: 'You can update your billing information by logging into your account and navigating to the Billing section in your profile settings.',
              },
            ].map((faq, index) => (
              <Box 
                key={index} 
                sx={{ 
                  width: { xs: '100%', sm: 'calc(50% - 24px)', lg: 'calc(33.333% - 24px)' },
                  minWidth: '300px',
                  maxWidth: '400px',
                  flex: '1 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    borderWidth: '1.5px',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                      borderColor: '#ffc03a',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        mb: 2,
                        minHeight: '3.5em',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          bottom: -8,
                          width: '40px',
                          height: '2px',
                          background: '#ffc03a',
                        }
                      }}
                    >
                      {faq.question}
                    </Typography>
                    <Typography 
                      color="text.secondary" 
                      sx={{ 
                        lineHeight: 1.6,
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                        textAlign: 'left',
                        '& p': { 
                          margin: 0,
                          padding: 0,
                        }
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
