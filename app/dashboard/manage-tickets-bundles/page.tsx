'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Menu, Heading, Text, Flex, 
  Dialog, Input, Stack, Tabs, Checkbox, Portal, Separator, 
  Spinner, Center, HStack
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsThreeDotsVertical, BsPlusCircle, 
  BsTicketPerforated, BsBoxSeam, BsCalendarEvent, BsTrash
} from 'react-icons/bs';

// --- API & Context ---
import { useAuth } from '@/context/AuthContext';
import { 
  getBundles, createBundle, deleteBundle, addEventToBundle,
  getOrganizerEvents, getTicketTypes
} from '@/lib/api';

// --- IMPORTED TYPES ---
import type { TicketTypeResponse } from '@/types/domain/ticket';
import type { Bundle } from '@/types/domain/bundle';
import type { OrganizerEventResponse } from '@/types/domain/event';

// --- UI SPECIFIC TYPES ---
interface TicketUiItem extends TicketTypeResponse {
  eventName: string;
  eventId: string;
  total_quantity: number;
}

export default function TicketsControlPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [tickets, setTickets] = useState<TicketUiItem[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [eventsList, setEventsList] = useState<OrganizerEventResponse[]>([]);

  // Dialog States
  const [isBundleDialogOpen, setIsBundleDialogOpen] = useState(false);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  
  // Selection States
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  
  // Form States
  const [newBundleName, setNewBundleName] = useState('');
  const [newBundlePrice, setNewBundlePrice] = useState('');
  const [newBundleDesc, setNewBundleDesc] = useState('');

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch Events
      const eventsRes = await getOrganizerEvents();
      const events = Array.isArray(eventsRes) ? eventsRes : (eventsRes as any).data || [];
      setEventsList(events);

      // 2. Fetch Tickets
      const allTickets: TicketUiItem[] = [];
      await Promise.all(events.map(async (event: OrganizerEventResponse) => {
        try {
          const ticketsRes = await getTicketTypes(event.event_id);
          const eventTickets = Array.isArray(ticketsRes) ? ticketsRes : (ticketsRes as any).data || [];
          eventTickets.forEach((t: TicketTypeResponse) => {
            allTickets.push({ 
              ...t, 
              eventName: event.title, 
              eventId: event.event_id,
              total_quantity: (t.sold_quantity || 0) + (t.available_quantity || 0)
            });
          });
        } catch (e) {
          console.error(`Failed to fetch tickets for event ${event.event_id}`, e);
        }
      }));
      setTickets(allTickets);

      // 3. Fetch Bundles
      const bundlesRes = await getBundles();
      const bundlesData = Array.isArray(bundlesRes) ? bundlesRes : (bundlesRes as any).data || [];
      setBundles(bundlesData);

    } catch (error) {
      console.error("Error fetching data:", error);
      toaster.create({ title: "Failed to load data", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- ACTIONS ---

  const handleEventSelection = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEventIds(prev => [...prev, eventId]);
    } else {
      setSelectedEventIds(prev => prev.filter(id => id !== eventId));
    }
  };

  const handleCreateBundle = async () => {
    if (!newBundleName || !newBundlePrice) {
      toaster.create({ title: "Name and Price required", type: 'error' });
      return;
    }

    try {
      await createBundle({
        name: newBundleName,
        price: parseFloat(newBundlePrice),
        description: newBundleDesc,
        currency: 'GHS',
        event_ids: selectedEventIds
      });
      toaster.create({ title: "Bundle Created", type: 'success' });
      
      setNewBundleName('');
      setNewBundlePrice('');
      setNewBundleDesc('');
      setSelectedEventIds([]);
      setIsBundleDialogOpen(false);
      fetchData();
    } catch (error) {
      toaster.create({ title: "Failed to create bundle", type: 'error' });
    }
  };

  const handleDeleteBundle = async (id: string) => {
    if(!confirm("Are you sure you want to delete this bundle?")) return;
    try {
      await deleteBundle(id);
      setBundles(prev => prev.filter(b => b.bundle_id !== id));
      toaster.create({ title: "Bundle Deleted", type: 'success' });
    } catch (error) {
      toaster.create({ title: "Delete failed", type: 'error' });
    }
  };

  const handleAddEventsToExistingBundle = async () => {
    if (!selectedBundle || selectedEventIds.length === 0) return;
    
    try {
      const promises = selectedEventIds.map(eventId => 
        addEventToBundle(selectedBundle.bundle_id, eventId)
      );
      await Promise.all(promises);

      toaster.create({ title: "Events Added to Bundle", type: 'success' });
      setIsAddEventDialogOpen(false);
      setSelectedEventIds([]);
      fetchData();
    } catch (error) {
      toaster.create({ title: "Failed to add some events", type: 'error' });
    }
  };

  const openAddEventDialog = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setSelectedEventIds([]);
    setIsAddEventDialogOpen(true);
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Toaster />
      
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Tickets & Bundles</Heading>
          <Text color="gray.600">Manage your inventory and packages across all events.</Text>
        </Box>
        <Button colorPalette="purple" onClick={() => { setSelectedEventIds([]); setIsBundleDialogOpen(true); }}>
          <BsPlusCircle style={{ marginRight: '8px' }} /> Create Bundle
        </Button>
      </Flex>

      {/* TABS CONTAINER */}
      <Tabs.Root defaultValue="tickets" variant="enclosed">
        <Tabs.List mb={4}>
          <Tabs.Trigger value="tickets">
             <BsTicketPerforated style={{ marginRight: '8px' }} /> All Tickets
          </Tabs.Trigger>
          <Tabs.Trigger value="bundles">
             <BsBoxSeam style={{ marginRight: '8px' }} /> Bundles
          </Tabs.Trigger>
        </Tabs.List>

        {/* --- TAB 1: TICKETS --- */}
        <Tabs.Content value="tickets" p={0}>
          <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
            {loading ? (
              <Center p={10}><Spinner size="xl" /></Center>
            ) : (
              <Table.Root variant="outline" size="md">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Ticket Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Event</Table.ColumnHeader>
                    <Table.ColumnHeader>Price</Table.ColumnHeader>
                    <Table.ColumnHeader width="25%">Sales Progress</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Status</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {tickets.length === 0 ? (
                    <Table.Row><Table.Cell colSpan={5} textAlign="center" py={8} color="gray.500">No ticket types found.</Table.Cell></Table.Row>
                  ) : (
                    tickets.map((ticket) => (
                      <Table.Row key={ticket.ticket_type_id} _hover={{ bg: 'gray.50' }}>
                        <Table.Cell fontWeight="medium">{ticket.name}</Table.Cell>
                        <Table.Cell color="gray.500">{ticket.eventName}</Table.Cell>
                        <Table.Cell>{ticket.currency} {Number(ticket.price).toFixed(2)}</Table.Cell>
                        <Table.Cell>
                          <Flex justify="space-between" fontSize="xs" mb={1}>
                            <Text>Sold: {ticket.sold_quantity}</Text>
                            <Text>Left: {ticket.available_quantity}</Text>
                          </Flex>
                          <Box h="2" bg="gray.100" borderRadius="full" overflow="hidden">
                            <Box 
                              h="full" 
                              bg="blue.500" 
                              width={`${ticket.total_quantity > 0 ? (ticket.sold_quantity / ticket.total_quantity) * 100 : 0}%`}
                            />
                          </Box>
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          <Badge colorPalette={ticket.is_active ? 'green' : 'gray'}>
                            {ticket.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table.Root>
            )}
          </Box>
        </Tabs.Content>

        {/* --- TAB 2: BUNDLES --- */}
        <Tabs.Content value="bundles" p={0}>
          <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
            {loading ? (
              <Center p={10}><Spinner size="xl" /></Center>
            ) : (
              <Table.Root variant="outline" size="md">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Bundle Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Included Events</Table.ColumnHeader>
                    <Table.ColumnHeader>Price</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {bundles.length === 0 ? (
                    <Table.Row><Table.Cell colSpan={4} textAlign="center" py={8} color="gray.500">No bundles created yet.</Table.Cell></Table.Row>
                  ) : (
                    bundles.map((bundle) => (
                      <Table.Row key={bundle.bundle_id} _hover={{ bg: 'gray.50' }}>
                        <Table.Cell>
                          <Text fontWeight="bold">{bundle.name}</Text>
                          <Text fontSize="xs" color="gray.500">{bundle.description}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack gap={2} wrap="wrap">
                            {bundle.events && bundle.events.length > 0 ? (
                              bundle.events.map((e: any) => (
                                <Badge key={e.event_id || Math.random()} variant="surface" colorPalette="blue">
                                  {e.title || 'Event'}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" colorPalette="gray">No events</Badge>
                            )}
                          </HStack>
                        </Table.Cell>
                        <Table.Cell fontWeight="bold">{bundle.currency} {Number(bundle.price).toFixed(2)}</Table.Cell>
                        <Table.Cell textAlign="right">
                          <Menu.Root>
                            <Menu.Trigger asChild>
                              <IconButton variant="ghost" size="sm"><BsThreeDotsVertical /></IconButton>
                            </Menu.Trigger>
                            <Menu.Content>
                              <Menu.Item value="add-event" onClick={() => openAddEventDialog(bundle)}>
                                <BsCalendarEvent style={{ marginRight: '8px' }} /> Add Events
                              </Menu.Item>
                              <Menu.Item value="delete" color="red.500" onClick={() => handleDeleteBundle(bundle.bundle_id)}>
                                <BsTrash style={{ marginRight: '8px' }} /> Delete Bundle
                              </Menu.Item>
                            </Menu.Content>
                          </Menu.Root>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table.Root>
            )}
          </Box>
        </Tabs.Content>
      </Tabs.Root>

      {/* --- DIALOG: CREATE BUNDLE --- */}
      <Dialog.Root open={isBundleDialogOpen} onOpenChange={(e) => setIsBundleDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Create New Bundle</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Stack gap={1}>
                    <Text fontSize="sm" fontWeight="medium">Bundle Name</Text>
                    <Input placeholder="e.g. Summer Festival Pass" value={newBundleName} onChange={(e) => setNewBundleName(e.target.value)} />
                  </Stack>
                  <Stack gap={1}>
                    <Text fontSize="sm" fontWeight="medium">Description</Text>
                    <Input placeholder="What does this bundle include?" value={newBundleDesc} onChange={(e) => setNewBundleDesc(e.target.value)} />
                  </Stack>
                  <Stack gap={1}>
                    <Text fontSize="sm" fontWeight="medium">Price (GH₵)</Text>
                    <Input placeholder="0.00" type="number" value={newBundlePrice} onChange={(e) => setNewBundlePrice(e.target.value)} />
                  </Stack>

                  <Separator />
                  
                  {/* MULTI-SELECT EVENTS (Chakra v3 Checkbox) */}
                  <Stack gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Select Events to Include:</Text>
                    <Box maxH="150px" overflowY="auto" border="1px solid" borderColor="gray.200" borderRadius="md" p={3}>
                      <Stack gap={3}>
                        {eventsList.length === 0 && <Text fontSize="xs" color="gray.500">No events found.</Text>}
                        {eventsList.map((event) => (
                          <Checkbox.Root 
                            key={event.event_id} 
                            checked={selectedEventIds.includes(event.event_id)}
                            onCheckedChange={(e) => handleEventSelection(event.event_id, !!e.checked)}
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                            <Checkbox.Label>{event.title}</Checkbox.Label>
                          </Checkbox.Root>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>

                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsBundleDialogOpen(false)}>Cancel</Button>
                <Button colorPalette="purple" onClick={handleCreateBundle}>Create</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* --- DIALOG: ADD EVENTS TO EXISTING BUNDLE --- */}
      <Dialog.Root open={isAddEventDialogOpen} onOpenChange={(e) => setIsAddEventDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Add Events to Bundle</Dialog.Title>
                <Text fontSize="sm" color="gray.500">Adding to: <strong>{selectedBundle?.name}</strong></Text>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Text fontSize="sm" color="gray.600">Select events to add:</Text>
                  
                  {/* MULTI-SELECT LIST (Chakra v3 Checkbox) */}
                  <Box maxH="200px" overflowY="auto" border="1px solid" borderColor="gray.200" borderRadius="md" p={3}>
                    <Stack gap={3}>
                      {eventsList.length === 0 && <Text fontSize="xs" color="gray.500">No events found.</Text>}
                      {eventsList.map((event) => {
                        const isAlreadyInBundle = selectedBundle?.events?.some((e: any) => e.event_id === event.event_id);
                        
                        return (
                          <Checkbox.Root
                            key={event.event_id}
                            disabled={isAlreadyInBundle}
                            checked={selectedEventIds.includes(event.event_id)}
                            onCheckedChange={(e) => handleEventSelection(event.event_id, !!e.checked)}
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                            <Checkbox.Label>
                              <HStack>
                                <Text>{event.title}</Text>
                                {isAlreadyInBundle && <Badge size="xs" colorPalette="gray">Already Added</Badge>}
                              </HStack>
                            </Checkbox.Label>
                          </Checkbox.Root>
                        );
                      })}
                    </Stack>
                  </Box>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)}>Cancel</Button>
                <Button colorPalette="blue" onClick={handleAddEventsToExistingBundle}>
                  Add Selected Events
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

    </Box>
  );
}