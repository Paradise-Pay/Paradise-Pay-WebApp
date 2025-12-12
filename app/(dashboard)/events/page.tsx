'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia,
  Grid,
  Button, 
  Chip, 
  Skeleton,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { 
  Event as EventIcon, 
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  MonetizationOn as MonetizationOnIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthProvider';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  capacity: number;
  ticketsSold: number;
  price: number;
  category: string;
  organizer: string;
  createdAt: string;
}

const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Summer Music Festival 2023',
    description: 'The biggest music festival of the year featuring top artists from around the world.',
    startDate: '2023-07-15T19:00:00',
    endDate: '2023-07-17T23:00:00',
    location: 'Central Park, New York',
    imageUrl: '/assets/images/event-1.jpg',
    status: 'published',
    capacity: 10000,
    ticketsSold: 7500,
    price: 99.99,
    category: 'Music',
    organizer: 'Paradise Events',
    createdAt: '2023-01-15T10:00:00'
  },
  {
    id: 'e2',
    title: 'Tech Conference 2023',
    description: 'Annual technology conference with industry leaders and workshops.',
    startDate: '2023-06-30T09:00:00',
    endDate: '2023-07-02T18:00:00',
    location: 'Convention Center, San Francisco',
    imageUrl: '/assets/images/event-2.jpg',
    status: 'published',
    capacity: 5000,
    ticketsSold: 4200,
    price: 499.99,
    category: 'Technology',
    organizer: 'Tech Summit Inc.',
    createdAt: '2022-11-20T14:30:00'
  },
  {
    id: 'e3',
    title: 'Art Exhibition: Modern Masters',
    description: 'Exhibition featuring works by contemporary artists.',
    startDate: '2023-05-10T10:00:00',
    endDate: '2023-06-10T18:00:00',
    location: 'Modern Art Museum, NYC',
    imageUrl: '/assets/images/event-1.jpg',
    status: 'completed',
    capacity: 2000,
    ticketsSold: 1850,
    price: 25.00,
    category: 'Art',
    organizer: 'Art Collective',
    createdAt: '2023-03-01T09:15:00'
  },
  {
    id: 'e4',
    title: 'Food & Wine Tasting',
    description: 'An evening of fine dining and wine pairing with expert sommeliers.',
    startDate: '2023-08-20T18:30:00',
    endDate: '2023-08-20T22:00:00',
    location: 'Grand Hotel, Chicago',
    imageUrl: '/assets/images/event-2.jpg',
    status: 'draft',
    capacity: 200,
    ticketsSold: 0,
    price: 150.00,
    category: 'Food & Drink',
    organizer: 'Gourmet Experiences',
    createdAt: '2023-04-10T16:45:00'
  }
];

const EventCard = ({ event, isMobile }: { event: Event, isMobile: boolean }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    router.push(`/dashboard/events/edit/${event.id}`);
    handleClose();
  };

  const handleDelete = () => {
    // Implement delete functionality
    console.log('Delete event:', event.id);
    handleClose();
  };

  const handleView = () => {
    router.push(`/events/${event.id}`);
    handleClose();
  };

  const statusColor = {
    draft: 'default',
    published: 'success',
    cancelled: 'error',
    completed: 'info'
  } as const;

  const progress = Math.min(Math.round((event.ticketsSold / event.capacity) * 100), 100);

  return (
    <Card sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', mb: 3 }}>
      <CardMedia
        component="img"
        sx={{ 
          width: isMobile ? '100%' : 240, 
          height: isMobile ? 180 : 'auto',
          objectFit: 'cover' 
        }}
        image={event.imageUrl}
        alt={event.title}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', position: 'relative' }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography component="h3" variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                  {event.title}
                </Typography>
                <Chip 
                  label={event.status.charAt(0).toUpperCase() + event.status.slice(1)} 
                  size="small" 
                  color={statusColor[event.status]}
                  variant={event.status === 'draft' ? 'outlined' : 'filled'}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                {event.description.length > 150 
                  ? `${event.description.substring(0, 150)}...` 
                  : event.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(event.startDate), 'MMM d, yyyy')} • {format(new Date(event.startDate), 'h:mm a')}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.location}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <GroupIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.ticketsSold} / {event.capacity} tickets sold ({progress}%)
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <MonetizationOnIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      ${event.price.toFixed(2)} per ticket
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <IconButton
              aria-label="more"
              aria-controls="event-menu"
              aria-haspopup="true"
              onClick={handleClick}
              sx={{ ml: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
          
          <Menu
            id="event-menu"
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
            <MenuItem onClick={handleView}>
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Event</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDelete} sx={{ color: theme.palette.error.main }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </CardContent>
        <Box sx={{ 
          display: 'flex', 
          p: 2, 
          pt: 0, 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Created: {format(new Date(event.createdAt), 'MMM d, yyyy')}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => router.push(`/events/${event.id}`)}
            >
              View
            </Button>
            <Button 
              variant="contained" 
              size="small"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/dashboard/events/edit/${event.id}`)}
            >
              Manage
            </Button>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};

export default function MyEventsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Simulate API call to fetch events
    const fetchEvents = async () => {
      try {
        // In a real app, you would fetch this from your API
        // const response = await fetch(`/api/organizers/${user?.id}/events`);
        // const data = await response.json();
        
        // Mock data for demonstration
        setTimeout(() => {
          setEvents(mockEvents);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredEvents = events.filter(event => {
    if (tabValue === 0) return event.status === 'published';
    if (tabValue === 1) return event.status === 'draft';
    if (tabValue === 2) return event.status === 'completed';
    if (tabValue === 3) return event.status === 'cancelled';
    return true;
  });

  const tabLabels = ['Published', 'Drafts', 'Completed', 'Cancelled'];
  const tabCounts = [
    events.filter(e => e.status === 'published').length,
    events.filter(e => e.status === 'draft').length,
    events.filter(e => e.status === 'completed').length,
    events.filter(e => e.status === 'cancelled').length
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1">
          My Events
        </Typography>
        <Box display="flex" gap={2}>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
          >
            Filter
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => window.location.href = '/dashboard/events/create'}
          >
            Create Event
          </Button>
        </Box>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {tabLabels.map((label, index) => (
          <Tab 
            key={index} 
            label={`${label} (${tabCounts[index]})`}
            sx={{ minWidth: 'unset', px: 2 }}
          />
        ))}
      </Tabs>

      {loading ? (
        <Box>
          {[1, 2, 3].map((item) => (
            <Card key={item} sx={{ display: 'flex', mb: 3 }}>
              <Skeleton variant="rectangular" width={240} height={200} />
              <Box sx={{ p: 2, flex: 1 }}>
                <Skeleton width="60%" height={40} />
                <Skeleton width="40%" />
                <Skeleton width="80%" />
                <Skeleton width="70%" />
              </Box>
            </Card>
          ))}
        </Box>
      ) : filteredEvents.length > 0 ? (
        <Box>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} isMobile={isMobile} />
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={6}>
          <EventIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {tabLabels[tabValue].toLowerCase()} events found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {tabValue === 0 
              ? 'Published events will appear here.'
              : tabValue === 1
              ? 'Your draft events will appear here.'
              : tabValue === 2
              ? 'Completed events will appear here.'
              : 'Cancelled events will appear here.'
            }
          </Typography>
          {tabValue === 1 && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => window.location.href = '/dashboard/events/create'}
              sx={{ mt: 2 }}
            >
              Create Your First Event
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
