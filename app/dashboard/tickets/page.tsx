'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Skeleton,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon, 
  Event as EventIcon, 
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { getUserTickets } from '@/lib/api';
import type { UserTicketResponse } from '@/types/domain/ticket';
import { toast } from 'react-toastify';

// UI Interface (Keep this as is)
interface Ticket {
  id: string;
  ticketNumber: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketType: string;
  price: number;
  purchaseDate: string;
  status: 'upcoming' | 'past' | 'cancelled';
  qrCode: string;
  imageUrl: string;
}

// ... [Keep TicketDetailsDialog Component exactly the same] ...
const TicketDetailsDialog = ({ open, onClose, ticket }: { open: boolean; onClose: () => void; ticket: Ticket | null; }) => {
  if (!ticket) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box component="img" src={ticket.imageUrl} alt={ticket.eventName} sx={{ width: '100%', height: 140, objectFit: 'cover' }} />
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}><CloseIcon /></IconButton>
      </Box>
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>{ticket.eventName}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" my={2}>
          <Chip label={ticket.ticketType} color="primary" variant="outlined" size="small" sx={{ mt: 1 }} />
        </Box>
        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
        <Stack spacing={2}>
          <Box display="flex" alignItems="start"><CalendarIcon fontSize="small" color="action" sx={{ mr: 2, mt: 0.5 }} /><Box><Typography variant="body2" color="text.secondary">Date & Time</Typography><Typography variant="body1" fontWeight="medium">{format(new Date(ticket.eventDate), 'EEE, MMM d, yyyy • h:mm a')}</Typography></Box></Box>
          <Box display="flex" alignItems="start"><LocationIcon fontSize="small" color="action" sx={{ mr: 2, mt: 0.5 }} /><Box><Typography variant="body2" color="text.secondary">Location</Typography><Typography variant="body1" fontWeight="medium">{ticket.eventLocation}</Typography></Box></Box>
          <Box display="flex" alignItems="start"><TicketIcon fontSize="small" color="action" sx={{ mr: 2, mt: 0.5 }} /><Box><Typography variant="body2" color="text.secondary">Price</Typography><Typography variant="body1" fontWeight="medium">GH₵{ticket.price.toFixed(2)}</Typography></Box></Box>
        </Stack>
        <Box mt={3}><Button variant="contained" fullWidth onClick={onClose}>Close Ticket</Button></Box>
      </DialogContent>
    </Dialog>
  );
};

// ... [Keep TicketCard Component exactly the same] ...
const TicketCard = ({ ticket, onViewClick }: { ticket: Ticket; onViewClick: (t: Ticket) => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const statusColor = { upcoming: 'primary', past: 'default', cancelled: 'error' } as const;

  return (
    <Card sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', mb: 3 }}>
      <CardMedia component="img" sx={{ width: isMobile ? '100%' : 200, height: isMobile ? 160 : 'auto', objectFit: 'cover' }} image={ticket.imageUrl} alt={ticket.eventName} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', position: 'relative' }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography component="div" variant="h6">{ticket.eventName}</Typography>
              <Chip label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)} size="small" color={statusColor[ticket.status] || 'default'} sx={{ mt: 0.5, mb: 1 }} />
            </Box>
            <IconButton onClick={handleClick}><MoreVertIcon /></IconButton>
          </Box>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={handleClose}><ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon><ListItemText>Download Ticket</ListItemText></MenuItem>
          </Menu>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" mb={1}><CalendarIcon color="action" fontSize="small" sx={{ mr: 1 }} /><Typography variant="body2" color="text.secondary">{format(new Date(ticket.eventDate), 'EEE, MMM d, yyyy • h:mm a')}</Typography></Box>
              <Box display="flex" alignItems="center" mb={1}><LocationIcon color="action" fontSize="small" sx={{ mr: 1 }} /><Typography variant="body2" color="text.secondary" noWrap>{ticket.eventLocation}</Typography></Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom><strong>Ticket Type:</strong> {ticket.ticketType}</Typography>
              <Typography variant="body2" color="text.secondary"><strong>Number:</strong> {ticket.ticketNumber}</Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Box sx={{ display: 'flex', p: 2, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">GH₵{ticket.price.toFixed(2)}</Typography>
          <Box><Button variant="contained" size="small" onClick={() => onViewClick(ticket)}>View Ticket</Button></Box>
        </Box>
      </Box>
    </Card>
  );
};

export default function MyTicketsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]); 
  const { user } = useAuth();
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        
        const response = await getUserTickets();
        
        // Handle if response is wrapped or raw array
        const apiTickets = Array.isArray(response) ? response : (response as any).data || [];
        
        const mappedTickets: Ticket[] = apiTickets.map((t: UserTicketResponse) => {
          let status: 'upcoming' | 'past' | 'cancelled' = 'upcoming';
          
          if (t.status === 'cancelled' || t.status === 'refunded') {
             status = 'cancelled';
          } else if (t.event_date && new Date(t.event_date) < new Date()) {
             status = 'past';
          }

          return {
            id: t.ticket_id, // Map ticket_id
            ticketNumber: t.ticket_number,
            eventId: t.event_id,
            eventName: t.event_title, // Map event_title
            eventDate: t.event_date || new Date().toISOString(),
            eventLocation: t.venue_name || t.city || 'Online', // Map venue_name
            ticketType: t.ticket_type_name, // Map ticket_type_name
            price: Number(t.ticket_price), // Map ticket_price
            purchaseDate: t.created_at, // Use created_at as purchase date
            status: status,
            qrCode: t.ticket_number,
            imageUrl: t.event_image_url || '/assets/images/event-placeholder.jpg'
          };
        });

        setTickets(mappedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Failed to load tickets'); 
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTickets();
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const filteredTickets = tickets.filter(ticket => {
    if (tabValue === 0) return ticket.status === 'upcoming';
    if (tabValue === 1) return ticket.status === 'past';
    if (tabValue === 2) return ticket.status === 'cancelled';
    return true;
  });

  const tabLabels = ['Upcoming', 'Past', 'Cancelled'];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">My Tickets</Typography>
        <Button variant="outlined" startIcon={<FilterListIcon />}>Filter</Button>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3 }}
      >
        {tabLabels.map((label, index) => {
             const count = index === 0 ? tickets.filter(t => t.status === 'upcoming').length : 
                           index === 1 ? tickets.filter(t => t.status === 'past').length : 
                           tickets.filter(t => t.status === 'cancelled').length;
             return <Tab key={index} label={`${label} (${count})`} />;
        })}
      </Tabs>

      {loading ? (
        <Box>
          {[1, 2].map((item) => (
            <Card key={item} sx={{ display: 'flex', mb: 3 }}>
              <Skeleton variant="rectangular" width={200} height={160} />
              <Box sx={{ p: 2, flex: 1 }}>
                <Skeleton width="60%" height={40} />
                <Skeleton width="40%" />
                <Skeleton width="80%" />
              </Box>
            </Card>
          ))}
        </Box>
      ) : filteredTickets.length > 0 ? (
        <Box>
          {filteredTickets.map((ticket) => (
            <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                onViewClick={handleViewTicket} 
            />
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={6}>
          <TicketIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {tabLabels[tabValue].toLowerCase()} tickets found
          </Typography>
          {tabValue === 0 && (
            <Button variant="contained" color="primary" href="/events" sx={{ mt: 2 }}>
              Browse Events
            </Button>
          )}
        </Box>
      )}

      <TicketDetailsDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        ticket={selectedTicket} 
      />
    </Box>
  );
}