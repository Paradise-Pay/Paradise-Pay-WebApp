'use client';

import { useState } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Heading, Text, Flex, 
  Tabs, SimpleGrid, Card, Stat, HStack, Stack, 
  Dialog, Textarea, Portal, Separator
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsHeadset, BsPersonBadge, BsShieldLock, BsJournalText, 
  BsCheckCircle, BsXCircle, BsEye, BsReply, BsClockHistory 
} from 'react-icons/bs';
import { 
  mockTickets, mockKYC, mockAuditLogs, mockCompliance, Ticket 
} from '@/public/data/SupportData';

export default function SupportPage() {
  const [tickets, setTickets] = useState(mockTickets);
  const [kycRequests, setKycRequests] = useState(mockKYC);
  
  // -- State for Ticket Reply --
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // --- ACTIONS ---

  const handleResolveTicket = () => {
    if (selectedTicket) {
      setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'Resolved' } : t));
      setIsTicketDialogOpen(false);
      setReplyMessage('');
      toaster.create({ title: 'Ticket Resolved', type: 'success' });
    }
  };

  const handleKYCAction = (id: string, action: 'Approved' | 'Rejected') => {
    setKycRequests(kycRequests.map(k => k.id === id ? { ...k, status: action } : k));
    toaster.create({ title: `Organizer ${action}`, type: action === 'Approved' ? 'success' : 'error' });
  };

  // --- HELPERS ---

  const PriorityBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = { 'High': 'red', 'Medium': 'orange', 'Low': 'gray' };
    return <Badge colorPalette={colors[level]} variant="subtle">{level}</Badge>;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Open': 'red', 'In Progress': 'blue', 'Resolved': 'green',
      'Pending': 'orange', 'Approved': 'green', 'Rejected': 'red',
      'Pass': 'green', 'Fail': 'red', 'Warning': 'orange'
    };
    return <Badge colorPalette={colors[status]}>{status}</Badge>;
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Support & Compliance</Heading>
          <Text color="gray.600">Resolve issues, verify identities, and monitor system integrity.</Text>
        </Box>
      </Flex>

      <Tabs.Root defaultValue="helpdesk" variant="line">
        <Tabs.List bg="white" p={2} borderRadius="md" shadow="sm" mb={6}>
          <Tabs.Trigger value="helpdesk"><BsHeadset style={{marginRight:'6px'}}/> Help Desk</Tabs.Trigger>
          <Tabs.Trigger value="kyc"><BsPersonBadge style={{marginRight:'6px'}}/> KYC Verification</Tabs.Trigger>
          <Tabs.Trigger value="audit"><BsJournalText style={{marginRight:'6px'}}/> Audit Logs</Tabs.Trigger>
          <Tabs.Trigger value="compliance"><BsShieldLock style={{marginRight:'6px'}}/> Compliance</Tabs.Trigger>
        </Tabs.List>

        {/* --- TAB 1: HELP DESK --- */}
        <Tabs.Content value="helpdesk">
           <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
             <Card.Root p={4} variant="subtle"><Stat.Root><Stat.Label>Open Tickets</Stat.Label><Stat.ValueText color="red.500">12</Stat.ValueText></Stat.Root></Card.Root>
             <Card.Root p={4} variant="subtle"><Stat.Root><Stat.Label>Avg. Response Time</Stat.Label><Stat.ValueText>45 mins</Stat.ValueText></Stat.Root></Card.Root>
             <Card.Root p={4} variant="subtle"><Stat.Root><Stat.Label>Customer Satisfaction</Stat.Label><Stat.ValueText color="green.600">4.8/5</Stat.ValueText></Stat.Root></Card.Root>
           </SimpleGrid>

           <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
             <Table.Root >
               <Table.Header bg="gray.50">
                 <Table.Row>
                   <Table.ColumnHeader>ID</Table.ColumnHeader>
                   <Table.ColumnHeader>User</Table.ColumnHeader>
                   <Table.ColumnHeader>Subject</Table.ColumnHeader>
                   <Table.ColumnHeader>Priority</Table.ColumnHeader>
                   <Table.ColumnHeader>Status</Table.ColumnHeader>
                   <Table.ColumnHeader textAlign="right">Action</Table.ColumnHeader>
                 </Table.Row>
               </Table.Header>
               <Table.Body>
                 {tickets.map(t => (
                   <Table.Row key={t.id} _hover={{ bg: 'gray.50' }}>
                     <Table.Cell fontWeight="bold">{t.id}</Table.Cell>
                     <Table.Cell>{t.user}</Table.Cell>
                     <Table.Cell>
                       <Text fontSize="sm">{t.subject}</Text>
                       <Text fontSize="xs" color="gray.500">{t.category} • {t.submitted}</Text>
                     </Table.Cell>
                     <Table.Cell><PriorityBadge level={t.priority} /></Table.Cell>
                     <Table.Cell><StatusBadge status={t.status} /></Table.Cell>
                     <Table.Cell textAlign="right">
                       <Button size="xs" variant="outline" onClick={() => { setSelectedTicket(t); setIsTicketDialogOpen(true); }}>
                         <BsReply style={{ marginRight: '5px' }} /> Reply
                       </Button>
                     </Table.Cell>
                   </Table.Row>
                 ))}
               </Table.Body>
             </Table.Root>
           </Box>
        </Tabs.Content>

        {/* --- TAB 2: KYC VERIFICATION --- */}
        <Tabs.Content value="kyc">
           <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
             <Table.Root >
               <Table.Header bg="gray.50">
                 <Table.Row>
                   <Table.ColumnHeader>Organizer Name</Table.ColumnHeader>
                   <Table.ColumnHeader>Document Type</Table.ColumnHeader>
                   <Table.ColumnHeader>Submitted</Table.ColumnHeader>
                   <Table.ColumnHeader>Status</Table.ColumnHeader>
                   <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                 </Table.Row>
               </Table.Header>
               <Table.Body>
                 {kycRequests.map(k => (
                   <Table.Row key={k.id}>
                     <Table.Cell fontWeight="medium">{k.organizer}</Table.Cell>
                     <Table.Cell>{k.docType}</Table.Cell>
                     <Table.Cell>{k.submittedDate}</Table.Cell>
                     <Table.Cell><StatusBadge status={k.status} /></Table.Cell>
                     <Table.Cell textAlign="right">
                       {k.status === 'Pending' ? (
                         <Flex justify="end" gap={2}>
                           <Button size="xs" variant="ghost"><BsEye /> View Doc</Button>
                           <IconButton size="xs" colorPalette="green" onClick={() => handleKYCAction(k.id, 'Approved')}><BsCheckCircle /></IconButton>
                           <IconButton size="xs" colorPalette="red" onClick={() => handleKYCAction(k.id, 'Rejected')}><BsXCircle /></IconButton>
                         </Flex>
                       ) : (
                         <Text fontSize="xs" color="gray.400">Processed</Text>
                       )}
                     </Table.Cell>
                   </Table.Row>
                 ))}
               </Table.Body>
             </Table.Root>
           </Box>
        </Tabs.Content>

        {/* --- TAB 3: AUDIT LOGS --- */}
        <Tabs.Content value="audit">
          <Box bg="white" borderRadius="lg" shadow="sm">
            <Table.Root size="sm" striped>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Timestamp</Table.ColumnHeader>
                  <Table.ColumnHeader>Admin User</Table.ColumnHeader>
                  <Table.ColumnHeader>Action Taken</Table.ColumnHeader>
                  <Table.ColumnHeader>Target</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {mockAuditLogs.map(log => (
                  <Table.Row key={log.id}>
                    <Table.Cell fontFamily="mono" fontSize="xs" color="gray.500">{log.timestamp}</Table.Cell>
                    <Table.Cell fontWeight="medium">{log.admin}</Table.Cell>
                    <Table.Cell>{log.action}</Table.Cell>
                    <Table.Cell color="blue.600">{log.target}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Tabs.Content>

        {/* --- TAB 4: COMPLIANCE MONITOR --- */}
        <Tabs.Content value="compliance">
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {mockCompliance.map(check => (
              <Card.Root key={check.id} borderTop="4px solid" borderColor={check.status === 'Pass' ? 'green.400' : check.status === 'Fail' ? 'red.500' : 'orange.400'}>
                <Card.Body>
                  <Flex justify="space-between" mb={3}>
                    <StatusBadge status={check.status} />
                    <BsShieldLock size={20} color="gray" />
                  </Flex>
                  <Heading size="md" mb={2}>{check.name}</Heading>
                  <HStack color="gray.500" fontSize="sm">
                    <BsClockHistory />
                    <Text>Last run: {check.lastRun}</Text>
                  </HStack>
                  <Button variant="outline" size="sm" width="full" mt={4}>View Detailed Report</Button>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Tabs.Content>

      </Tabs.Root>

      {/* Ticket Reply Dialog */}
      <Dialog.Root open={isTicketDialogOpen} onOpenChange={(e) => setIsTicketDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Reply to Ticket #{selectedTicket?.id}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontWeight="bold" fontSize="sm">{selectedTicket?.subject}</Text>
                    <Text fontSize="sm" color="gray.600" mt={1}>User asks: "I need help with..."</Text>
                  </Box>
                  <Textarea 
                    placeholder="Type your reply here..." 
                    rows={4}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsTicketDialogOpen(false)}>Cancel</Button>
                <Button colorPalette="blue" onClick={handleResolveTicket}>Send & Resolve</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

    </Box>
  );
}