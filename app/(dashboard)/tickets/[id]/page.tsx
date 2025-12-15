'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Skeleton,
  Alert,
  Chip,
  Grid,
  Divider,
  Container,
  Paper,
  Stack,
  QRCode,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Ticket } from '@/types/domain/ticket';
import { format } from 'date-fns';

interface TicketDetailResponse {
  success: boolean;
  data: Ticket;
  message: string;
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch ticket');
        }

        const data: TicketDetailResponse = await response.json();
        if (data.success) {
          setTicket(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const handleDownload = () => {
    // Implementation for PDF download
    const element = document.getElementById('ticket-card');
    if (element) {
      const canvas = document.createElement('canvas');
      // Implement HTML to canvas/PDF conversion
      console.log('Download functionality to be implemented');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Event Ticket',
        text: `Check out my ticket for ${ticket?.event.title}`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={500} />
      </Container>
    );
  }

  if (error || !ticket) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Ticket not found'}</Alert>
      </Container>
    );
  }

  const statusColor = {
    active: 'success',
    used: 'default',
    cancelled: 'error',
    refunded: 'warning',
    expired: 'default',
  }[ticket.status] as any;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box id="ticket-card">
        {/* Ticket Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ bgcolor: 'primary.main', color: 'white', pb: 0 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {ticket.event.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              {ticket.ticketType.name}
            </Typography>
          </CardContent>
        </Card>

        {/* Main Ticket Details */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Status */}
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip
                      label={ticket.status.toUpperCase()}
                      color={statusColor}
                      icon={
                        ticket.status === 'active' ? <CheckCircleIcon /> : undefined
                      }
                    />
                  </Box>
                </Box>

                <Divider />

                {/* Ticket Number */}
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Ticket Number
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', mt: 1 }}>
                    {ticket.id}
                  </Typography>
                </Box>

                <Divider />

                {/* Event Details */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Event Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Date
                      </Typography>
                      <Typography variant="body2">
                        {format(new Date(ticket.event.startDate), 'PPP p')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Location
                      </Typography>
                      <Typography variant="body2">
                        {ticket.event.location}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Attendee Information */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Attendee
                  </Typography>
                  <Typography variant="body2">
                    {ticket.user.firstName} {ticket.user.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ticket.user.email}
                  </Typography>
                </Box>

                <Divider />

                {/* Price Details */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Price Details
                  </Typography>
                  <Typography variant="body2">
                    Price: {ticket.currency} {ticket.price}
                  </Typography>
                </Box>

                {/* Check-in Status */}
                {ticket.checkedIn && (
                  <>
                    <Divider />
                    <Alert severity="success">
                      Ticket checked in on{' '}
                      {format(new Date(ticket.checkedInAt!), 'PPP p')}
                    </Alert>
                  </>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* QR Code Sidebar */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Scan to Verify
                </Typography>

                {/* QR Code Placeholder */}
                <Box
                  sx={{
                    bgcolor: '#f5f5f5',
                    p: 2,
                    borderRadius: 1,
                    mb: 3,
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #ddd',
                  }}
                >
                  <Box
                    component="img"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.qrCode}`}
                    alt="QR Code"
                    sx={{ maxWidth: '100%' }}
                  />
                </Box>

                <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                  {ticket.qrCode}
                </Typography>

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                  >
                    Download Ticket
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                  >
                    Share
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
