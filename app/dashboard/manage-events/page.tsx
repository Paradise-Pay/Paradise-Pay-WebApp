'use client';

import { useState } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Menu, Heading, Text, Flex, 
  Drawer, Dialog, Input, Stack, Textarea, Switch, Field, Separator,
  Progress, SimpleGrid, Stat, HStack, Card, Portal
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsThreeDotsVertical, BsPlusCircle, BsCalendarEvent, BsPencil, 
  BsGraphUp, BsQrCodeScan, BsImage, BsTrash 
} from 'react-icons/bs';
import { mockEvents, Event } from '@/public/data/EventsPlaceholder'; 

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  
  // -- State for Actions --
  const [isEditorOpen, setIsEditorOpen] = useState(false); // Drawer for Create/Edit
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false); // Modal for Reports
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- HANDLERS ---

  const handleCreateNew = () => {
    setCurrentEvent(null); // Reset for new entry
    setIsEditing(false);
    setIsEditorOpen(true);
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setIsEditorOpen(true);
  };

  const handleViewAnalytics = (event: Event) => {
    setCurrentEvent(event);
    setIsAnalyticsOpen(true);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toaster.create({ title: 'Event deleted', type: 'error', duration: 3000 });
  };

  // --- HELPERS ---
  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Live': 'green',
      'Upcoming': 'blue',
      'Ended': 'gray'
    };
    return <Badge colorPalette={colors[status]} variant="solid">{status}</Badge>;
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      
      {/* Header & Actions */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Events Management</Heading>
          <Text color="gray.600">Create events, track sales, and monitor check-ins.</Text>
        </Box>
        <Button colorPalette="blue" size="md" onClick={handleCreateNew}>
          <BsPlusCircle style={{ marginRight: '8px' }} /> Create Event
        </Button>
      </Flex>

      {/* 2. Events List Table */}
      <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
        <Table.Root variant="outline" size="lg">
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
            {events.map((event) => (
              <Table.Row key={event.id} _hover={{ bg: 'gray.50' }}>
                <Table.Cell>
                  <Text fontWeight="bold">{event.title}</Text>
                  {event.hasBundles && <Badge size="xs" colorPalette="purple" variant="outline">Bundles Active</Badge>}
                </Table.Cell>
                <Table.Cell>{event.date}</Table.Cell>
                <Table.Cell>{event.organizer}</Table.Cell>
                <Table.Cell>
                  <Text fontWeight="medium">{event.ticketsSold} / {event.totalCapacity}</Text>
                  <Progress.Root value={(event.ticketsSold / event.totalCapacity) * 100} size="xs" width="80px" mt={1}>
                    <Progress.Track><Progress.Range /></Progress.Track>
                  </Progress.Root>
                </Table.Cell>
                <Table.Cell><StatusBadge status={event.status} /></Table.Cell>
                
                {/* Row Actions */}
                <Table.Cell textAlign="right">
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <IconButton variant="ghost" size="sm" aria-label="Options">
                        <BsThreeDotsVertical />
                      </IconButton>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item value="edit" onClick={() => handleEdit(event)}>
                         <BsPencil style={{ marginRight: '8px' }} /> Edit Details
                      </Menu.Item>
                      <Menu.Item value="analytics" onClick={() => handleViewAnalytics(event)}>
                         <BsGraphUp style={{ marginRight: '8px' }} /> Analytics & Check-ins
                      </Menu.Item>
                      <Menu.Item value="delete" color="red.500" onClick={() => handleDelete(event.id)}>
                         <BsTrash style={{ marginRight: '8px' }} /> Delete Event
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* 3. CREATE / EDIT DRAWER (Side Panel) */}
      <Drawer.Root open={isEditorOpen} onOpenChange={(e) => setIsEditorOpen(e.open)} size="md">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{isEditing ? 'Edit Event' : 'Create New Event'}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap={5}>
                {/* Basic Info */}
                <Field.Root>
                  <Field.Label>Event Title</Field.Label>
                  <Input placeholder="e.g. Summer Jam 2025" defaultValue={currentEvent?.title} />
                </Field.Root>

                <Flex gap={4}>
                  <Field.Root>
                    <Field.Label>Date</Field.Label>
                    <Input type="date" defaultValue={currentEvent?.date} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Time</Field.Label>
                    <Input type="time" />
                  </Field.Root>
                </Flex>

                {/* Banner Upload Mock */}
                <Box border="2px dashed" borderColor="gray.300" borderRadius="md" p={6} textAlign="center" color="gray.500">
                  <BsImage size={24} style={{ margin: '0 auto 8px' }} />
                  <Text fontSize="sm">Click to upload Event Banner (1920x1080)</Text>
                </Box>

                <Separator />

                {/* Ticket Tiers */}
                <Heading size="sm">Ticket Configuration</Heading>
                <Stack bg="gray.50" p={3} borderRadius="md" gap={3}>
                  <Flex gap={2}>
                    <Input placeholder="Tier Name (e.g. VIP)" bg="white" />
                    <Input placeholder="Price" width="100px" bg="white" />
                    <Input placeholder="Qty" width="100px" bg="white" />
                  </Flex>
                  <Button size="xs" variant="outline" width="full">+ Add Another Tier</Button>
                </Stack>

                {/* Bundles Toggle */}
                <Flex justify="space-between" align="center" bg="purple.50" p={3} borderRadius="md">
                  <Box>
                    <Text fontWeight="medium" color="purple.800">Enable Bundles</Text>
                    <Text fontSize="xs" color="purple.600">Allow bundling tickets with merch/drinks.</Text>
                  </Box>
                  <Switch.Root colorPalette="purple" defaultChecked={currentEvent?.hasBundles}>
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                </Flex>

              </Stack>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Drawer.ActionTrigger>
              <Button colorPalette="blue">Save Event</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      {/* 4. ANALYTICS & REPORTS DIALOG (Modal) */}
      <Dialog.Root open={isAnalyticsOpen} onOpenChange={(e) => setIsAnalyticsOpen(e.open)} size="xl">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Flex align="center" gap={3}>
                  <Box bg="blue.100" p={2} borderRadius="md"><BsGraphUp color="#3182ce" /></Box>
                  <Box>
                    <Dialog.Title>Analytics: {currentEvent?.title}</Dialog.Title>
                    <Text fontSize="sm" color="gray.500">Live data overview</Text>
                  </Box>
                </Flex>
                <Dialog.CloseTrigger />
              </Dialog.Header>

              <Dialog.Body>
                {currentEvent && (
                  <Stack gap={6}>
                    {/* Top Stats Grid */}
                    <SimpleGrid columns={3} gap={4}>
                      <Card.Root variant="subtle" p={3}>
                        <Stat.Root>
                          <Stat.Label>Total Revenue</Stat.Label>
                          <Stat.ValueText>GH₵ {(currentEvent.ticketsSold * 150).toLocaleString()}</Stat.ValueText>
                        </Stat.Root>
                      </Card.Root>
                      <Card.Root variant="subtle" p={3}>
                        <Stat.Root>
                          <Stat.Label>Peak Purchase Time</Stat.Label>
                          <Stat.ValueText fontSize="lg">{currentEvent.analytics.peakTime}</Stat.ValueText>
                        </Stat.Root>
                      </Card.Root>
                      <Card.Root variant="subtle" p={3}>
                        <Stat.Root>
                          <Stat.Label>Abandoned Carts</Stat.Label>
                          <Stat.ValueText color="red.500">{currentEvent.analytics.abandonedCarts}</Stat.ValueText>
                        </Stat.Root>
                      </Card.Root>
                    </SimpleGrid>

                    <Separator />

                    {/* Sales by Type (Progress Bars) */}
                    <Box>
                      <Heading size="sm" mb={3}>Sales by Ticket Type</Heading>
                      <Stack gap={3}>
                        {currentEvent.analytics.salesByType.map((type, idx) => (
                          <Box key={idx}>
                            <Flex justify="space-between" mb={1}>
                              <Text fontSize="sm">{type.name}</Text>
                              <Text fontSize="sm" fontWeight="bold">{type.percentage}%</Text>
                            </Flex>
                            <Progress.Root value={type.percentage} colorPalette="blue" size="sm">
                              <Progress.Track>
                                <Progress.Range />
                              </Progress.Track>
                            </Progress.Root>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    <Separator />

                    {/* Check-In Report */}
                    <Box bg="gray.50" p={4} borderRadius="md">
                      <Flex align="center" gap={3} mb={3}>
                        <BsQrCodeScan />
                        <Heading size="sm">Check-In Status</Heading>
                      </Flex>
                      
                      <HStack gap={8} align="end">
                         <Box>
                           <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
                             {currentEvent.analytics.checkInCount}
                           </Text>
                           <Text fontSize="xs" color="gray.500">Scanned Tickets</Text>
                         </Box>
                         <Box height="40px" borderLeft="1px solid lightgray" />
                         <Box>
                           <Text fontSize="4xl" fontWeight="bold" color="gray.400" lineHeight="1">
                             {currentEvent.ticketsSold - currentEvent.analytics.checkInCount}
                           </Text>
                           <Text fontSize="xs" color="gray.500">Unscanned / Pending</Text>
                         </Box>
                      </HStack>
                      
                      {/* Visual Bar for Checkins */}
                      <Progress.Root 
                        value={(currentEvent.analytics.checkInCount / (currentEvent.ticketsSold || 1)) * 100} 
                        colorPalette="green" 
                        size="md" 
                        mt={4}
                        striped
                      >
                         <Progress.Track>
                            <Progress.Range />
                         </Progress.Track>
                      </Progress.Root>
                      <Text fontSize="xs" mt={1} textAlign="right">
                        {Math.round((currentEvent.analytics.checkInCount / (currentEvent.ticketsSold || 1)) * 100)}% Checked In
                      </Text>
                    </Box>

                  </Stack>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" onClick={() => setIsAnalyticsOpen(false)}>Close Report</Button>
                <Button colorPalette="blue"><BsGraphUp style={{ marginRight: '5px' }} /> Export PDF</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

    </Box>
  );
}