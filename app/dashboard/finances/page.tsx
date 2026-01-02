'use client';

import { useState } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Menu, Heading, Text, Flex, 
  Dialog, Stack, Tabs, SimpleGrid, Card, Stat, Portal, Separator
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsThreeDotsVertical, BsCheckCircle, BsXCircle, BsBank, BsArrowRightCircle, 
  BsCurrencyDollar, BsWallet2, BsGraphUpArrow, BsExclamationTriangle 
} from 'react-icons/bs';
import { 
  mockPayouts, mockRefunds, mockPartnerships, Payout, RefundRequest 
} from '@/public/data/FinancesPlaceholders';

export default function FinancesPage() {
  const [payouts, setPayouts] = useState(mockPayouts);
  const [refunds, setRefunds] = useState(mockRefunds);
  
  // -- ACTION HANDLERS --

  const handleApprovePayout = (id: string) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Processing' } : p));
    toaster.create({ title: 'Payout Approved', description: 'Funds are now processing.', type: 'success' });
  };

  const handleRefundAction = (id: string, action: 'Approved' | 'Rejected') => {
    setRefunds(refunds.map(r => r.id === id ? { ...r, status: action } : r));
    toaster.create({ 
      title: `Refund ${action}`, 
      type: action === 'Approved' ? 'success' : 'error' 
    });
  };

  // -- HELPERS --

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Paid': 'green',
      'Processing': 'blue',
      'Pending': 'orange',
      'Hold': 'red',
      'Approved': 'green',
      'Requested': 'purple',
      'Disputed': 'red',
      'Active': 'teal',
      'Negotiating': 'gray'
    };
    return <Badge colorPalette={colors[status] || 'gray'}>{status}</Badge>;
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      
      {/* 1. Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Finance Management</Heading>
          <Text color="gray.600">Track revenue, manage payouts, and handle disputes.</Text>
        </Box>
        <Button colorPalette="blue">Download Financial Report</Button>
      </Flex>

      {/* 2. REVENUE DASHBOARD (Top Stats) */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={6} mb={8}>
        <Card.Root p={4} variant="elevated">
          <Stat.Root>
            <Flex justify="space-between">
              <Stat.Label>Gross Sales</Stat.Label>
              <Box p={2} bg="green.100" borderRadius="md" color="green.600"><BsCurrencyDollar /></Box>
            </Flex>
            <Stat.ValueText>GH₵ 450k</Stat.ValueText>
            <Stat.HelpText color="green.600"><BsGraphUpArrow style={{display: 'inline'}} /> +12% this month</Stat.HelpText>
          </Stat.Root>
        </Card.Root>

        <Card.Root p={4} variant="elevated">
          <Stat.Root>
            <Flex justify="space-between">
              <Stat.Label>Net Commissions</Stat.Label>
              <Box p={2} bg="blue.100" borderRadius="md" color="blue.600"><BsWallet2 /></Box>
            </Flex>
            <Stat.ValueText>GH₵ 22.5k</Stat.ValueText>
            <Stat.HelpText>Platform revenue</Stat.HelpText>
          </Stat.Root>
        </Card.Root>

        <Card.Root p={4} variant="elevated">
          <Stat.Root>
            <Flex justify="space-between">
              <Stat.Label>Pending Settlements</Stat.Label>
              <Box p={2} bg="orange.100" borderRadius="md" color="orange.600"><BsBank /></Box>
            </Flex>
            <Stat.ValueText>GH₵ 56k</Stat.ValueText>
            <Stat.HelpText>Scheduled for next week</Stat.HelpText>
          </Stat.Root>
        </Card.Root>

        <Card.Root p={4} variant="elevated">
           <Stat.Root>
            <Flex justify="space-between">
              <Stat.Label>Partnership Revenue</Stat.Label>
              <Box p={2} bg="purple.100" borderRadius="md" color="purple.600"><BsGraphUpArrow /></Box>
            </Flex>
            <Stat.ValueText>GH₵ 48.5k</Stat.ValueText>
            <Stat.HelpText>Sponsorships & Banking</Stat.HelpText>
          </Stat.Root>
        </Card.Root>
      </SimpleGrid>

      {/* 3. TABS: Detailed Management */}
      <Tabs.Root defaultValue="payouts" variant="line">
        <Tabs.List bg="white" p={2} borderRadius="md" shadow="sm" mb={6}>
          <Tabs.Trigger value="payouts">Organizer Payouts</Tabs.Trigger>
          <Tabs.Trigger value="refunds">Refunds & Disputes</Tabs.Trigger>
          <Tabs.Trigger value="partners">Partnerships</Tabs.Trigger>
        </Tabs.List>

        {/* --- TAB 1: ORGANIZER PAYOUTS --- */}
        <Tabs.Content value="payouts">
          <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
            <Table.Root>
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader>Organizer / Event</Table.ColumnHeader>
                  <Table.ColumnHeader>Gross Amount</Table.ColumnHeader>
                  <Table.ColumnHeader>Commission</Table.ColumnHeader>
                  <Table.ColumnHeader>Net Payout</Table.ColumnHeader>
                  <Table.ColumnHeader>Scheduled</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Action</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {payouts.map((p) => (
                  <Table.Row key={p.id}>
                    <Table.Cell>
                      <Text fontWeight="bold">{p.organizer}</Text>
                      <Text fontSize="xs" color="gray.500">{p.eventName}</Text>
                    </Table.Cell>
                    <Table.Cell>GH₵ {p.amount.toLocaleString()}</Table.Cell>
                    <Table.Cell color="red.500">- GH₵ {p.commission.toLocaleString()}</Table.Cell>
                    <Table.Cell fontWeight="bold">GH₵ {p.netPayout.toLocaleString()}</Table.Cell>
                    <Table.Cell>{p.dateScheduled}</Table.Cell>
                    <Table.Cell><StatusBadge status={p.status} /></Table.Cell>
                    <Table.Cell textAlign="right">
                      {p.status === 'Pending' ? (
                         <Button size="xs" colorPalette="blue" onClick={() => handleApprovePayout(p.id)}>
                           Approve
                         </Button>
                      ) : (
                         <Button size="xs" variant="ghost" disabled>View Receipt</Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Tabs.Content>

        {/* --- TAB 2: REFUNDS & DISPUTES --- */}
        <Tabs.Content value="refunds">
          <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
            <Table.Root>
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader>Request ID</Table.ColumnHeader>
                  <Table.ColumnHeader>User</Table.ColumnHeader>
                  <Table.ColumnHeader>Reason</Table.ColumnHeader>
                  <Table.ColumnHeader>Amount</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Decisions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {refunds.map((r) => (
                  <Table.Row key={r.id}>
                    <Table.Cell>#{r.id.toUpperCase()}</Table.Cell>
                    <Table.Cell>
                      <Text fontWeight="medium">{r.user}</Text>
                      <Text fontSize="xs" color="gray.500">{r.event}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      {r.status === 'Disputed' && <BsExclamationTriangle color="red" style={{display:'inline', marginRight:'5px'}} />}
                      {r.reason}
                    </Table.Cell>
                    <Table.Cell>GH₵ {r.amount}</Table.Cell>
                    <Table.Cell><StatusBadge status={r.status} /></Table.Cell>
                    <Table.Cell textAlign="right">
                      {r.status === 'Requested' || r.status === 'Disputed' ? (
                        <Flex justify="end" gap={2}>
                          <IconButton 
                            size="xs" colorPalette="green" aria-label="Approve" 
                            onClick={() => handleRefundAction(r.id, 'Approved')}
                          >
                            <BsCheckCircle />
                          </IconButton>
                          <IconButton 
                            size="xs" colorPalette="red" aria-label="Reject"
                            onClick={() => handleRefundAction(r.id, 'Rejected')}
                          >
                            <BsXCircle />
                          </IconButton>
                        </Flex>
                      ) : (
                        <Text fontSize="xs" color="gray.400">Closed</Text>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Tabs.Content>

        {/* --- TAB 3: PARTNERSHIPS --- */}
        <Tabs.Content value="partners">
           <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
             {mockPartnerships.map(deal => (
               <Card.Root key={deal.id} variant="subtle" borderLeft="4px solid" borderColor={deal.status === 'Active' ? 'teal.400' : 'gray.400'}>
                 <Card.Body>
                   <Flex justify="space-between" mb={2}>
                     <Badge colorPalette={deal.type === 'Banking' ? 'blue' : deal.type === 'Sponsorship' ? 'purple' : 'orange'}>
                       {deal.type}
                     </Badge>
                     <StatusBadge status={deal.status} />
                   </Flex>
                   <Heading size="md" mb={1}>{deal.partner}</Heading>
                   <Text color="gray.500" fontSize="sm" mb={4}>Renewal: {deal.renewalDate}</Text>
                   
                   <Separator mb={3} />
                   
                   <Stat.Root>
                     <Stat.Label>Revenue Generated</Stat.Label>
                     <Stat.ValueText fontSize="xl">GH₵ {deal.revenueGenerated.toLocaleString()}</Stat.ValueText>
                   </Stat.Root>
                   
                   <Button variant="outline" size="sm" width="full" mt={4}>View Contract</Button>
                 </Card.Body>
               </Card.Root>
             ))}
           </SimpleGrid>
        </Tabs.Content>

      </Tabs.Root>

    </Box>
  );
}