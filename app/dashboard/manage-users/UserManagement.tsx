'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Menu, Heading, Text, Flex, Dialog, Avatar, Portal,
  Input, Select, Tabs, HStack, Stack, Separator, Spinner, Center
} from '@chakra-ui/react';
import { createListCollection } from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsThreeDotsVertical, BsShieldCheck, BsSlashCircle, BsFileEarmarkText, 
  BsSearch, BsCreditCard, BsArrowUpCircle, BsKey 
} from 'react-icons/bs';
import { getAllUsers, updateUserPlan } from '@/lib/api';

// --- Types ---

// UI-specific User Interface
export type UserTier = 'Free' | 'Paradise+' | 'Paradise X';

export interface User {
  id: string;
  name: string;
  email: string;
  organizationName?: string;
  role: 'User' | 'Organizer' | 'Admin'; 
  status: 'Active' | 'Suspended' | 'Pending';
  tier: UserTier;
  walletBalance: number;
  contact: string;
  ticketsPurchased: number; // Placeholder for stats
  bundlesRedeemed: number;  // Placeholder for stats
  avatar?: string;
  joinedAt: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  
  // Action Dialog States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isKYCDialogOpen, setIsKYCDialogOpen] = useState(false);

  // --- DATA FETCHING ---

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      
      if (response.success && response.data && Array.isArray(response.data.users)) {
        
        const mappedUsers: User[] = response.data.users.map((u: any) => ({
          id: u.user_id,
          name: u.name || 'Unknown',
          email: u.email,
          role: u.role || 'User',
          status: u.email_verified ? 'Active' : 'Pending', 
          tier: (u.user_plan as UserTier) || 'Free', 
          walletBalance: 0, // API doesn't send this yet, defaulting to 0
          contact: u.phone || 'N/A',
          ticketsPurchased: 0, 
          bundlesRedeemed: 0,   
          avatar: u.profile_picture_url, // Map profile_picture_url
          joinedAt: u.created_at || new Date().toISOString()
        }));
        
        setUsers(mappedUsers);
      } else {
        toaster.create({ title: 'Failed to load users', type: 'error' });
        console.error("Unexpected API response structure:", response);
      }
    } catch (error) {
      console.error(error);
      toaster.create({ title: 'Network error loading users', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- FILTERING LOGIC ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      const matchesTier = tierFilter === 'All' || user.tier === tierFilter;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [users, searchQuery, statusFilter, tierFilter]);

  // Filter for tabs
  const customers = filteredUsers.filter(u => u.role === 'User' || u.role === 'Admin'); // Group Admins with users for list
  const organizers = filteredUsers.filter(u => u.role === 'Organizer');

  // --- ACTIONS ---

  const handleStatusChange = (id: string, newStatus: User['status']) => {
    // TODO: Connect to an API endpoint like updateStatus(id, newStatus)
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    toaster.create({ title: `User marked as ${newStatus}`, type: 'info', duration: 3000 });
  };

  const handleIssueCredit = (id: string) => {
    // TODO: Connect to wallet API
    setUsers(users.map(u => u.id === id ? { ...u, walletBalance: u.walletBalance + 50 } : u));
    toaster.create({ title: 'Credit Issued (GH₵50)', type: 'success', duration: 3000 });
  };

  const handleResetPassword = (email: string) => {
    // TODO: Connect to auth API
    toaster.create({ title: `Password reset link sent to ${email}`, type: 'success', duration: 3000 });
  };

  const handleTierChange = async (id: string, newTier: UserTier) => {
    // Optimistic UI update
    const previousUsers = [...users];
    setUsers(users.map(u => u.id === id ? { ...u, tier: newTier } : u));

    try {
      const response = await updateUserPlan(id, newTier);
      if (response.success) {
        toaster.create({ title: `Plan updated to ${newTier}`, type: 'success' });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // Revert on failure
      setUsers(previousUsers);
      toaster.create({ title: 'Failed to update plan', type: 'error' });
    }
  };

  // --- HELPER COMPONENTS ---

  const TierBadge = ({ tier }: { tier: UserTier }) => {
    const colors: Record<string, string> = {
      'Free': 'gray',
      'Paradise+': 'purple',
      'Paradise X': 'yellow'
    };
    return <Badge colorPalette={colors[tier] || 'gray'}>{tier}</Badge>;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Active': 'green',
      'Suspended': 'red',
      'Pending': 'orange'
    };
    return <Badge colorPalette={colors[status] || 'gray'}>{status}</Badge>;
  };

  const UserRow = ({
    user,
    isOrganizer = false,
  }: {
    user: User;
    isOrganizer?: boolean;
  }) => (
    <Table.Row key={user.id} _hover={{ bg: "gray.50" }}>
      {/* Profile Info */}
      <Table.Cell>
        <Flex align="center" gap={3}>
          <Avatar.Root size="sm">
            <Avatar.Image src={user.avatar} />
            <Avatar.Fallback name={user.name} />
          </Avatar.Root>
          <Box>
            <Text fontWeight="medium">{user.name}</Text>
            {/* Show role badge if it's an Admin in the customer list */}
            {user.role === "Admin" && (
              <Badge size="xs" colorPalette="red" ml={2}>
                Admin
              </Badge>
            )}
            <Text fontSize="xs" color="gray.500">
              {user.email}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {user.contact}
            </Text>
          </Box>
        </Flex>
      </Table.Cell>

      {/* Tier / Stats */}
      <Table.Cell>
        <Stack gap={1}>
          <TierBadge tier={user.tier} />
          {!isOrganizer && (
            <Text fontSize="xs" color="gray.500">
              Wallet: GH₵{user.walletBalance.toFixed(2)}
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
            <Menu.Item
              value="kyc"
              onClick={() => {
                setSelectedUser(user);
                setIsKYCDialogOpen(true);
              }}
            >
              <BsFileEarmarkText style={{ marginRight: "8px" }} /> View Profile
            </Menu.Item>

            <Menu.Item
              value="password"
              onClick={() => handleResetPassword(user.email)}
            >
              <BsKey style={{ marginRight: "8px" }} /> Reset Password
            </Menu.Item>

            <Separator my={1} />

            {/* Customer Specific Actions */}
            {!isOrganizer && (
              <>
                <Menu.Item
                  value="credit"
                  onClick={() => handleIssueCredit(user.id)}
                >
                  <BsCreditCard style={{ marginRight: "8px" }} /> Issue Credit
                </Menu.Item>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Menu.Item value="upgrade">
                      <BsArrowUpCircle style={{ marginRight: "8px" }} /> Change
                      Plan
                    </Menu.Item>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item
                      value="free"
                      onClick={() => handleTierChange(user.id, "Free")}
                    >
                      Downgrade to Free
                    </Menu.Item>
                    <Menu.Item
                      value="plus"
                      onClick={() => handleTierChange(user.id, "Paradise+")}
                    >
                      Upgrade to Paradise+
                    </Menu.Item>
                    <Menu.Item
                      value="x"
                      onClick={() => handleTierChange(user.id, "Paradise X")}
                    >
                      Upgrade to Paradise X
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Root>
              </>
            )}

            {/* Organizer Specific Actions */}
            {isOrganizer && user.status === "Pending" && (
              <Menu.Item
                value="approve"
                color="green.600"
                onClick={() => handleStatusChange(user.id, "Active")}
              >
                <BsShieldCheck style={{ marginRight: "8px" }} /> Verify &
                Approve
              </Menu.Item>
            )}

            <Separator my={1} />

            {/* Suspend / Activate */}
            <Menu.Item
              value="suspend"
              color={user.status === "Active" ? "red.500" : "green.500"}
              onClick={() =>
                handleStatusChange(
                  user.id,
                  user.status === "Active" ? "Suspended" : "Active",
                )
              }
            >
              <BsSlashCircle style={{ marginRight: "8px" }} />
              {user.status === "Active" ? "Suspend User" : "Reactivate User"}
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </Table.Cell>
    </Table.Row>
  );

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Toaster />

      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">User Management</Heading>
          <Text color="gray.600">
            Manage customers, organizers, and memberships.
          </Text>
        </Box>
        <Button colorPalette="blue" onClick={fetchUsers} loading={loading}>
          Refresh List
        </Button>
      </Flex>

      {/* Filters & Search Bar */}
      <Flex
        gap={4}
        mb={6}
        bg="white"
        p={4}
        borderRadius="md"
        shadow="sm"
        wrap="wrap"
      >
        <Box flex="1" minW="200px">
          <HStack
            gap={2}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            px={3}
            py={2}
          >
            <BsSearch color="gray" />
            <Input
              variant="flushed"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </HStack>
        </Box>

        <Select.Root
          collection={createListCollection({
            items: [
              { label: "All", value: "All" },
              { label: "Active", value: "Active" },
              { label: "Suspended", value: "Suspended" },
              { label: "Pending", value: "Pending" },
            ],
          })}
          value={[statusFilter]}
          onValueChange={(e) => setStatusFilter(e.value[0])}
          width="200px"
        >
          <Select.Trigger>
            <Select.ValueText placeholder="Filter Status" />
          </Select.Trigger>
          <Select.Content>
            {["All", "Active", "Suspended", "Pending"].map((s) => (
              <Select.Item item={s} key={s}>
                {s}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root
          collection={createListCollection({
            items: [
              { label: "All Tiers", value: "All" },
              { label: "Free", value: "Free" },
              { label: "Paradise+", value: "Paradise+" },
              { label: "Paradise X", value: "Paradise X" },
            ],
          })}
          value={[tierFilter]}
          onValueChange={(e) => setTierFilter(e.value[0])}
          width="200px"
        >
          <Select.Trigger>
            <Select.ValueText placeholder="Filter Tier" />
          </Select.Trigger>
          <Select.Content>
            {["All", "Free", "Paradise+", "Paradise X"].map((t) => (
              <Select.Item item={t} key={t}>
                {t}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Main Content Area */}
      {loading && users.length === 0 ? (
        <Center h="200px">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Tabs.Root defaultValue="customers">
          <Tabs.List bg="white" borderRadius="md" shadow="sm" p={1} mb={4}>
            <Tabs.Trigger value="customers" flex="1">
              All Customers ({customers.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="organizers" flex="1">
              Event Organizers ({organizers.length})
            </Tabs.Trigger>
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
                    <Table.ColumnHeader textAlign="right">
                      Actions
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {customers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                  {customers.length === 0 && (
                    <Table.Row>
                      <Table.Cell
                        colSpan={4}
                        textAlign="center"
                        py={8}
                        color="gray.500"
                      >
                        No customers found matching filters.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Tabs.Content>

            {/* ORGANIZERS TAB */}
            <Tabs.Content value="organizers" p={0}>
              <Table.Root>
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader width="40%">
                      Organizer Details
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>Tier</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">
                      Actions
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {organizers.map((user) => (
                    <UserRow key={user.id} user={user} isOrganizer />
                  ))}
                  {organizers.length === 0 && (
                    <Table.Row>
                      <Table.Cell
                        colSpan={4}
                        textAlign="center"
                        py={8}
                        color="gray.500"
                      >
                        No organizers found matching filters.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      )}

      {/* User Details Modal */}
      <Dialog.Root
        open={isKYCDialogOpen}
        onOpenChange={(e) => setIsKYCDialogOpen(e.open)}
      >
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
                      <Avatar.Root size="lg">
                        <Avatar.Image src={selectedUser.avatar} />
                        <Avatar.Fallback name={selectedUser.name} />
                      </Avatar.Root>
                      <Box>
                        <Heading size="sm">{selectedUser.name}</Heading>
                        <Text color="gray.500">{selectedUser.email}</Text>
                        <HStack mt={1}>
                          <Badge>{selectedUser.role}</Badge>
                          <TierBadge tier={selectedUser.tier} />
                        </HStack>
                      </Box>
                    </Flex>
                    <Separator />
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Wallet Balance:</Text>
                      <Text>GH₵{selectedUser.walletBalance.toFixed(2)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Phone:</Text>
                      <Text>{selectedUser.contact}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Joined:</Text>
                      <Text>
                        {new Date(selectedUser.joinedAt).toLocaleDateString()}
                      </Text>
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