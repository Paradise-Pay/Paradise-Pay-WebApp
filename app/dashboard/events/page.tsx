'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Stack,
  Grid
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
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { toast } from 'react-toastify';

import { getOrganizerEvents, deleteEvent } from '@/lib/api';
import type { OrganizerEventResponse } from '@/types/domain/event';

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

// Pass refresh function to card to handle deletion updates
const EventCard = ({ event, isMobile, onRefresh }: { event: Event, isMobile: boolean, onRefresh: () => void }) => {
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

  // ✅ UPDATE: Implement Delete
  const handleDelete = async () => {
    if(confirm("Are you sure you want to delete this event? This cannot be undone.")) {
      try {
        await deleteEvent(event.id);
        toast.success("Event deleted successfully");
        onRefresh(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
    handleClose();
  };

  const handleView = () => {
    router.push(`/dashboard/events/${event.id}`);
    handleClose();
  };

  const statusColor = {
    draft: 'default',
    published: 'success',
    cancelled: 'error',
    completed: 'info'
  } as const;

  const progress = event.capacity > 0 ? Math.min(Math.round((event.ticketsSold / event.capacity) * 100), 100) : 0;

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
                      {/* Safety check for dates */}
                      {event.startDate && !isNaN(new Date(event.startDate).getTime()) 
                        ? `${format(new Date(event.startDate), 'MMM d, yyyy')} • ${format(new Date(event.startDate), 'h:mm a')}`
                        : 'Date not set'}
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
                      GH₵{event.price.toFixed(2)} per ticket
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
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleView}>
              <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
              <ListItemText>View Event</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDelete} sx={{ color: theme.palette.error.main }}>
              <ListItemIcon sx={{ color: 'inherit' }}><DeleteIcon fontSize="small" /></ListItemIcon>
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
              Created: {event.createdAt ? format(new Date(event.createdAt), 'MMM d, yyyy') : 'N/A'}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => router.push(`/dashboard/events/${event.id}`)}
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
  
  const userRole = (user as any)?.role || "User";

  const handleCreateEvent = () => {
    if (userRole === 'Organizer' || userRole === 'Admin') {
      window.location.href = '/dashboard/events/create';
    } else {
      alert('You do not have permission to create events.');
    }
  };

  const fetchOrganizerEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await getOrganizerEvents();

      const eventsList = Array.isArray(response) ? response : (response as any).data || [];

      const mappedEvents: Event[] = eventsList.map((item: OrganizerEventResponse) => ({
          id: item.event_id,
          title: item.title,
          description: item.description || '',
          startDate: item.event_date,
          endDate: item.event_end_date,
          location: item.venue_name || 'Online',
          imageUrl: item.event_image_url || '/assets/images/placeholder.jpg',
          status: (item.status || 'published').toLowerCase() as any,
          capacity: item.max_attendees || 0,
          ticketsSold: item.tickets_sold || 0,
          price: parseFloat(String(item.ticket_price || 0)),
          category: item.category_id || 'General', 
          organizer: item.organizer_id || '',
          createdAt: item.created_at || new Date().toISOString()
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerEvents();
  }, [user]);

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
            onClick={() => handleCreateEvent()}
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
            <EventCard 
              key={event.id} 
              event={event} 
              isMobile={isMobile} 
              onRefresh={fetchOrganizerEvents} // Pass refresh handler
            />
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