'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
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
} from '@mui/material';
import {
  Calendar,
  LocationOn,
  Person,
  AttachMoney,
  Share as ShareIcon,
} from '@mui/icons-material';
import { Event } from '@/types/domain/event';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';

interface EventDetailResponse {
  success: boolean;
  data: Event;
  message: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }

        const data: EventDetailResponse = await response.json();
        if (data.success) {
          setEvent(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} />
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Event not found'}
        </Alert>
        <Button
          onClick={() => router.back()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const eventDate = new Date(event.startDate);
  const isUpcoming = eventDate > new Date();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cover Image */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="400"
          image={event.coverImage || '/assets/images/event-placeholder.jpg'}
          alt={event.title}
        />
      </Card>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Event Title and Status */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }} alignItems="center">
              <Chip
                label={event.status}
                color={isUpcoming ? 'success' : 'default'}
                size="small"
              />
              <Chip
                label={event.type}
                variant="outlined"
                size="small"
              />
            </Stack>
            <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
              {event.title}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              {event.shortDescription}
            </Typography>
          </Box>

          {/* Description */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              About this event
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              {event.description}
            </Typography>
          </Paper>

          {/* Event Details */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Event Details
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Calendar color="primary" />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Start Date
                  </Typography>
                  <Typography variant="body2">
                    {format(eventDate, 'PPP p')}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn color="primary" />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {event.address}, {event.city}, {event.state} {event.postalCode}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Person color="primary" />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Organizer
                  </Typography>
                  <Typography variant="body2">
                    {event.organizer.name}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AttachMoney color="primary" />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Price
                  </Typography>
                  <Typography variant="body2">
                    {event.isFree
                      ? 'Free'
                      : `${event.currency} ${event.price}`}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {event.availableTickets} tickets available
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Capacity: {event.capacity}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Event starts
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {isUpcoming
                      ? formatDistanceToNow(eventDate, { addSuffix: true })
                      : 'Event has passed'}
                  </Typography>
                </Box>

                <Divider />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={!isUpcoming || event.availableTickets === 0}
                  onClick={() => router.push(`/dashboard/tickets/buy/${eventId}`)}
                >
                  {event.availableTickets === 0
                    ? 'Sold Out'
                    : 'Get Tickets'}
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: event.shortDescription,
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  Share
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
