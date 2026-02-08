'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Heading, Text, Flex, 
  Tabs, SimpleGrid, Card, Stat, HStack, Stack, 
  Dialog, Textarea, Portal, Separator, Input, Select, Spinner, Center, VStack, Avatar
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsHeadset, BsPersonBadge, BsShieldLock, BsJournalText, 
  BsEye, BsReply, BsPlusCircle, BsPerson
} from 'react-icons/bs';

// --- API & Context ---
import { useAuth } from '@/context/AuthContext';
import { 
  getSupportTickets, 
  createSupportTicket, 
  addTicketResponse, 
  updateSupportTicket,
  getSupportTicketById // Import this to fetch details + responses
} from '@/lib/api';
import { SupportTicket } from '@/types/domain/support'; 

// --- MOCK DATA ---
import { createListCollection } from '@chakra-ui/react';

export default function SupportPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketStats, setTicketStats] = useState({ total: 0, open: 0, resolved: 0 });
  
  // -- State for Dialogs --
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false); // Loading state for single ticket
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // -- Form States --
  const [replyMessage, setReplyMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newPriority, setNewPriority] = useState('Low');

  // --- DATA FETCHING ---
  const fetchTickets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await getSupportTickets({ 
        limit: 100, // Increased limit to get better stats accuracy
        sort_by: 'created_at', 
        sort_order: 'DESC' 
      });
      
      if (response.success && response.data) {
        const ticketsList = (response.data as any).tickets || response.data;
        const safeList = Array.isArray(ticketsList) ? ticketsList : [];
        setTickets(safeList);

        // ✅ FIX 2: robust stat calculation (handling case sensitivity)
        const total = (response.data as any).total || safeList.length;
        const open = safeList.filter((t: SupportTicket) => t.status.toLowerCase() === 'open' || t.status.toLowerCase() === 'pending').length;
        const resolved = safeList.filter((t: SupportTicket) => t.status.toLowerCase() === 'resolved' || t.status.toLowerCase() === 'closed').length;
        
        setTicketStats({ total, open, resolved });
      }
    } catch (error) {
      console.error("Fetch tickets error:", error);
      toaster.create({ title: "Failed to load tickets", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // --- ACTIONS ---

  // ✅ FIX 1: Fetch full ticket details (including responses) on click
  const handleViewTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket); // Show immediate data
    setIsReplyDialogOpen(true);
    setIsLoadingDetails(true);

    try {
      const response = await getSupportTicketById(ticket.ticket_id);
      if (response.success && response.data) {
        setSelectedTicket(response.data); // Update with full data including responses
      }
    } catch (error) {
      toaster.create({ title: "Failed to load conversation", type: 'error' });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newSubject || !newDescription) {
      toaster.create({ title: "Subject and Description required", type: 'error' });
      return;
    }

    try {
      await createSupportTicket({
        subject: newSubject,
        description: newDescription,
        category: newCategory,
        priority: newPriority
      });
      
      toaster.create({ title: "Ticket Created", type: 'success' });
      setIsCreateDialogOpen(false);
      setNewSubject(''); setNewDescription(''); 
      fetchTickets(); 
    } catch (error) {
      toaster.create({ title: "Failed to create ticket", type: 'error' });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedTicket || !replyMessage) return;

    try {
      // 1. Add Response (Admin internal=false so users see it)
      await addTicketResponse(selectedTicket.ticket_id, replyMessage, false);
      
      toaster.create({ title: "Response Sent", type: 'success' });
      setReplyMessage('');
      
      // Refresh the open conversation to show new message immediately
      handleViewTicket(selectedTicket);
      fetchTickets(); // Update list status if changed
    } catch (error) {
      toaster.create({ title: "Failed to send response", type: 'error' });
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket) return;
    try {
      await updateSupportTicket(selectedTicket.ticket_id, { status: 'Resolved' });
      toaster.create({ title: "Ticket Resolved", type: 'success' });
      setIsReplyDialogOpen(false);
      fetchTickets();
    } catch (error) {
      toaster.create({ title: "Failed to resolve", type: 'error' });
    }
  };

  // --- HELPERS ---

  const isAdmin = user?.role === 'Admin';

  const PriorityBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = { 'High': 'red', 'Medium': 'orange', 'Low': 'gray', 'Urgent': 'red' };
    return <Badge colorPalette={colors[level] || 'gray'} variant="subtle">{level}</Badge>;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const s = status.toLowerCase();
    const colors: Record<string, string> = {
      'open': 'red', 'in progress': 'blue', 'resolved': 'green', 'closed': 'gray', 'pending': 'orange'
    };
    return <Badge colorPalette={colors[s] || 'gray'}>{status}</Badge>;
  };

  // --- TAB CONTENT: TICKETS ---
  const TicketsView = () => (
    <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
      {loading ? (
        <Center p={10}><Spinner size="xl" /></Center>
      ) : (
        <Table.Root>
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.ColumnHeader>Subject</Table.ColumnHeader>
              <Table.ColumnHeader>Category</Table.ColumnHeader>
              <Table.ColumnHeader>Priority</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Created</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Action</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tickets.length === 0 ? (
              <Table.Row><Table.Cell colSpan={6} textAlign="center" py={8} color="gray.500">No tickets found.</Table.Cell></Table.Row>
            ) : (
              tickets.map(t => (
                <Table.Row key={t.ticket_id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell fontWeight="medium">
                    {t.subject}
                    <Text fontSize="xs" color="gray.500">{t.description}</Text>
                  </Table.Cell>
                  <Table.Cell>{t.category}</Table.Cell>
                  <Table.Cell><PriorityBadge level={t.priority} /></Table.Cell>
                  <Table.Cell><StatusBadge status={t.status} /></Table.Cell>
                  <Table.Cell fontSize="sm" color="gray.500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button size="xs" variant="outline" onClick={() => handleViewTicket(t)}>
                      {isAdmin ? <><BsReply style={{ marginRight: '5px' }} /> Reply</> : <><BsEye style={{ marginRight: '5px' }} /> View</>}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Toaster />
      
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Support Center</Heading>
          <Text color="gray.600">
            {isAdmin ? "Manage support tickets and system compliance." : "Get help with your events and account."}
          </Text>
        </Box>
        {!isAdmin && (
          <Button colorPalette="blue" onClick={() => setIsCreateDialogOpen(true)}>
            <BsPlusCircle style={{ marginRight: '8px' }} /> Create Ticket
          </Button>
        )}
      </Flex>

      <Tabs.Root defaultValue="helpdesk" variant="line">
        <Tabs.List bg="white" p={2} borderRadius="md" shadow="sm" mb={6}>
          <Tabs.Trigger value="helpdesk"><BsHeadset style={{marginRight:'6px'}}/> {isAdmin ? 'Help Desk' : 'My Tickets'}</Tabs.Trigger>
          
          {isAdmin && (
            <>
              <Tabs.Trigger value="kyc"><BsPersonBadge style={{marginRight:'6px'}}/> KYC Verification</Tabs.Trigger>
              <Tabs.Trigger value="audit"><BsJournalText style={{marginRight:'6px'}}/> Audit Logs</Tabs.Trigger>
              <Tabs.Trigger value="compliance"><BsShieldLock style={{marginRight:'6px'}}/> Compliance</Tabs.Trigger>
            </>
          )}
        </Tabs.List>

        <Tabs.Content value="helpdesk">
           {isAdmin && (
             <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
               <Card.Root p={4} variant="subtle"><Stat.Root><Stat.Label>Open Tickets</Stat.Label><Stat.ValueText color="red.500">{ticketStats.open}</Stat.ValueText></Stat.Root></Card.Root>
               <Card.Root p={4} variant="subtle"><Stat.Root><Stat.Label>Resolved</Stat.Label><Stat.ValueText color="green.600">{ticketStats.resolved}</Stat.ValueText></Stat.Root></Card.Root>
               <Card.Root p={4} variant="subtle"><Stat.Root><Stat.Label>Total</Stat.Label><Stat.ValueText>{ticketStats.total}</Stat.ValueText></Stat.Root></Card.Root>
             </SimpleGrid>
           )}
           <TicketsView />
        </Tabs.Content>

        {/* --- PLACEHOLDER TABS --- */}
        {isAdmin && (
          <>
            <Tabs.Content value="kyc"><Box bg="white" p={4} borderRadius="lg"><Text color="gray.500">KYC Placeholder</Text></Box></Tabs.Content>
            <Tabs.Content value="audit"><Box bg="white" p={4} borderRadius="lg"><Text color="gray.500">Audit Placeholder</Text></Box></Tabs.Content>
            <Tabs.Content value="compliance"><Box bg="white" p={4} borderRadius="lg"><Text color="gray.500">Compliance Placeholder</Text></Box></Tabs.Content>
          </>
        )}
      </Tabs.Root>

      {/* --- CREATE TICKET DIALOG --- */}
      <Dialog.Root open={isCreateDialogOpen} onOpenChange={(e) => setIsCreateDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header><Dialog.Title>Create Support Ticket</Dialog.Title></Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Stack gap={1}>
                    <Text fontSize="sm" fontWeight="medium">Subject</Text>
                    <Input placeholder="Brief summary" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
                  </Stack>
                  <HStack gap={4}>
                    <Stack gap={1} flex={1}>
                      <Text fontSize="sm" fontWeight="medium">Category</Text>
                      <Select.Root collection={createListCollection({items: ['General', 'Billing', 'Technical', 'Event']})} value={[newCategory]} onValueChange={(e) => setNewCategory(e.value[0])}>
                        <Select.Trigger><Select.ValueText placeholder="Select" /></Select.Trigger>
                        <Select.Content>{['General', 'Billing', 'Technical', 'Event'].map(c => <Select.Item item={c} key={c}>{c}</Select.Item>)}</Select.Content>
                      </Select.Root>
                    </Stack>
                    <Stack gap={1} flex={1}>
                      <Text fontSize="sm" fontWeight="medium">Priority</Text>
                      <Select.Root collection={createListCollection({items: ['Low', 'Medium', 'High']})} value={[newPriority]} onValueChange={(e) => setNewPriority(e.value[0])}>
                        <Select.Trigger><Select.ValueText placeholder="Select" /></Select.Trigger>
                        <Select.Content>{['Low', 'Medium', 'High'].map(p => <Select.Item item={p} key={p}>{p}</Select.Item>)}</Select.Content>
                      </Select.Root>
                    </Stack>
                  </HStack>
                  <Stack gap={1}>
                    <Text fontSize="sm" fontWeight="medium">Description</Text>
                    <Textarea placeholder="Describe detail..." rows={4} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                  </Stack>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button colorPalette="blue" onClick={handleCreateTicket}>Submit</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* --- REPLY / VIEW DIALOG --- */}
      <Dialog.Root open={isReplyDialogOpen} onOpenChange={(e) => setIsReplyDialogOpen(e.open)} size="lg" scrollBehavior="inside">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxH="80vh">
              <Dialog.Header>
                <Dialog.Title>Ticket #{selectedTicket?.ticket_id.substring(0,8)}...</Dialog.Title>
                <StatusBadge status={selectedTicket?.status || ''} />
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  {/* Original Ticket Info */}
                  <Box bg="gray.50" p={4} borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
                    <Heading size="sm" mb={1}>{selectedTicket?.subject}</Heading>
                    <Text fontSize="sm" color="gray.700">{selectedTicket?.description}</Text>
                    <HStack fontSize="xs" color="gray.500" mt={2}>
                      <Text>{selectedTicket?.category}</Text>
                      <Text>•</Text>
                      <Text>{selectedTicket?.priority} Priority</Text>
                    </HStack>
                  </Box>

                  <Separator />

                  <VStack align="stretch" gap={3} my={2}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.500">Conversation History</Text>
                    
                    {isLoadingDetails ? (
                      <Center><Spinner size="sm" /></Center>
                    ) : !selectedTicket?.responses || selectedTicket.responses.length === 0 ? (
                      <Text fontSize="xs" color="gray.400" fontStyle="italic">No replies yet.</Text>
                    ) : (
                      selectedTicket.responses.map((response: any) => (
                        <Box 
                          key={response.response_id} 
                          alignSelf={response.user_id === user?.id ? 'flex-end' : 'flex-start'}
                          bg={response.user_id === user?.id ? 'blue.50' : 'gray.100'}
                          p={3}
                          borderRadius="md"
                          maxW="80%"
                        >
                          <HStack mb={1} justify="space-between" minW="150px">
                            <Text fontSize="xs" fontWeight="bold" color="gray.700">
                              {response.user_id === user?.id ? 'You' : (response.user?.name || 'Support')}
                            </Text>
                            <Text fontSize="10px" color="gray.400">
                              {new Date(response.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </Text>
                          </HStack>
                          <Text fontSize="sm">{response.message}</Text>
                        </Box>
                      ))
                    )}
                  </VStack>

                  <Separator />

                  {/* Reply Input Area */}
                  {selectedTicket?.status !== 'Resolved' && (
                    <Stack gap={2}>
                      <Text fontWeight="medium" fontSize="sm">
                        {isAdmin ? "Admin Reply" : "Add a Reply"}
                      </Text>
                      <Textarea 
                        placeholder="Type your response..." 
                        rows={3}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                      />
                    </Stack>
                  )}
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>Close</Button>
                {selectedTicket?.status !== 'Resolved' && (
                  <Button colorPalette="blue" onClick={handleSendResponse}>Send Reply</Button>
                )}
                {isAdmin && selectedTicket?.status !== 'Resolved' && (
                  <Button colorPalette="green" variant="surface" onClick={handleResolveTicket}>Mark Resolved</Button>
                )}
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

    </Box>
  );
}