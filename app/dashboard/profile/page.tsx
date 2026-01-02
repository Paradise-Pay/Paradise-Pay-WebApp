'use client';

import { useState } from 'react';
import {
  Box, Button, Heading, Text, Flex, 
  Input, Stack, Tabs, Card, Separator, 
  Avatar, Field, Textarea, Switch, Badge, 
  SimpleGrid
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsPerson, BsShieldLock, BsBell, BsCamera, BsSave, BsEnvelope 
} from 'react-icons/bs';
import { mockProfile, UserProfile } from '@/public/data/ProfilePlaceholders';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  
  // -- Form States --
  const [formData, setFormData] = useState(mockProfile);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  // --- ACTIONS ---

  const handleSaveChanges = () => {
    setUser(formData);
    setIsEditing(false);
    toaster.create({ title: 'Profile Updated', type: 'success' });
  };

  const handlePasswordUpdate = () => {
    if (passwordData.new !== passwordData.confirm) {
      toaster.create({ title: 'Passwords do not match', type: 'error' });
      return;
    }
    toaster.create({ title: 'Password Changed Successfully', type: 'success' });
    setPasswordData({ current: '', new: '', confirm: '' }); // Reset fields
  };

  const toggleNotification = (key: keyof typeof user.notifications) => {
    setUser(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
    }));
    toaster.create({ title: 'Preference Saved', type: 'info' });
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      
      {/* 1. Profile Header Card */}
      <Card.Root mb={8} overflow="hidden">
        {/* Decorative Banner */}
        <Box h="120px" bgGradient="to-r" gradientFrom="blue.600" gradientTo="purple.600" />
        
        <Card.Body mt="-50px" px={8} pb={6}>
          <Flex direction={{ base: 'column', sm: 'row' }} align="end" gap={6}>
            
            {/* Avatar with Edit Overlay */}
            <Box position="relative">
              <Avatar.Root size="2xl" border="4px solid white" bg="white">
                <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} fontSize="3xl" />
                {/* <Avatar.Image src={user.avatarUrl} /> */}
              </Avatar.Root>
              <Box 
                position="absolute" bottom="2" right="2" bg="gray.800" p={2} 
                borderRadius="full" color="white" cursor="pointer"
                _hover={{ bg: 'blue.500' }}
              >
                <BsCamera size={14} />
              </Box>
            </Box>

            {/* Name & Role */}
            <Box flex="1" pb={2}>
              <Heading size="2xl" color={"white"}>{user.firstName} {user.lastName}</Heading>
              <Flex align="center" gap={3} mt={1}>
                <Text color="gray.500">{user.email}</Text>
                <Badge colorPalette="purple" variant="solid">{user.role}</Badge>
              </Flex>
            </Box>

            {/* Quick Actions */}
            <Box >
              {!isEditing ? (
                 <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                 <Flex gap={3}>
                   <Button variant="ghost" colorPalette="red" onClick={() => setIsEditing(false)}>Cancel</Button>
                   <Button colorPalette="blue" onClick={handleSaveChanges}><BsSave style={{marginRight:'5px'}}/> Save</Button>
                 </Flex>
              )}
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* 2. Content Tabs */}
      <Tabs.Root defaultValue="details" variant="enclosed">
        <Tabs.List mb={4}>
          <Tabs.Trigger value="details"><BsPerson style={{marginRight:'6px'}}/> Personal Details</Tabs.Trigger>
          <Tabs.Trigger value="security"><BsShieldLock style={{marginRight:'6px'}}/> Security</Tabs.Trigger>
          <Tabs.Trigger value="preferences"><BsBell style={{marginRight:'6px'}}/> Notifications</Tabs.Trigger>
        </Tabs.List>

        {/* --- TAB 1: PERSONAL DETAILS --- */}
        <Tabs.Content value="details">
          <Card.Root>
            <Card.Header>
              <Heading size="md">My Information</Heading>
              <Text fontSize="sm" color="gray.500">Update your account details and public profile.</Text>
            </Card.Header>
            <Card.Body>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <Field.Root disabled={!isEditing}>
                  <Field.Label>First Name</Field.Label>
                  <Input 
                    value={isEditing ? formData.firstName : user.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </Field.Root>

                <Field.Root disabled={!isEditing}>
                  <Field.Label>Last Name</Field.Label>
                  <Input 
                    value={isEditing ? formData.lastName : user.lastName} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </Field.Root>

                <Field.Root disabled={!isEditing}>
                  <Field.Label>Phone Number</Field.Label>
                  <Input 
                    value={isEditing ? formData.phone : user.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </Field.Root>

                <Field.Root disabled>
                  <Field.Label>Email Address (Cannot change)</Field.Label>
                  <Input value={user.email} bg="gray.50" />
                </Field.Root>

                <Field.Root gridColumn={{ md: "span 2" }} disabled={!isEditing}>
                  <Field.Label>Bio / About Me</Field.Label>
                  <Textarea 
                    rows={3} 
                    value={isEditing ? formData.bio : user.bio} 
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </Field.Root>
              </SimpleGrid>
            </Card.Body>
          </Card.Root>
        </Tabs.Content>

        {/* --- TAB 2: SECURITY --- */}
        <Tabs.Content value="security">
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            
            {/* Password Change */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Change Password</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  <Field.Root>
                    <Field.Label>Current Password</Field.Label>
                    <Input type="password" placeholder="••••••••" value={passwordData.current} onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>New Password</Field.Label>
                    <Input type="password" placeholder="••••••••" value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Confirm New Password</Field.Label>
                    <Input type="password" placeholder="••••••••" value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} />
                  </Field.Root>
                  <Button alignSelf="start" mt={2} colorPalette="blue" onClick={handlePasswordUpdate}>Update Password</Button>
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* 2FA & Sessions */}
            <Stack gap={6}>
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Two-Factor Authentication</Heading>
                </Card.Header>
                <Card.Body>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Box>
                      <Text fontWeight="bold" mb={1}>Enable 2FA</Text>
                      <Text fontSize="sm" color="gray.500">Secure your account with an extra layer of protection.</Text>
                    </Box>
                    <Switch.Root 
                      checked={user.twoFactorEnabled} 
                      colorPalette="green"
                      onCheckedChange={(e) => {
                         setUser({...user, twoFactorEnabled: e.checked});
                         toaster.create({ title: `2FA ${e.checked ? 'Enabled' : 'Disabled'}`, type: 'info' });
                      }}
                    >
                      <Switch.HiddenInput />
                      <Switch.Control><Switch.Thumb /></Switch.Control>
                    </Switch.Root>
                  </Flex>
                </Card.Body>
              </Card.Root>

              <Card.Root variant="subtle" borderColor="red.200">
                <Card.Body>
                   <Heading size="sm" color="red.600" mb={2}>Danger Zone</Heading>
                   <Text fontSize="sm" color="gray.600" mb={4}>Once you delete your account, there is no going back. Please be certain.</Text>
                   <Button variant="outline" colorPalette="red" size="sm">Delete Account</Button>
                </Card.Body>
              </Card.Root>
            </Stack>

          </SimpleGrid>
        </Tabs.Content>

        {/* --- TAB 3: NOTIFICATIONS --- */}
        <Tabs.Content value="preferences">
          <Card.Root>
            <Card.Header>
               <Heading size="md">Notification Preferences</Heading>
               <Text fontSize="sm" color="gray.500">Choose how and when we contact you.</Text>
            </Card.Header>
            <Card.Body>
              <Stack gap={5} separator={<Separator />}>
                
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="medium">Email Notifications</Text>
                    <Text fontSize="sm" color="gray.500">Receive system updates and reports via email.</Text>
                  </Box>
                  <Switch.Root checked={user.notifications.email} onCheckedChange={() => toggleNotification('email')} colorPalette="blue">
                     <Switch.HiddenInput /><Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch.Root>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="medium">SMS Notifications</Text>
                    <Text fontSize="sm" color="gray.500">Get critical alerts via SMS (e.g. Fraud detection).</Text>
                  </Box>
                  <Switch.Root checked={user.notifications.sms} onCheckedChange={() => toggleNotification('sms')} colorPalette="blue">
                     <Switch.HiddenInput /><Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch.Root>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="medium">Marketing & Tips</Text>
                    <Text fontSize="sm" color="gray.500">Receive tips on how to manage events better.</Text>
                  </Box>
                  <Switch.Root checked={user.notifications.marketing} onCheckedChange={() => toggleNotification('marketing')} colorPalette="blue">
                     <Switch.HiddenInput /><Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch.Root>
                </Flex>

              </Stack>
            </Card.Body>
          </Card.Root>
        </Tabs.Content>

      </Tabs.Root>
    </Box>
  );
}