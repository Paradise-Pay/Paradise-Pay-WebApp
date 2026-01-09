'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, CardMedia, Typography, Button, Skeleton, Alert,
  Chip, Grid, Divider, Container, Paper, Stack, List, ListItem, ListItemText
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, LocationOn as LocationIcon, Person as PersonIcon,
  AttachMoney as AttachMoneyIcon, Share as ShareIcon, Label as TagIcon 
} from '@mui/icons-material';
import PurchaseTicketDialog from '@/components/sections/dialogs/PurchaseTicketDialog';
import { formatDistanceToNow, format } from 'date-fns';
import { getTicketTypes, getEventById } from '@/lib/api';
import type { TicketTypeResponse } from '@/types/domain/ticket';

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
  tags: string[];
  capacity: number;
  ticketsSold: number;
  availableTickets: number;
  currency: string;
  organizer: { id: string; name: string; };
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [event, setEvent] = useState<UiEvent | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      try {
        setLoading(true);

        // 1. Fetch Event using API
        // ✅ FIX: No more direct fetch
        const response = await getEventById(eventId);
        const data = (response as any).data || response;

        // Parse Tags
        let tags: string[] = [];
        if (Array.isArray(data.tags)) tags = data.tags;
        else if (typeof data.tags === 'string') tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);

        const mappedEvent: UiEvent = {
          id: data.event_id || data.id,
          title: data.title,
          description: data.description || '',
          shortDescription: data.description ? data.description.substring(0, 100) + '...' : '',
          startDate: data.event_date || data.startDate,
          endDate: data.event_end_date || null,
          address: data.venue_name ? `${data.venue_name}, ${data.venue_address}` : data.venue_address || 'TBA',
          city: data.city || '',
          state: data.state || '',
          postalCode: data.postal_code || '',
          coverImage: data.event_image_url || data.event_banner_url || '/assets/images/event-placeholder.jpg',
          status: (data.status || 'published').toLowerCase(),
          type: data.category_id || 'Event',
          tags: tags,
          capacity: data.max_attendees || 0,
          ticketsSold: data.tickets_sold || 0,
          availableTickets: (data.max_attendees || 0) - (data.tickets_sold || 0),
          currency: data.currency || 'GHS',
          organizer: { id: data.organizer_id || 'unknown', name: 'Event Organizer' }
        };
        setEvent(mappedEvent);

        // 2. Fetch Tickets
        try {
          const ticketsRes = await getTicketTypes(eventId);
          const ticketsData = Array.isArray(ticketsRes) ? ticketsRes : (ticketsRes as any).data || [];
          setTicketTypes(ticketsData);
        } catch (err) {
          console.warn("Could not load ticket types", err);
        }

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <Alert severity="error" sx={{ mb: 3 }}>{error || 'Event not found'}</Alert>
        <Button variant="outlined" onClick={() => router.back()}>Go Back</Button>
      </Container>
    );
  }

  const eventDate = new Date(event.startDate);
  const isUpcoming = eventDate > new Date();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card sx={{ mb: 4, overflow: "hidden", borderRadius: 2, boxShadow: 3 }}>
        <CardMedia component="img" height="400" image={event.coverImage} alt={event.title} sx={{ objectFit: "cover" }} />
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }} alignItems="center">
              <Chip label={event.status.toUpperCase()} color={isUpcoming ? "success" : "default"} size="small" sx={{ fontWeight: "bold" }} />
              <Chip label={event.type} variant="outlined" size="small" />
              {/* Tags */}
              {event.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" icon={<TagIcon style={{ fontSize: 14 }} />} sx={{ bgcolor: 'action.hover' }} />
              ))}
            </Stack>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>{event.title}</Typography>
            {event.shortDescription && <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>{event.shortDescription}</Typography>}
          </Box>
          <Paper elevation={0} sx={{ p: 0, mb: 4, bgcolor: "transparent" }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>About this event</Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{event.description}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 24, borderRadius: 2, boxShadow: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                {/* Date & Location (Same as before) */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <CalendarIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Date & Time</Typography>
                    <Typography variant="body2" color="text.secondary">{format(eventDate, "EEEE, MMMM d, yyyy")} • {format(eventDate, "h:mm a")}</Typography>
                    <Typography variant="caption" color="primary" sx={{ display: "block", mt: 0.5 }}>{isUpcoming ? formatDistanceToNow(eventDate, { addSuffix: true }) : "Event Ended"}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <LocationIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Location</Typography>
                    <Typography variant="body2" color="text.secondary">{event.address}</Typography>
                    {(event.city || event.state) && <Typography variant="body2" color="text.secondary">{event.city}{event.city && event.state ? ", " : ""}{event.state}</Typography>}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Organizer</Typography>
                    <Typography variant="body2" color="text.secondary">{event.organizer.name}</Typography>
                  </Box>
                </Box>

                <Divider />

                {/* Ticket Variants List */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AttachMoneyIcon color="primary" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Tickets</Typography>
                  </Box>
                  {ticketTypes.length > 0 ? (
                    <List dense disablePadding>
                      {ticketTypes.map((ticket) => (
                        <ListItem key={ticket.ticket_type_id} disableGutters sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={ticket.name} 
                            secondary={ticket.available_quantity > 0 ? `${ticket.available_quantity} left` : "Sold Out"}
                            secondaryTypographyProps={{ color: ticket.available_quantity > 0 ? 'textSecondary' : 'error', fontSize: '0.75rem' }}
                          />
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {Number(ticket.price) === 0 ? 'Free' : `${event.currency} ${Number(ticket.price).toFixed(2)}`}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>No tickets available yet.</Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Button
                    variant="contained" color="primary" fullWidth size="large"
                    disabled={!isUpcoming || event.availableTickets <= 0}
                    onClick={() => setPurchaseOpen(true)}
                    sx={{ py: 1.5, fontWeight: "bold" }}
                  >
                    {event.availableTickets <= 0 ? "Sold Out" : "Get Tickets"}
                  </Button>
                  <Button variant="outlined" color="inherit" fullWidth startIcon={<ShareIcon />} onClick={() => { if (navigator.share) { navigator.share({ title: event.title, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); } }}>
                    Share Event
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {event && <PurchaseTicketDialog open={purchaseOpen} onClose={() => setPurchaseOpen(false)} eventId={event.id} eventTitle={event.title} />}
    </Container>
  );
}