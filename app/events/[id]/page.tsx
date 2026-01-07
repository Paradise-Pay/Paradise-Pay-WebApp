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
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Share as ShareIcon 
} from '@mui/icons-material';

import { formatDistanceToNow, format } from 'date-fns';

interface UiEvent {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string | null;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  coverImage: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  type: string;
  capacity: number;
  ticketsSold: number;
  availableTickets: number;
  price: number;
  isFree: boolean;
  currency: string;
  organizer: {
    id: string;
    name: string;
  };
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();

  // Handle case where id might be array
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [event, setEvent] = useState<UiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

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
          if (response.status === 404) throw new Error('Event not found');
          throw new Error('Failed to fetch event details');
        }

        const rawData = await response.json();
        const data = rawData.data || rawData; // Handle wrapped vs unwrapped responses

        const mappedEvent: UiEvent = {
          id: data.event_id || data.id,
          title: data.title,
          description: data.description || '',
          shortDescription: data.description ? data.description.substring(0, 100) + '...' : '',
          
          startDate: data.event_date || data.startDate,
          endDate: data.event_end_date || null,
          
          // Combine venue info for address display
          address: data.venue_name ? `${data.venue_name}, ${data.venue_address}` : data.venue_address || 'TBA',
          city: data.city || '',
          state: data.state || '',
          postalCode: data.postal_code || '',
          
          // Handle Images
          coverImage: data.event_image_url || data.event_banner_url || '/assets/images/event-placeholder.jpg',
          
          status: (data.status || 'published').toLowerCase(),
          type: data.category_id || 'Event', // Using category as type for now
          
          // Numbers
          capacity: data.max_attendees || 0,
          ticketsSold: data.tickets_sold || 0,
          availableTickets: (data.max_attendees || 0) - (data.tickets_sold || 0),
          
          price: parseFloat(data.ticket_price || 0),
          isFree: parseFloat(data.ticket_price || 0) === 0,
          currency: data.currency || 'GHS',
          
          // Handle Organizer (Backend usually sends just ID string, not object)
          organizer: {
            id: typeof data.organizer_id === 'string' ? data.organizer_id : 'unknown',
            name: 'Event Organizer', // Fallback since DB probably doesn't join user table yet
          }
        };

        setEvent(mappedEvent);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 3, borderRadius: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
             <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
             <Skeleton variant="text" height={30} width="60%" sx={{ mb: 4 }} />
             <Skeleton variant="rectangular" height={200} />
          </Grid>
          <Grid item xs={12} md={4}>
             <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Event not found'}
        </Alert>
        <Button variant="outlined" onClick={() => router.back()}>
          Go Back to Events
        </Button>
      </Container>
    );
  }

  const eventDate = new Date(event.startDate);
  const isUpcoming = eventDate > new Date();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cover Image */}
      <Card sx={{ mb: 4, overflow: "hidden", borderRadius: 2, boxShadow: 3 }}>
        <CardMedia
          component="img"
          height="400"
          image={event.coverImage}
          alt={event.title}
          sx={{ objectFit: "cover" }}
        />
      </Card>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2 }}
              alignItems="center"
            >
              <Chip
                label={event.status.toUpperCase()}
                color={isUpcoming ? "success" : "default"}
                size="small"
                sx={{ fontWeight: "bold" }}
              />
              <Chip
                label={event.type} // Displays category name or ID
                variant="outlined"
                size="small"
              />
            </Stack>

            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              {event.title}
            </Typography>

            {event.shortDescription && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 400 }}
              >
                {event.shortDescription}
              </Typography>
            )}
          </Box>

          {/* Description Body */}
          <Paper elevation={0} sx={{ p: 0, mb: 4, bgcolor: "transparent" }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              About this event
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}
            >
              {event.description}
            </Typography>
          </Paper>
        </Grid>

        {/* Sidebar Info Panel */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{ position: "sticky", top: 24, borderRadius: 2, boxShadow: 4 }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Event Metadata List */}
              <Stack spacing={2.5}>
                {/* Date */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <CalendarIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Date & Time
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(eventDate, "EEEE, MMMM d, yyyy")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(eventDate, "h:mm a")}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {isUpcoming
                        ? formatDistanceToNow(eventDate, { addSuffix: true })
                        : "Event Ended"}
                    </Typography>
                  </Box>
                </Box>

                {/* Location */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <LocationIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.address}
                    </Typography>
                    {(event.city || event.state) && (
                      <Typography variant="body2" color="text.secondary">
                        {event.city}
                        {event.city && event.state ? ", " : ""}
                        {event.state}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Organizer */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Organizer
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.organizer.name}
                    </Typography>
                  </Box>
                </Box>

                {/* Price */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <AttachMoneyIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Ticket Price
                    </Typography>
                    <Typography
                      variant="body1"
                      color="success.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      {event.isFree
                        ? "Free"
                        : `${event.currency} ${event.price.toFixed(2)}`}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Action Buttons */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={!isUpcoming || event.availableTickets <= 0}
                    onClick={() =>
                      router.push(`/dashboard/tickets/buy/${eventId}`)
                    }
                    sx={{ py: 1.5, fontWeight: "bold" }}
                  >
                    {event.availableTickets <= 0 ? "Sold Out" : "Get Tickets"}
                  </Button>

                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    startIcon={<ShareIcon />}
                    onClick={() => {
                      // Modern browser sharing
                      if (navigator.share) {
                        navigator.share({
                          title: event.title,
                          url: window.location.href,
                        });
                      } else {
                        // Fallback: Copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                  >
                    Share Event
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}