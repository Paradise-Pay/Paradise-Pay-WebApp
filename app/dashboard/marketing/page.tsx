'use client';

import { useState } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Menu, Heading, Text, Flex, 
  Dialog, Input, Stack, Select, Tabs, Card, Stat, SimpleGrid, 
  Progress, Portal, Separator, Textarea, HStack, createListCollection
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsThreeDotsVertical, BsEnvelope, BsChatLeftText, BsMegaphone, 
  BsTag, BsGraphUp, BsTrophy, BsPlusCircle, BsSend 
} from 'react-icons/bs';
import { 
  mockCampaigns, mockPromos, mockTierStats, Campaign 
} from '@/public/data/MarketingData';

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [promos, setPromos] = useState(mockPromos);

  // -- Modal States --
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [newCampaignChannel, setNewCampaignChannel] = useState('Email');

  // -- Collections --
  const audienceCollection = createListCollection({
    items: [
      { label: 'All Users', value: 'All' },
      { label: 'VIPs', value: 'VIP' }
    ]
  });

  // --- ACTIONS ---

  const handleSendCampaign = (id: string) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: 'Sent' } : c));
    toaster.create({ title: 'Campaign Sent!', type: 'success' });
  };

  const handleCreatePromo = () => {
    // Mock creation
    toaster.create({ title: 'Promo Code Created', type: 'success' });
  };

  // --- HELPERS ---

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Sent': 'green',
      'Scheduled': 'blue',
      'Draft': 'gray',
      'Active': 'teal',
      'Expired': 'red',
      'Disabled': 'gray'
    };
    return <Badge colorPalette={colors[status]}>{status}</Badge>;
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Marketing & Campaigns</Heading>
          <Text color="gray.600">Engage users, manage coupons, and track loyalty growth.</Text>
        </Box>
        <Button colorPalette="blue" onClick={() => setIsCampaignModalOpen(true)}>
          <BsPlusCircle style={{ marginRight: '8px' }} /> Create Campaign
        </Button>
      </Flex>

      {/* Tabs Layout */}
      <Tabs.Root defaultValue="campaigns" variant="enclosed">
        <Tabs.List mb={4}>
          <Tabs.Trigger value="campaigns"><BsMegaphone style={{ marginRight:'5px' }}/> Campaigns</Tabs.Trigger>
          <Tabs.Trigger value="promos"><BsTag style={{ marginRight:'5px' }}/> Promo Codes</Tabs.Trigger>
          <Tabs.Trigger value="loyalty"><BsTrophy style={{ marginRight:'5px' }}/> Loyalty & Tiers</Tabs.Trigger>
        </Tabs.List>

        {/* --- TAB 1: EMAIL & SMS CAMPAIGNS --- */}
        <Tabs.Content value="campaigns" p={0}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
             <Card.Root p={4} variant="subtle">
               <Stat.Root>
                 <Stat.Label>Total Reach</Stat.Label>
                 <Stat.ValueText>34.5k</Stat.ValueText>
                 <Stat.HelpText>Users contacted this month</Stat.HelpText>
               </Stat.Root>
             </Card.Root>
             <Card.Root p={4} variant="subtle">
               <Stat.Root>
                 <Stat.Label>Avg. Open Rate</Stat.Label>
                 <Stat.ValueText color="blue.600">42%</Stat.ValueText>
                 <Stat.HelpText>Industry avg: 21%</Stat.HelpText>
               </Stat.Root>
             </Card.Root>
             <Card.Root p={4} variant="subtle">
               <Stat.Root>
                 <Stat.Label>Campaigns Sent</Stat.Label>
                 <Stat.ValueText>12</Stat.ValueText>
                 <Stat.HelpText>3 Scheduled</Stat.HelpText>
               </Stat.Root>
             </Card.Root>
          </SimpleGrid>

          <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
            <Table.Root>
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader>Campaign Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Channel</Table.ColumnHeader>
                  <Table.ColumnHeader>Audience</Table.ColumnHeader>
                  <Table.ColumnHeader>Reach / Open Rate</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Action</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {campaigns.map((c) => (
                  <Table.Row key={c.id}>
                    <Table.Cell fontWeight="medium">{c.name}</Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap={2}>
                        {c.channel === 'Email' ? <BsEnvelope /> : <BsChatLeftText />} 
                        {c.channel}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell color="gray.500">{c.audience}</Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm">{c.recipients.toLocaleString()} recipients</Text>
                      {c.openRate && (
                         <Text fontSize="xs" color="green.600">{c.openRate}% Open Rate</Text>
                      )}
                    </Table.Cell>
                    <Table.Cell><StatusBadge status={c.status} /></Table.Cell>
                    <Table.Cell textAlign="right">
                      {c.status === 'Draft' || c.status === 'Scheduled' ? (
                        <Button size="xs" variant="outline" colorPalette="blue" onClick={() => handleSendCampaign(c.id)}>
                           <BsSend style={{ marginRight: '5px' }} /> Send Now
                        </Button>
                      ) : (
                        <Button size="xs" variant="ghost">View Report</Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Tabs.Content>

        {/* --- TAB 2: PROMO CODES --- */}
        <Tabs.Content value="promos" p={0}>
          <Box bg="white" borderRadius="lg" shadow="sm" p={4}>
            <Flex justify="space-between" mb={4}>
              <Heading size="md">Active Coupons</Heading>
              <Button size="sm" variant="surface" onClick={handleCreatePromo}>+ New Code</Button>
            </Flex>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Code</Table.ColumnHeader>
                  <Table.ColumnHeader>Discount</Table.ColumnHeader>
                  <Table.ColumnHeader width="30%">Usage</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Options</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {promos.map(p => (
                  <Table.Row key={p.id}>
                    <Table.Cell>
                      <Badge variant="solid" colorPalette="purple" fontSize="md">{p.code}</Badge>
                    </Table.Cell>
                    <Table.Cell fontWeight="bold">{p.discount}</Table.Cell>
                    <Table.Cell>
                      <Text fontSize="xs" mb={1}>{p.uses} / {p.maxUses} used</Text>
                      <Progress.Root value={(p.uses / p.maxUses) * 100} size="sm" colorPalette="purple">
                        <Progress.Track>
                          <Progress.Range />
                        </Progress.Track>
                      </Progress.Root>
                    </Table.Cell>
                    <Table.Cell><StatusBadge status={p.status} /></Table.Cell>
                    <Table.Cell textAlign="right">
                      <IconButton variant="ghost" size="sm" aria-label="Edit">
                        <BsThreeDotsVertical />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Tabs.Content>

        {/* --- TAB 3: LOYALTY & TIERS --- */}
        <Tabs.Content value="loyalty">
          <Stack gap={6}>
             {/* 1. Loyalty Stats */}
             <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
               <Card.Root bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
                 <Card.Body>
                   <Stat.Root>
                     <Stat.Label color="whiteAlpha.800">Total Paradise Miles Earned</Stat.Label>
                     <Stat.ValueText fontSize="4xl">2,450,000</Stat.ValueText>
                     <Stat.HelpText color="whiteAlpha.900">Life-time issuance</Stat.HelpText>
                   </Stat.Root>
                 </Card.Body>
               </Card.Root>

               <Card.Root bg="linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)" color="white">
                 <Card.Body>
                   <Stat.Root>
                     <Stat.Label color="whiteAlpha.800">Miles Redeemed</Stat.Label>
                     <Stat.ValueText fontSize="4xl">890,500</Stat.ValueText>
                     <Stat.HelpText color="whiteAlpha.900">For discounts & upgrades</Stat.HelpText>
                   </Stat.Root>
                 </Card.Body>
               </Card.Root>
             </SimpleGrid>

             {/* 2. Tier Conversions */}
             <Box bg="white" borderRadius="lg" shadow="sm" p={6}>
               <Heading size="md" mb={6}><BsGraphUp style={{ display: 'inline', marginRight: '8px' }}/> Membership Upgrades</Heading>
               
               <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
                 {mockTierStats.map((stat, idx) => (
                   <Box key={idx} border="1px solid" borderColor="gray.100" p={4} borderRadius="md">
                     <Text color="gray.500" fontSize="sm" mb={2}>Upgrade Path</Text>
                     <Heading size="sm" mb={4}>{stat.path}</Heading>
                     
                     <HStack justify="space-between" mb={2}>
                       <Text fontWeight="bold" fontSize="2xl">{stat.count}</Text>
                       <Badge colorPalette="green">+ GH₵ {stat.revenue.toLocaleString()}</Badge>
                     </HStack>
                     <Text fontSize="xs" color="gray.400">Total conversions this year</Text>
                   </Box>
                 ))}
               </SimpleGrid>
             </Box>
          </Stack>
        </Tabs.Content>

      </Tabs.Root>

      {/* CREATE CAMPAIGN MODAL */}
      <Dialog.Root open={isCampaignModalOpen} onOpenChange={(e) => setIsCampaignModalOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Create New Campaign</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Campaign Name</Text>
                    <Input placeholder="e.g. Easter Special" />
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Channel</Text>
                    <HStack>
                      <Button 
                        variant={newCampaignChannel === 'Email' ? 'solid' : 'outline'} 
                        onClick={() => setNewCampaignChannel('Email')}
                        colorPalette="blue" flex={1}
                      >
                        Email
                      </Button>
                      <Button 
                        variant={newCampaignChannel === 'SMS' ? 'solid' : 'outline'} 
                        onClick={() => setNewCampaignChannel('SMS')}
                        colorPalette="blue" flex={1}
                      >
                        SMS
                      </Button>
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Audience</Text>
                    <Select.Root collection={audienceCollection}>
                        <Select.Trigger><Select.ValueText placeholder="Select Audience" /></Select.Trigger>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Message Content</Text>
                    <Textarea placeholder="Type your message here..." rows={4} />
                  </Box>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsCampaignModalOpen(false)}>Cancel</Button>
                <Button colorPalette="blue">Schedule Blast</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

    </Box>
  );
}