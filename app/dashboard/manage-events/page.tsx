'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Table, Badge, Button, IconButton, Menu, Heading, Text, Flex, 
  Drawer, Dialog, Input, Stack, Switch, Field, Separator,
  Progress, SimpleGrid, Stat, HStack, Card, Portal, Tabs, Image, 
  Skeleton, Center, Spinner, useDisclosure
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsThreeDotsVertical, BsPlusCircle, BsPencil, 
  BsGraphUp, BsQrCodeScan, BsImage, BsTrash, BsCalendarEvent, 
  BsGeoAlt, BsPeople, BsCashStack, BsFilter, BsEye, BsSearch, BsHeartFill, BsHeart
} from 'react-icons/bs';
import { format } from 'date-fns';

// --- Context & API ---
import { useAuth } from '@/context/AuthContext';
import { 
  getOrganizerEvents, 
  deleteEvent, 
  getAllEvents, 
  getUserFavorites, 
  removeEventFromFavorites 
} from '@/lib/api';
import { OrganizerEventResponse } from '@/types/domain/event';

// --- TYPES ---

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
  analytics?: {
    checkInCount: number;
  };
  hasBundles?: boolean;
  totalCapacity?: number;
}

// --- SUB-COMPONENT: ADMIN VIEW (Manage All Events) ---
const AdminAllEventsView = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Action States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- FETCH DATA ---
  const fetchAllEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      
      const rawEvents = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any)?.events || [];

      const mappedEvents: Event[] = rawEvents.map((e: any) => ({
        id: e.event_id || e.id,
        title: e.title,
        description: e.description || '',
        startDate: e.event_date || e.startDate,
        endDate: e.event_end_date || e.endDate,
        location: e.venue_name || e.location || 'Online',
        imageUrl: e.event_image_url || '/assets/images/placeholder.jpg',
        status: (e.status || 'published').toLowerCase(),
        capacity: e.max_attendees || e.capacity || 0,
        totalCapacity: e.max_attendees || e.capacity || 0,
        ticketsSold: e.tickets_sold || e.ticketsSold || 0,
        price: parseFloat(e.ticket_price || e.price || 0),
        category: e.category_name || e.category || 'General',
        organizer: e.organizer_name || e.organizer?.name || 'Unknown Organizer',
        createdAt: e.created_at || new Date().toISOString(),
        hasBundles: e.has_bundles || false,
        analytics: {
          checkInCount: e.check_in_count || 0
        }
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching all events:", error);
      toaster.create({ title: 'Failed to load events', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  // --- FILTERING ---
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    const lowerQuery = searchQuery.toLowerCase();
    return events.filter(e => 
      e.title.toLowerCase().includes(lowerQuery) || 
      e.organizer.toLowerCase().includes(lowerQuery)
    );
  }, [events, searchQuery]);

  // --- ACTIONS ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    try {
      await deleteEvent(id);
      setEvents((prevEvents) => prevEvents.filter(e => e.id !== id));
      toaster.create({ title: 'Event deleted successfully', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: 'Failed to delete event', type: 'error', duration: 3000 });
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'published': 'green', 'live': 'green',
      'upcoming': 'blue', 'draft': 'gray',
      'cancelled': 'red', 'completed': 'blue'
    };
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
    return <Badge colorPalette={colors[status] || 'gray'} variant="solid">{displayStatus}</Badge>;
  };

  return (
    <Box>
      {/* Header with Search and Create */}
      <Flex justify="space-between" align="center" mb={4} gap={4} wrap="wrap">
        <HStack 
          bg="white" 
          border="1px solid" 
          borderColor="gray.200" 
          borderRadius="md" 
          px={3} 
          py={1.5}
          width={{ base: "100%", md: "300px" }}
        >
          <BsSearch color="gray" />
          <Input 
            variant="flushed" 
            placeholder="Search events or organizers..." 
            fontSize="sm"
            border="none"
            _focus={{ boxShadow: "none" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </HStack>

        <Button colorPalette="blue" size="sm" onClick={() => router.push('/dashboard/events/create')}>
          <BsPlusCircle style={{ marginRight: '8px' }} /> Create Event
        </Button>
      </Flex>

      <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto" border="1px solid" borderColor="gray.200">
        <Table.Root variant="outline" size="md">
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.ColumnHeader width="30%">Event Details</Table.ColumnHeader>
              <Table.ColumnHeader>Date</Table.ColumnHeader>
              <Table.ColumnHeader>Organizer</Table.ColumnHeader>
              <Table.ColumnHeader>Sales</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <Table.Row key={i}>
                  <Table.Cell><Skeleton height="20px" width="150px" mb={1} /><Skeleton height="12px" width="100px" /></Table.Cell>
                  <Table.Cell><Skeleton height="16px" width="80px" /></Table.Cell>
                  <Table.Cell><Skeleton height="16px" width="100px" /></Table.Cell>
                  <Table.Cell><Skeleton height="16px" width="60px" /></Table.Cell>
                  <Table.Cell><Skeleton height="20px" width="70px" /></Table.Cell>
                  <Table.Cell><Skeleton height="20px" width="20px" ml="auto" /></Table.Cell>
                </Table.Row>
              ))
            ) : filteredEvents.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6} textAlign="center" py={8} color="gray.500">
                  {searchQuery ? `No events match "${searchQuery}"` : "No events found."}
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredEvents.map((event) => (
                <Table.Row key={event.id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell>
                    <Text fontWeight="bold">{event.title}</Text>
                    {event.hasBundles && <Badge size="xs" colorPalette="purple" variant="outline" mt={1}>Bundles Active</Badge>}
                  </Table.Cell>
                  <Table.Cell>
                    {event.startDate && !isNaN(new Date(event.startDate).getTime()) 
                      ? format(new Date(event.startDate), 'MMM d, yyyy') 
                      : 'TBA'}
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="medium" fontSize="sm" color="blue.600">{event.organizer}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="medium" fontSize="xs">
                      {event.ticketsSold} / {event.totalCapacity || event.capacity}
                    </Text>
                    <Progress.Root 
                      value={event.totalCapacity ? (event.ticketsSold / event.totalCapacity) * 100 : 0} 
                      size="xs" 
                      width="80px" 
                      mt={1} 
                      colorPalette="blue"
                    >
                      <Progress.Track><Progress.Range /></Progress.Track>
                    </Progress.Root>
                  </Table.Cell>
                  <Table.Cell><StatusBadge status={event.status} /></Table.Cell>
                  <Table.Cell textAlign="right">
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <IconButton variant="ghost" size="xs" aria-label="Options"><BsThreeDotsVertical /></IconButton>
                      </Menu.Trigger>
                      <Menu.Content>
                        <Menu.Item value="edit" onClick={() => router.push(`/dashboard/events/edit/${event.id}`)}><BsPencil /> Edit</Menu.Item>
                        <Menu.Item value="analytics" onClick={() => { setCurrentEvent(event); setIsAnalyticsOpen(true); }}><BsGraphUp /> Analytics</Menu.Item>
                        <Menu.Item value="delete" color="red.500" onClick={() => handleDelete(event.id)}><BsTrash /> Delete</Menu.Item>
                      </Menu.Content>
                    </Menu.Root>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Editor Drawer */}
      <Drawer.Root open={isEditorOpen} onOpenChange={(e) => setIsEditorOpen(e.open)} size="md">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header><Drawer.Title>{isEditing ? 'Edit Event' : 'New Event'}</Drawer.Title></Drawer.Header>
            <Drawer.Body><Text>Form goes here...</Text></Drawer.Body>
            <Drawer.Footer><Button onClick={() => setIsEditorOpen(false)}>Close</Button></Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      {/* Analytics Modal */}
      <Dialog.Root open={isAnalyticsOpen} onOpenChange={(e) => setIsAnalyticsOpen(e.open)} size="xl">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header><Dialog.Title>Analytics: {currentEvent?.title}</Dialog.Title><Dialog.CloseTrigger /></Dialog.Header>
              <Dialog.Body>
                {currentEvent && (
                  <Stack gap={4}>
                     <SimpleGrid columns={3} gap={4}>
                        <Card.Root p={3} variant="outline">
                          <Stat.Root>
                            <Stat.Label>Estimated Revenue</Stat.Label>
                            <Stat.ValueText>GH₵ {(currentEvent.ticketsSold * currentEvent.price).toLocaleString()}</Stat.ValueText>
                          </Stat.Root>
                        </Card.Root>
                        <Card.Root p={3} variant="outline">
                          <Stat.Root>
                            <Stat.Label>Check-ins</Stat.Label>
                            <Stat.ValueText>{currentEvent.analytics?.checkInCount || 0}</Stat.ValueText>
                          </Stat.Root>
                        </Card.Root>
                        <Card.Root p={3} variant="outline">
                          <Stat.Root>
                            <Stat.Label>Capacity</Stat.Label>
                            <Stat.ValueText>{Math.round(((currentEvent.ticketsSold) / (currentEvent.capacity || 1)) * 100)}%</Stat.ValueText>
                          </Stat.Root>
                        </Card.Root>
                     </SimpleGrid>
                  </Stack>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

// --- SUB-COMPONENT: ORGANIZER VIEW (My Events) ---
const OrganizerMyEventsView = () => {
  const [tabValue, setTabValue] = useState('published');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const fetchOrganizerEvents = useCallback(async () => {
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
      toaster.create({ title: "Failed to load events", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrganizerEvents();
  }, [fetchOrganizerEvents]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    
    try {
      await deleteEvent(id);
      toaster.create({ title: "Event deleted", type: 'success' });
      fetchOrganizerEvents();
    } catch (error) {
      console.error("Delete error:", error);
      toaster.create({ title: "Failed to delete", type: 'error' });
    }
  };

  // --- FILTERING ---
  const filteredEvents = useMemo(() => {
    let result = events.filter(e => e.status === tabValue);
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(lowerQuery));
    }
    return result;
  }, [events, tabValue, searchQuery]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published': return 'green';
      case 'draft': return 'gray';
      case 'cancelled': return 'red';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
        <Tabs.Root value={tabValue} onValueChange={(e) => setTabValue(e.value)} variant="enclosed">
          <Tabs.List>
            <Tabs.Trigger value="published">Published</Tabs.Trigger>
            <Tabs.Trigger value="draft">Drafts</Tabs.Trigger>
            <Tabs.Trigger value="completed">Completed</Tabs.Trigger>
            <Tabs.Trigger value="cancelled">Cancelled</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <HStack gap={3}>
          {/* Search Bar */}
          <HStack 
            bg="white" 
            border="1px solid" 
            borderColor="gray.200" 
            borderRadius="md" 
            px={3} 
            py={1.5}
            width={{ base: "100%", sm: "250px" }}
          >
            <BsSearch color="gray" />
            <Input 
              variant="flushed" 
              placeholder="Search my events..." 
              fontSize="sm"
              border="none"
              _focus={{ boxShadow: "none" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </HStack>

          <Button colorPalette="blue" size="sm" onClick={() => router.push('/dashboard/events/create')}>
            <BsPlusCircle style={{marginRight: '5px'}}/> Create Event
          </Button>
        </HStack>
      </Flex>

      {loading ? (
        <Stack gap={4}>
          {[1, 2].map(i => <Skeleton key={i} height="180px" borderRadius="md" />)}
        </Stack>
      ) : filteredEvents.length > 0 ? (
        <Stack gap={4}>
          {filteredEvents.map((event) => (
            <Card.Root key={event.id} flexDirection={{ base: 'column', sm: 'row' }} overflow="hidden" variant="outline">
              <Image
                objectFit="cover"
                maxW={{ base: '100%', sm: '200px' }}
                src={event.imageUrl}
                alt={event.title}
                height={{ base: "150px", sm: "auto" }} 
              />
              <Card.Body>
                <Stack gap={2}>
                  <Flex justify="space-between" align="start">
                    <Box>
                      <Heading size="md" mb={1}>{event.title}</Heading>
                      <Badge colorPalette={getStatusColor(event.status)}>{event.status}</Badge>
                    </Box>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <IconButton variant="ghost" size="xs" aria-label="More"><BsThreeDotsVertical /></IconButton>
                      </Menu.Trigger>
                      <Menu.Content>
                        <Menu.Item value="view" onClick={() => router.push(`/dashboard/events/${event.id}`)}><BsEye /> View</Menu.Item>
                        <Menu.Item value="edit" onClick={() => router.push(`/dashboard/events/edit/${event.id}`)}><BsPencil /> Edit</Menu.Item>
                        <Menu.Item value="delete" color="red.500" onClick={() => handleDelete(event.id)}><BsTrash /> Delete</Menu.Item>
                      </Menu.Content>
                    </Menu.Root>
                  </Flex>

                  <Text fontSize="sm" color="gray.500" lineClamp={2}>{event.description}</Text>

                  <Separator />

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} fontSize="sm" color="gray.600">
                    <Flex align="center" gap={2}><BsCalendarEvent /> {event.startDate ? format(new Date(event.startDate), 'MMM d, yyyy h:mm a') : 'TBA'}</Flex>
                    <Flex align="center" gap={2}><BsGeoAlt /> {event.location}</Flex>
                    <Flex align="center" gap={2}><BsPeople /> {event.ticketsSold} / {event.capacity} sold</Flex>
                    <Flex align="center" gap={2}><BsCashStack /> GH₵{event.price.toFixed(2)}</Flex>
                  </SimpleGrid>
                </Stack>
              </Card.Body>
              <Card.Footer p={4} borderTopWidth={{base: '1px', sm: '0px'}} borderLeftWidth={{base: '0px', sm: '1px'}} borderColor="gray.100" minW="140px" justifyContent="center">
                 <Stack gap={2} width="100%">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/events/${event.id}`)}>View</Button>
                    <Button size="sm" colorPalette="blue" onClick={() => router.push(`/dashboard/events/edit/${event.id}`)}>Manage</Button>
                 </Stack>
              </Card.Footer>
            </Card.Root>
          ))}
        </Stack>
      ) : (
        <Center py={10} flexDirection="column" gap={4} bg="white" borderRadius="md" border="1px dashed" borderColor="gray.300">
          <BsCalendarEvent size={40} color="gray" />
          <Text color="gray.500">
            {searchQuery 
              ? `No ${tabValue} events match "${searchQuery}"`
              : `No ${tabValue} events found.`
            }
          </Text>
          {tabValue === 'draft' && !searchQuery && (
            <Button size="sm" colorPalette="blue" onClick={() => router.push('/dashboard/events/create')}>Create One</Button>
          )}
        </Center>
      )}
    </Box>
  );
};

// --- SUB-COMPONENT: FAVORITES VIEW ---
const FavoritesView = () => {
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await getUserFavorites();
      
      const rawEvents = Array.isArray(response) ? response : (response as any).data || [];

      // Adapting response to Event Interface
      const mappedEvents: Event[] = rawEvents.map((e: any) => ({
        id: e.event_id || e.id,
        title: e.title,
        description: e.description || '',
        startDate: e.event_date || e.startDate,
        endDate: e.event_end_date || e.endDate,
        location: e.venue_name || e.location || 'Online',
        imageUrl: e.event_image_url || '/assets/images/placeholder.jpg',
        status: (e.status || 'published').toLowerCase(),
        capacity: e.max_attendees || e.capacity || 0,
        ticketsSold: e.tickets_sold || e.ticketsSold || 0,
        price: parseFloat(e.ticket_price || e.price || 0),
        category: e.category_name || e.category || 'General',
        organizer: e.organizer_name || e.organizer?.name || 'Unknown',
        createdAt: e.created_at || new Date().toISOString(),
        totalCapacity: e.max_attendees || e.capacity || 0
      }));

      setFavorites(mappedEvents);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toaster.create({ title: "Failed to load favorites", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (id: string, title: string) => {
    try {
      await removeEventFromFavorites(id);
      setFavorites(prev => prev.filter(e => e.id !== id));
      toaster.create({ title: `Removed "${title}" from favorites`, type: 'info' });
    } catch (error) {
      toaster.create({ title: "Failed to remove favorite", type: 'error' });
    }
  };

  if (loading) {
    return (
      <Stack gap={4}>
        {[1, 2].map(i => <Skeleton key={i} height="120px" borderRadius="md" />)}
      </Stack>
    );
  }

  if (favorites.length === 0) {
    return (
      <Center py={10} flexDirection="column" gap={4} bg="white" borderRadius="md" border="1px dashed" borderColor="gray.300">
        <BsHeart size={40} color="gray" />
        <Text color="gray.500">You haven't saved any events yet.</Text>
        <Button size="sm" colorPalette="blue" onClick={() => router.push('/discover')}>
          Discover Events
        </Button>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
      {favorites.map((event) => (
        <Card.Root key={event.id} overflow="hidden" variant="outline" _hover={{ shadow: 'md' }} transition="all 0.2s">
          <Box position="relative">
            <Image
              objectFit="cover"
              src={event.imageUrl}
              alt={event.title}
              height="180px"
              width="100%"
            />
          </Box>
          <Card.Body gap={2}>
            <Heading size="md" lineClamp={1}>{event.title}</Heading>
            <Flex align="center" gap={2} fontSize="sm" color="gray.500">
              <BsCalendarEvent /> 
              <Text>{event.startDate ? format(new Date(event.startDate), 'MMM d, yyyy') : 'TBA'}</Text>
            </Flex>
            <Flex align="center" gap={2} fontSize="sm" color="gray.500">
              <BsGeoAlt /> 
              <Text lineClamp={1}>{event.location}</Text>
            </Flex>
          </Card.Body>
          <Card.Footer pt={0}>
            <HStack width="100%" gap={2}>
              <Button flex={1} variant="outline" size="sm" onClick={() => router.push(`/events/${event.id}`)}>
                View Details
              </Button>
              <IconButton 
                aria-label="Remove from favorites" 
                colorPalette="red" 
                variant="ghost" 
                size="sm"
                onClick={() => handleRemoveFavorite(event.id, event.title)}
              >
                <BsHeartFill />
              </IconButton>
            </HStack>
          </Card.Footer>
        </Card.Root>
      ))}
    </SimpleGrid>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function EventsPage() {
  const { user, loading } = useAuth();
  const [mainTab, setMainTab] = useState('my-events');

  useEffect(() => {
    if (!loading) {
      if (user?.role === 'Admin') {
        setMainTab('all-events');
      } else {
        setMainTab('my-events');
      }
    }
  }, [loading, user]);

  if (loading) return <Center h="50vh"><Spinner size="xl" /></Center>;

  const isAdmin = user?.role === 'Admin';

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Toaster />
      
      {/* Page Header */}
      <Box mb={6}>
        <Heading size="lg" mb={1}>Events Management</Heading>
        <Text color="gray.600">Create, track, and manage your events.</Text>
      </Box>

      {/* Main Tabs */}
      <Tabs.Root value={mainTab} onValueChange={(e) => setMainTab(e.value)} variant="line" colorPalette="blue">
        <Tabs.List bg="white" p={1} borderRadius="md" shadow="sm" mb={6}>
          {isAdmin && (
            <Tabs.Trigger value="all-events" flex="1" fontWeight="medium">
              <BsGraphUp style={{ marginRight: '8px' }} /> Manage All Events (Admin)
            </Tabs.Trigger>
          )}
          
          <Tabs.Trigger value="my-events" flex="1" fontWeight="medium">
            <BsCalendarEvent style={{ marginRight: '8px' }} /> My Events
          </Tabs.Trigger>

          {/* New Favorites Tab */}
          <Tabs.Trigger value="favorites" flex="1" fontWeight="medium">
            <BsHeartFill style={{ marginRight: '8px' }} /> My Favorites
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tab Panels */}
        <Box>
          {isAdmin && (
            <Tabs.Content value="all-events">
              <AdminAllEventsView />
            </Tabs.Content>
          )}

          <Tabs.Content value="my-events">
            <OrganizerMyEventsView />
          </Tabs.Content>

          <Tabs.Content value="favorites">
            <FavoritesView />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}