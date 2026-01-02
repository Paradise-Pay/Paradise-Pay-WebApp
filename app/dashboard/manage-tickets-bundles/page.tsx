'use client';

import { useState, useMemo } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Menu, Heading, Text, Flex, 
  Dialog, Input, Stack, Select, Tabs, Card, Stat, SimpleGrid, 
  Progress, Portal, Separator, createListCollection
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsThreeDotsVertical, BsPauseCircle, BsPlayCircle, BsCurrencyDollar, 
  BsLightningCharge, BsShieldExclamation, BsCheckCircle, BsExclamationTriangle 
} from 'react-icons/bs';
import { 
  mockInventory, mockFraudAlerts, TicketItem, FraudAlert 
} from '@/public/data/TicketsBundlesPlaceholders';

export default function TicketsControlPage() {
  const [inventory, setInventory] = useState<TicketItem[]>(mockInventory);
  const [alerts, setAlerts] = useState<FraudAlert[]>(mockFraudAlerts);
  
  // -- State for Edit Dialog --
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TicketItem | null>(null);
  const [newPrice, setNewPrice] = useState('');

  const eventCollection = useMemo(() => 
    createListCollection({
      items: [
        { label: 'AfroFuture 2025', value: 'AfroFuture 2025' },
        { label: 'All Events', value: 'all' }
      ]
    }), 
  []);

  // --- ACTIONS ---

  const toggleStatus = (id: string, currentStatus: string) => {
    // Basic toggle logic for demo
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    setInventory(inventory.map(i => i.id === id ? { ...i, status: newStatus as any } : i));
    toaster.create({ title: `Item ${newStatus}`, type: 'info' });
  };

  const openPriceDialog = (item: TicketItem) => {
    setSelectedItem(item);
    setNewPrice(item.price.toString());
    setIsPriceDialogOpen(true);
  };

  const savePrice = () => {
    if (selectedItem) {
      setInventory(inventory.map(i => i.id === selectedItem.id ? { ...i, price: parseFloat(newPrice) } : i));
      setIsPriceDialogOpen(false);
      toaster.create({ title: 'Price Updated', type: 'success' });
    }
  };

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
    toaster.create({ title: 'Alert Resolved', type: 'success' });
  };

  // --- HELPERS ---

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Active': 'green',
      'Paused': 'orange',
      'Sold Out': 'gray'
    };
    return <Badge colorPalette={colors[status]}>{status}</Badge>;
  };

  const SeverityBadge = ({ level }: { level: string }) => {
     const colors: Record<string, string> = {
      'High': 'red',
      'Medium': 'orange',
      'Low': 'yellow'
    };
    return <Badge colorPalette={colors[level]} variant="solid">{level}</Badge>;
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Tickets & Bundles Control</Heading>
          <Text color="gray.600">Global inventory management and fraud monitoring.</Text>
        </Box>
      </Flex>

      {/* TABS CONTAINER */}
      <Tabs.Root defaultValue="inventory" variant="enclosed">
        <Tabs.List mb={4}>
          <Tabs.Trigger value="inventory">Inventory View</Tabs.Trigger>
          <Tabs.Trigger value="bulk">Bulk Operations</Tabs.Trigger>
          <Tabs.Trigger value="fraud">
             Fraud Monitor 
             {alerts.filter(a => a.status === 'Open').length > 0 && (
               <Badge colorPalette="red" ml={2} variant="solid">
                 {alerts.filter(a => a.status === 'Open').length}
               </Badge>
             )}
          </Tabs.Trigger>
        </Tabs.List>

        {/* --- TAB 1: INVENTORY VIEW --- */}
        <Tabs.Content value="inventory" p={0}>
          <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
            <Table.Root variant="outline" size="lg">
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader>Item Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Event</Table.ColumnHeader>
                  <Table.ColumnHeader>Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Price</Table.ColumnHeader>
                  <Table.ColumnHeader width="20%">Sold / Capacity</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {inventory.map((item) => (
                  <Table.Row key={item.id} _hover={{ bg: 'gray.50' }}>
                    <Table.Cell fontWeight="medium">{item.name}</Table.Cell>
                    <Table.Cell color="gray.500">{item.eventName}</Table.Cell>
                    <Table.Cell>
                      <Badge variant="outline" colorPalette={item.type === 'Bundle' ? 'purple' : 'blue'}>
                        {item.type}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>GH₵ {item.price}</Table.Cell>
                    <Table.Cell>
                       <Text fontSize="xs" mb={1}>{item.sold} / {item.capacity}</Text>
                       <Progress.Root value={(item.sold / item.capacity) * 100} size="xs" colorPalette="blue">
                          <Progress.Track>
                            <Progress.Range />
                          </Progress.Track>
                       </Progress.Root>
                    </Table.Cell>
                    <Table.Cell><StatusBadge status={item.status} /></Table.Cell>
                    <Table.Cell textAlign="right">
                      <Menu.Root>
                        <Menu.Trigger asChild>
                          <IconButton variant="ghost" size="sm" aria-label="Options">
                            <BsThreeDotsVertical />
                          </IconButton>
                        </Menu.Trigger>
                        <Menu.Content>
                          <Menu.Item value="price" onClick={() => openPriceDialog(item)}>
                            <BsCurrencyDollar style={{ marginRight: '8px' }} /> Adjust Price
                          </Menu.Item>
                          {item.status !== 'Sold Out' && (
                            <Menu.Item 
                              value="toggle" 
                              color={item.status === 'Active' ? 'orange.500' : 'green.500'}
                              onClick={() => toggleStatus(item.id, item.status)}
                            >
                              {item.status === 'Active' 
                                ? <><BsPauseCircle style={{ marginRight: '8px' }} /> Pause Sales</>
                                : <><BsPlayCircle style={{ marginRight: '8px' }} /> Resume Sales</>
                              }
                            </Menu.Item>
                          )}
                        </Menu.Content>
                      </Menu.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Tabs.Content>

        {/* --- TAB 2: BULK OPERATIONS --- */}
        <Tabs.Content value="bulk">
           <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              
              {/* Mass Price Adjustment */}
              <Card.Root>
                <Card.Header>
                  <Heading size="sm">Mass Price Adjustment</Heading>
                  <Text fontSize="xs" color="gray.500">Apply price changes to multiple tickets at once.</Text>
                </Card.Header>
                <Card.Body>
                  <Stack gap={4}>
                    <Select.Root collection={eventCollection}>
                        <Select.Trigger><Select.ValueText placeholder="Select Event Scope" /></Select.Trigger>
                    </Select.Root>
                    <Flex gap={2}>
                       <Input placeholder="Percentage (e.g. 10)" />
                       <Button variant="outline" colorPalette="green">Increase</Button>
                       <Button variant="outline" colorPalette="red">Decrease</Button>
                    </Flex>
                  </Stack>
                </Card.Body>
              </Card.Root>

              {/* Emergency Freeze */}
              <Card.Root borderColor="red.200" borderWidth={1}>
                <Card.Header>
                  <Flex align="center" gap={2}>
                    <BsExclamationTriangle color="red" />
                    <Heading size="sm" color="red.600">Emergency Controls</Heading>
                  </Flex>
                </Card.Header>
                <Card.Body>
                  <Text fontSize="sm" mb={4}>Immediately stop sales for specific categories or globally.</Text>
                  <Stack gap={3}>
                    <Button colorPalette="orange" variant="surface">Freeze All "Ticket" Sales</Button>
                    <Button colorPalette="red" variant="solid">GLOBAL FREEZE (Stop All Sales)</Button>
                  </Stack>
                </Card.Body>
              </Card.Root>

              {/* Promo Creator */}
              <Card.Root>
                <Card.Header>
                  <Heading size="sm">Create Bundle Promo</Heading>
                </Card.Header>
                <Card.Body>
                   <Stack gap={3}>
                     <Input placeholder="Promo Name (e.g. Squad Deal)" />
                     <Flex gap={2}>
                       <Input placeholder="Discount %" />
                       <Button colorPalette="purple"><BsLightningCharge style={{ marginRight: '5px' }} /> Create Promo</Button>
                     </Flex>
                   </Stack>
                </Card.Body>
              </Card.Root>

           </SimpleGrid>
        </Tabs.Content>

        {/* --- TAB 3: FRAUD MONITOR --- */}
        <Tabs.Content value="fraud">
           <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} mb={6}>
              {/* Stats for Fraud */}
              <Card.Root p={4} variant="subtle"><Stat.Root><Stat.Label>Open Alerts</Stat.Label><Stat.ValueText color="red.500">3</Stat.ValueText></Stat.Root></Card.Root>
              <Card.Root p={4} variant="subtle"><Stat.Root><Stat.Label>Flagged Accounts</Stat.Label><Stat.ValueText>12</Stat.ValueText></Stat.Root></Card.Root>
              <Card.Root p={4} variant="subtle"><Stat.Root><Stat.Label>Risk Level</Stat.Label><Stat.ValueText color="orange.500">Moderate</Stat.ValueText></Stat.Root></Card.Root>
           </SimpleGrid>

           <Box bg="white" borderRadius="lg" shadow="sm">
             <Table.Root>
               <Table.Header bg="red.50">
                 <Table.Row>
                   <Table.ColumnHeader>Severity</Table.ColumnHeader>
                   <Table.ColumnHeader>Detected Issue</Table.ColumnHeader>
                   <Table.ColumnHeader>User & Event</Table.ColumnHeader>
                   <Table.ColumnHeader>Time</Table.ColumnHeader>
                   <Table.ColumnHeader textAlign="right">Action</Table.ColumnHeader>
                 </Table.Row>
               </Table.Header>
               <Table.Body>
                 {alerts.map(alert => (
                   <Table.Row key={alert.id} opacity={alert.status === 'Resolved' ? 0.6 : 1}>
                     <Table.Cell>
                       <SeverityBadge level={alert.severity} />
                     </Table.Cell>
                     <Table.Cell fontWeight="medium">
                        {alert.reason}
                        {alert.status === 'Resolved' && <Badge ml={2} colorPalette="green" variant="outline">Resolved</Badge>}
                     </Table.Cell>
                     <Table.Cell>
                       <Text fontSize="sm" fontWeight="bold">{alert.user}</Text>
                       <Text fontSize="xs" color="gray.500">{alert.event}</Text>
                     </Table.Cell>
                     <Table.Cell color="gray.500">{alert.timestamp}</Table.Cell>
                     <Table.Cell textAlign="right">
                        {alert.status === 'Open' ? (
                          <Flex justify="end" gap={2}>
                            <Button size="xs" colorPalette="red" variant="ghost">Ban</Button>
                            <Button size="xs" colorPalette="green" variant="outline" onClick={() => resolveAlert(alert.id)}>
                               <BsCheckCircle style={{ marginRight: '5px' }} /> Resolve
                            </Button>
                          </Flex>
                        ) : (
                          <Text fontSize="xs" color="gray.400">No actions needed</Text>
                        )}
                     </Table.Cell>
                   </Table.Row>
                 ))}
               </Table.Body>
             </Table.Root>
           </Box>
        </Tabs.Content>

      </Tabs.Root>

      {/* Edit Price Dialog */}
      <Dialog.Root open={isPriceDialogOpen} onOpenChange={(e) => setIsPriceDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Adjust Price: {selectedItem?.name}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Text fontSize="sm" color="gray.600">Current Price: GH₵ {selectedItem?.price}</Text>
                  <Input 
                    placeholder="New Price" 
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)} 
                    type="number"
                  />
                  <Text fontSize="xs" color="orange.600">Note: This will not affect tickets already sold.</Text>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsPriceDialogOpen(false)}>Cancel</Button>
                <Button colorPalette="blue" onClick={savePrice}>Save Changes</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

    </Box>
  );
}