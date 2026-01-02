'use client';

import { useState, useMemo } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Menu, Heading, Text, Flex, Dialog, Avatar, Portal,
  Input, Select, Tabs, HStack, Stack, Separator
} from '@chakra-ui/react';
import { createListCollection } from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsThreeDotsVertical, BsShieldCheck, BsSlashCircle, BsFileEarmarkText, BsX, 
  BsSearch, BsCreditCard, BsArrowUpCircle, BsKey 
} from 'react-icons/bs';
import { mockUsers, User, UserTier } from '@/public/data/UserData'; 

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  
  // -- Action Dialog States --
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isKYCDialogOpen, setIsKYCDialogOpen] = useState(false);

  // --- FILTERING LOGIC ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      const matchesTier = tierFilter === 'All' || user.tier === tierFilter;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [users, searchQuery, statusFilter, tierFilter]);

  const customers = filteredUsers.filter(u => u.role === 'Customer');
  const organizers = filteredUsers.filter(u => u.role === 'Organizer');

  // --- ACTIONS ---

  const handleStatusChange = (id: string, newStatus: User['status']) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    toaster.create({ title: `User ${newStatus}`, type: 'info', duration: 3000 });
  };

  const handleIssueCredit = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, walletBalance: u.walletBalance + 50 } : u));
    toaster.create({ title: 'Credit Issued (GH₵50)', type: 'success', duration: 3000 });
  };

  const handleResetPassword = (email: string) => {
    toaster.create({ title: `Password reset link sent to ${email}`, type: 'success', duration: 3000 });
  };

  const handleTierChange = (id: string, newTier: UserTier) => {
    setUsers(users.map(u => u.id === id ? { ...u, tier: newTier } : u));
    toaster.create({ title: `Membership updated to ${newTier}`, type: 'success', duration: 3000 });
  };

  // --- HELPER COMPONENTS ---

  const TierBadge = ({ tier }: { tier: UserTier }) => {
    const colors: Record<UserTier, string> = {
      'Free': 'gray',
      'Paradise+': 'purple',
      'Paradise X': 'yellow'
    };
    return <Badge colorPalette={colors[tier]}>{tier}</Badge>;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Active': 'green',
      'Suspended': 'red',
      'Pending': 'orange'
    };
    return <Badge colorPalette={colors[status] || 'gray'}>{status}</Badge>;
  };

  const UserRow = ({ user, isOrganizer = false }: { user: User, isOrganizer?: boolean }) => (
    <Table.Row key={user.id} _hover={{ bg: 'gray.50' }}>
      {/* Profile Info */}
      <Table.Cell>
        <Flex align="center" gap={3}>
          <Avatar.Root size="sm">
            <Avatar.Fallback name={user.name} />
          </Avatar.Root>
          <Box>
            <Text fontWeight="medium">{user.name}</Text>
            {isOrganizer && <Text fontSize="xs" fontWeight="bold" color="blue.600">{user.organizationName}</Text>}
            <Text fontSize="xs" color="gray.500">{user.email}</Text>
            <Text fontSize="xs" color="gray.500">{user.contact}</Text>
          </Box>
        </Flex>
      </Table.Cell>

      {/* Tier / Stats */}
      <Table.Cell>
        <Stack gap={1}>
           <TierBadge tier={user.tier} />
           {!isOrganizer && (
             <Text fontSize="xs" color="gray.500">
               {user.ticketsPurchased} Tix • {user.bundlesRedeemed} Bundles
             </Text>
           )}
        </Stack>
      </Table.Cell>

      {/* Status */}
      <Table.Cell>
        <StatusBadge status={user.status} />
      </Table.Cell>

      {/* Actions */}
      <Table.Cell textAlign="right">
        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton variant="ghost" size="sm" aria-label="Options">
              <BsThreeDotsVertical />
            </IconButton>
          </Menu.Trigger>
          <Menu.Content>
            {/* Common Actions */}
            <Menu.Item value="kyc" onClick={() => { setSelectedUser(user); setIsKYCDialogOpen(true); }}>
               <BsFileEarmarkText style={{ marginRight: '8px' }} /> View Profile / KYC
            </Menu.Item>
            
            <Menu.Item value="password" onClick={() => handleResetPassword(user.email)}>
               <BsKey style={{ marginRight: '8px' }} /> Reset Password
            </Menu.Item>

            <Separator my={1} />

            {/* Customer Specific Actions */}
            {!isOrganizer && (
              <>
                <Menu.Item value="credit" onClick={() => handleIssueCredit(user.id)}>
                   <BsCreditCard style={{ marginRight: '8px' }} /> Issue Credit
                </Menu.Item>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Menu.Item value="upgrade">
                      <BsArrowUpCircle style={{ marginRight: '8px' }} /> Change Membership
                    </Menu.Item>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item value="free" onClick={() => handleTierChange(user.id, 'Free')}>Downgrade to Free</Menu.Item>
                    <Menu.Item value="plus" onClick={() => handleTierChange(user.id, 'Paradise+')}>Upgrade to Paradise+</Menu.Item>
                    <Menu.Item value="x" onClick={() => handleTierChange(user.id, 'Paradise X')}>Upgrade to Paradise X</Menu.Item>
                  </Menu.Content>
                </Menu.Root>
              </>
            )}

            {/* Organizer Specific Actions */}
            {isOrganizer && user.status === 'Pending' && (
               <Menu.Item value="approve" color="green.600" onClick={() => handleStatusChange(user.id, 'Active')}>
                  <BsShieldCheck style={{ marginRight: '8px' }} /> Verify & Approve
               </Menu.Item>
            )}

            <Separator my={1} />

            {/* Suspend / Activate */}
            <Menu.Item 
              value="suspend"
              color={user.status === 'Active' ? "red.500" : "green.500"}
              onClick={() => handleStatusChange(user.id, user.status === 'Active' ? 'Suspended' : 'Active')}
            >
              <BsSlashCircle style={{ marginRight: '8px' }} /> 
              {user.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
            </Menu.Item>

          </Menu.Content>
        </Menu.Root>
      </Table.Cell>
    </Table.Row>
  );

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Toaster/>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">User Management</Heading>
          <Text color="gray.600">Manage customers, organizers, and memberships.</Text>
        </Box>
        <Button colorPalette="blue">Add New User</Button>
      </Flex>

      {/* Filters & Search Bar */}
      <Flex gap={4} mb={6} bg="white" p={4} borderRadius="md" shadow="sm" wrap="wrap">
        <Box flex="1" minW="200px">
           {/* Search Input Group */}
           <HStack gap={2} border="1px solid" borderColor="gray.200" borderRadius="md" px={3} py={2}>
              <BsSearch color="gray" />
              <Input 
                variant="flushed" 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </HStack>
        </Box>
        
        <Select.Root collection={createListCollection({ items: [{label: 'All', value: 'All'}, {label: 'Active', value: 'Active'}, {label: 'Suspended', value: 'Suspended'}, {label: 'Pending', value: 'Pending'}] })} 
            value={[statusFilter]} onValueChange={(e) => setStatusFilter(e.value[0])} width="200px">
           <Select.Trigger>
             <Select.ValueText placeholder="Filter Status" />
           </Select.Trigger>
           <Select.Content>
              {['All', 'Active', 'Suspended', 'Pending'].map(s => (
                <Select.Item item={s} key={s}>
                   {s}
                </Select.Item>
              ))}
           </Select.Content>
        </Select.Root>

         <Select.Root collection={createListCollection({ items: [{label: 'All Tiers', value: 'All'}, {label: 'Free', value: 'Free'}, {label: 'Paradise+', value: 'Paradise+'}, {label: 'Paradise X', value: 'Paradise X'}] })} 
            value={[tierFilter]} onValueChange={(e) => setTierFilter(e.value[0])} width="200px">
           <Select.Trigger>
             <Select.ValueText placeholder="Filter Tier" />
           </Select.Trigger>
           <Select.Content>
              {['All', 'Free', 'Paradise+', 'Paradise X'].map(t => (
                <Select.Item item={t} key={t}>{t}</Select.Item>
              ))}
           </Select.Content>
        </Select.Root>
      </Flex>

      {/* TABS: Customers vs Organizers */}
      <Tabs.Root defaultValue="customers">
        <Tabs.List bg="white" borderRadius="md" shadow="sm" p={1} mb={4}>
          <Tabs.Trigger value="customers" flex="1">All Customers</Tabs.Trigger>
          <Tabs.Trigger value="organizers" flex="1">Event Organizers</Tabs.Trigger>
        </Tabs.List>

        <Box bg="white" borderRadius="lg" shadow="sm" overflowX="auto">
          {/* CUSTOMERS TAB */}
          <Tabs.Content value="customers" p={0}>
             <Table.Root>
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader width="40%">Profile</Table.ColumnHeader>
                  <Table.ColumnHeader>Membership & Stats</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {customers.map(user => <UserRow key={user.id} user={user} />)}
                {customers.length === 0 && (
                   <Table.Row><Table.Cell colSpan={4} textAlign="center">No customers found.</Table.Cell></Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Tabs.Content>

          {/* ORGANIZERS TAB */}
          <Tabs.Content value="organizers" p={0}>
             <Table.Root>
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader width="40%">Organizer Details</Table.ColumnHeader>
                  <Table.ColumnHeader>Tier</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {organizers.map(user => <UserRow key={user.id} user={user} isOrganizer />)}
                {organizers.length === 0 && (
                   <Table.Row><Table.Cell colSpan={4} textAlign="center">No organizers found.</Table.Cell></Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Tabs.Content>
        </Box>
      </Tabs.Root>

      {/* Simple Placeholder Dialog for KYC/Profile View */}
      <Dialog.Root open={isKYCDialogOpen} onOpenChange={(e) => setIsKYCDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>User Profile</Dialog.Title>
                <Dialog.CloseTrigger />
              </Dialog.Header>
              <Dialog.Body>
                 {selectedUser && (
                   <Stack gap={4}>
                      <Flex align="center" gap={4}>
                        <Avatar.Root size="lg"><Avatar.Fallback name={selectedUser.name}/></Avatar.Root>
                        <Box>
                          <Heading size="sm">{selectedUser.name}</Heading>
                          <Text color="gray.500">{selectedUser.email}</Text>
                          <TierBadge tier={selectedUser.tier} />
                        </Box>
                      </Flex>
                      <Separator />
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Wallet Balance:</Text>
                        <Text>GH₵{selectedUser.walletBalance}</Text>
                      </Flex>
                      <Flex justify="space-between">
                         <Text fontWeight="medium">Joined:</Text>
                         <Text>Dec 1, 2025</Text>
                      </Flex>
                   </Stack>
                 )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

    </Box>
  );
}