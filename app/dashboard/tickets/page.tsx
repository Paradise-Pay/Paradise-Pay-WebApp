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
  Grid
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon, 
  Event as EventIcon, 
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  QrCode as QrCodeIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Ticket {
  id: string;
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

const mockTickets: Ticket[] = [
  {
    id: '1',
    eventId: 'e1',
    eventName: 'Summer Music Festival 2023',
    eventDate: '2023-07-15T19:00:00',
    eventLocation: 'Central Park, New York',
    ticketType: 'General Admission',
    price: 99.99,
    purchaseDate: '2023-06-10T14:30:00',
    status: 'upcoming',
    qrCode: 'QR_CODE_DATA_1',
    imageUrl: '/assets/images/event-1.jpg'
  },
  {
    id: '2',
    eventId: 'e2',
    eventName: 'Tech Conference 2023',
    eventDate: '2023-06-30T09:00:00',
    eventLocation: 'Convention Center, San Francisco',
    ticketType: 'VIP Pass',
    price: 499.99,
    purchaseDate: '2023-05-15T10:15:00',
    status: 'upcoming',
    qrCode: 'QR_CODE_DATA_2',
    imageUrl: '/assets/images/event-2.jpg'
  },
  {
    id: '3',
    eventId: 'e3',
    eventName: 'Jazz Night',
    eventDate: '2023-05-10T20:00:00',
    eventLocation: 'Blue Note Jazz Club, NYC',
    ticketType: 'Standard',
    price: 45.00,
    purchaseDate: '2023-04-20T16:45:00',
    status: 'past',
    qrCode: 'QR_CODE_DATA_3',
    imageUrl: '/assets/images/event-2.jpg'
  },
];

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log('Download ticket:', ticket.id);
    handleClose();
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share ticket:', ticket.id);
    handleClose();
  };

  const handleViewQr = () => {
    // Implement view QR code functionality
    console.log('View QR code for ticket:', ticket.id);
    handleClose();
  };

  const statusColor = {
    upcoming: 'primary',
    past: 'default',
    cancelled: 'error'
  } as const;

  return (
    <Card sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', mb: 3 }}>
      <CardMedia
        component="img"
        sx={{ 
          width: isMobile ? '100%' : 200, 
          height: isMobile ? 160 : 'auto',
          objectFit: 'cover' 
        }}
        image={ticket.imageUrl}
        alt={ticket.eventName}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', position: 'relative' }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography component="div" variant="h6">
                {ticket.eventName}
              </Typography>
              <Chip 
                label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)} 
                size="small" 
                color={statusColor[ticket.status]}
                sx={{ mt: 0.5, mb: 1 }}
              />
            </Box>
            <IconButton
              aria-label="more"
              aria-controls="ticket-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
          
          <Menu
            id="ticket-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleDownload}>
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Download Ticket</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleShare}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleViewQr}>
              <ListItemIcon>
                <QrCodeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View QR Code</ListItemText>
            </MenuItem>
          </Menu>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(ticket.eventDate), 'EEEE, MMMM d, yyyy • h:mm a')}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {ticket.eventLocation}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Ticket Type:</strong> {ticket.ticketType}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Order #:</strong> {ticket.id.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Purchased:</strong> {format(new Date(ticket.purchaseDate), 'MMM d, yyyy')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Box sx={{ display: 'flex', p: 2, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            GH₵{ticket.price.toFixed(2)}
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<EventIcon />}
              sx={{ mr: 1 }}
            >
              Event Details
            </Button>
            <Button 
              variant="contained" 
              size="small"
              startIcon={<QrCodeIcon />}
            >
              View Ticket
            </Button>
          </Box>
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

  useEffect(() => {
    // Simulate API call to fetch tickets
    const fetchTickets = async () => {
      try {
        // In a real app, you would fetch this from your API
        // const response = await fetch(`/api/users/${user?.id}/tickets`);
        // const data = await response.json();
        
        // Mock data for demonstration
        setTimeout(() => {
          setTickets(mockTickets);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user?.id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
        <Typography variant="h4" component="h1">
          My Tickets
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<FilterListIcon />}
        >
          Filter
        </Button>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3 }}
      >
        {tabLabels.map((label, index) => (
          <Tab 
            key={index} 
            label={`${label} ${index === 0 ? `(${tickets.filter(t => t.status === 'upcoming').length})` : 
                              index === 1 ? `(${tickets.filter(t => t.status === 'past').length})` : 
                              `(${tickets.filter(t => t.status === 'cancelled').length})`}`} 
          />
        ))}
      </Tabs>

      {loading ? (
        <Box>
          {[1, 2, 3].map((item) => (
            <Card key={item} sx={{ display: 'flex', mb: 3 }}>
              <Skeleton variant="rectangular" width={200} height={200} />
              <Box sx={{ p: 2, flex: 1 }}>
                <Skeleton width="60%" height={40} />
                <Skeleton width="40%" />
                <Skeleton width="80%" />
                <Skeleton width="70%" />
              </Box>
            </Card>
          ))}
        </Box>
      ) : filteredTickets.length > 0 ? (
        <Box>
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={6}>
          <TicketIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {tabLabels[tabValue].toLowerCase()} tickets found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {tabValue === 0 
              ? 'Upcoming events you purchase tickets for will appear here.'
              : tabValue === 1
              ? 'Past events you\'ve attended will appear here.'
              : 'Cancelled tickets will appear here.'
            }
          </Typography>
          {tabValue === 0 && (
            <Button 
              variant="contained" 
              color="primary" 
              component="a" 
              href="/events"
              sx={{ mt: 2 }}
            >
              Browse Events
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
