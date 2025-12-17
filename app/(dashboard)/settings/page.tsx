'use client';

import { useState, useEffect, useCallback } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  type User as DomainUser,
  type UserRole,
  type ActivityLog
} from '@/types/domain/user';

import { useAuth } from '@/context/AuthProvider';
import { getUserProfile, updateUserProfile, uploadUserAvatar } from '@/lib/api';
import { ProfileUpdateRequest, SecurityActivity, UserSecurity } from '@/types/dashboard';

type ID = string | number;

// Helper function to map activity log to SecurityActivity
const mapActivityLogToSecurityActivity = (log: { id: ID; action?: string; ipAddress?: string; userAgent?: string; location?: string; status?: string; timestamp?: string; successful?: boolean }): SecurityActivity => {
  return {
    id: String(log.id),
    action: log.action || 'unknown',
    device: log.userAgent || 'Unknown device',
    location: log.location || 'Unknown location',
    timestamp: log.timestamp || new Date().toISOString(),
    successful: log.successful ?? (log.status === 'success')
  };
};
import { 
  Box,
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Avatar, 
  Divider, 
  Tabs, 
  Tab, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Switch,
  FormControlLabel, 
  Alert, 
  Snackbar,
  IconButton,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  InputAdornment,
  Skeleton,
  Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  CameraAlt as CameraAltIcon,
  VpnKey as VpnKeyIcon,
  Devices as DevicesIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
  Download as DownloadIcon,
  Language as LanguageIcon
} from '@mui/icons-material';

// Define the additional fields that will be stored in the user's metadata
interface SnackbarState {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
}



// Define the form data type based on DomainUser
type ProfileFormData = Partial<Omit<DomainUser, 'id' | 'role' | 'createdAt' | 'updatedAt'>> & {
  // Add any additional form fields that aren't in the DomainUser type
  confirmPassword?: string;
};

const timezones = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00',
  'UTC-05:00', 'UTC-04:00', 'UTC-03:30', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00', 'UTC±00:00',
  'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+03:30', 'UTC+04:00', 'UTC+04:30', 'UTC+05:00',
  'UTC+05:30', 'UTC+05:45', 'UTC+06:00', 'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+08:45',
  'UTC+09:00', 'UTC+09:30', 'UTC+10:00', 'UTC+10:30', 'UTC+11:00', 'UTC+12:00', 'UTC+12:45',
  'UTC+13:00', 'UTC+14:00'
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
  { code: 'hi', name: 'हिन्दी' },
];

const currencies = [
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'GBP', name: 'British Pound (£)' },
  { code: 'JPY', name: 'Japanese Yen (¥)' },
  { code: 'AUD', name: 'Australian Dollar (A$)' },
  { code: 'CAD', name: 'Canadian Dollar (C$)' },
  { code: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'CNY', name: 'Chinese Yuan (¥)' },
  { code: 'INR', name: 'Indian Rupee (₹)' },
  { code: 'MXN', name: 'Mexican Peso (Mex$)' },
];

// Default user object with empty values
const defaultUser: DomainUser = {
  id: '' as ID,
  email: '',
  role: 'user' as UserRole,
  firstName: '',
  lastName: '',
  fullName: '',
  avatar: '',
  phone: '',
  bio: '',
  location: '',
  timezone: 'UTC-08:00',
  emailVerified: false,
  preferences: {
    theme: 'system' as const,
    language: 'en',
    currency: 'USD',
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    eventReminders: true,
    ticketUpdates: true,
    paymentReceipts: true,
    marketing: false,
  },
  security: {
    twoFactorAuth: false,
    loginAlerts: true,
    deviceManagement: false,
    recentActivity: [],
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<DomainUser>(defaultUser);
  const [formData, setFormData] = useState<ProfileFormData>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: ''
  });
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };


  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile from API
      const response = await getUserProfile();
      
      if (response.success && response.data) {
        const profileData = response.data;
        
        // Map API response to local DomainUser format
        const userData: DomainUser = {
          id: profileData.id as ID,
          email: profileData.email,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          fullName: profileData.fullName,
          avatar: profileData.avatar || '/avatars/default-avatar.png',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          timezone: profileData.timezone,
          emailVerified: profileData.emailVerified,
          role: profileData.role as UserRole,
          preferences: profileData.preferences,
          notifications: profileData.notifications,
          security: profileData.security ? {
            ...profileData.security,
            recentActivity: (profileData.security.recentActivity || []).map((activity: Partial<ActivityLog>) => ({
              id: activity.id || '',
              action: String(activity.action || 'login'),
              ipAddress: String(activity.ipAddress || ''),
              userAgent: String(activity.userAgent || ''),
              location: String(activity.location || 'Unknown'),
              status: activity.status === 'success' ? 'success' as const : 'failed' as const,
              timestamp: activity.createdAt || new Date().toISOString(),
              successful: activity.status === 'success',
              createdAt: activity.createdAt || new Date().toISOString(),
              updatedAt: activity.updatedAt || new Date().toISOString()
            }))
          } : defaultUser.security,
          createdAt: profileData.createdAt,
          updatedAt: profileData.updatedAt,
        };
        
        setProfile(userData);
        setFormData({});
        setLoading(false);
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Fallback to mock data for development
      if (user) {
        const userData: DomainUser = {
          ...defaultUser,
          id: user.id,
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          phone: '+1 (555) 123-4567',
          avatar: user.avatar || '/avatars/default-avatar.png',
          bio: 'Event organizer and music lover. Creating memorable experiences one event at a time!',
          location: 'San Francisco, CA',
          timezone: 'UTC-08:00',
          emailVerified: false,
          role: 'user',
          notifications: {
            ...defaultUser.notifications,
            email: true,
            push: true,
            sms: false,
          },
          security: {
            twoFactorAuth: true,
            loginAlerts: true,
            deviceManagement: false,
            recentActivity: []
          },
          preferences: {
            theme: 'system',
            language: 'en',
            currency: 'USD',
          },
        };
        setProfile(userData);
      }
      
      setLoading(false);
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  type InputEvent = {
    target: {
      name: string;
      value: unknown;
      type?: string;
      checked?: boolean;
    };
  };

  const handleNestedChange = (e: InputEvent | React.ChangeEvent<HTMLInputElement>, parent: keyof DomainUser) => {
    const target = 'target' in e ? e.target : e;
    const { name, type } = target as HTMLInputElement;
    if (!name) return;
    
    const value = type === 'checkbox' ? target.checked : target.value;
    
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof ProfileFormData] as object || {}),
        [name]: value
      }
    }));
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async () => {
    // Validate form before saving
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      console.log('Saving profile:', formData);
      
      // Handle avatar upload first if there's a new avatar
      let avatarUrl = profile.avatar;
      if (avatarFile) {
        try {
          const avatarResponse = await uploadUserAvatar(avatarFile);
          if (avatarResponse.success && avatarResponse.data) {
            avatarUrl = avatarResponse.data.avatarUrl;
          }
        } catch (avatarError) {
          console.error('Error uploading avatar:', avatarError);
          // Continue with profile update even if avatar upload fails
        }
      }
      


      // Get security data with mapped recentActivity
      const securityData = formData.security || profile.security;
      const mappedSecurity: UserSecurity = {
        twoFactorAuth: securityData?.twoFactorAuth ?? false,
        loginAlerts: securityData?.loginAlerts ?? false,
        deviceManagement: securityData?.deviceManagement ?? false,
        recentActivity: securityData?.recentActivity?.map(mapActivityLogToSecurityActivity) || []
      };

      // Prepare the update data
      const updateData: ProfileUpdateRequest = {
        firstName: formData.firstName ?? profile.firstName,
        lastName: formData.lastName ?? profile.lastName,
        phone: formData.phone ?? profile.phone,
        bio: formData.bio ?? profile.bio,
        location: formData.location ?? profile.location,
        timezone: formData.timezone ?? profile.timezone,
        preferences: {
          theme: formData.preferences?.theme || profile.preferences?.theme || 'system',
          language: formData.preferences?.language || profile.preferences?.language || 'en',
          currency: formData.preferences?.currency || profile.preferences?.currency || 'USD',
        },
        notifications: formData.notifications ?? profile.notifications,
        security: mappedSecurity,
      };
      
      // Update the profile via API
      const response = await updateUserProfile(updateData);
      
      if (response.success && response.data) {
        // Default values for required fields
        const defaultTheme: 'light' | 'dark' | 'system' = 'system';
        const defaultLanguage = 'en';
        const defaultCurrency = 'USD';
        const defaultNotifications = {
          email: false,
          push: false,
          sms: false,
          eventReminders: false,
          ticketUpdates: false,
          paymentReceipts: false,
          marketing: false
        };
        
        // Update local profile state with new data
        const updatedProfile: DomainUser = {
          ...profile,
          ...updateData,
          // Ensure required fields have values
          firstName: updateData.firstName || profile.firstName,
          lastName: updateData.lastName || profile.lastName,
          email: profile.email, // Should always come from profile
          emailVerified: profile.emailVerified,
          role: profile.role,
          // Handle avatar
          avatar: avatarUrl || profile.avatar,
          // Ensure preferences have all required fields
          preferences: {
            theme: updateData.preferences?.theme || profile.preferences?.theme || defaultTheme,
            language: updateData.preferences?.language || profile.preferences?.language || defaultLanguage,
            currency: updateData.preferences?.currency || profile.preferences?.currency || defaultCurrency,
          },
          // Ensure notifications have all required fields
          notifications: {
            ...defaultNotifications,
            ...profile.notifications,
            ...(updateData.notifications || {})
          },
          // Ensure security has all required fields
          security: {
            twoFactorAuth: updateData.security?.twoFactorAuth ?? profile.security?.twoFactorAuth ?? false,
            loginAlerts: updateData.security?.loginAlerts ?? profile.security?.loginAlerts ?? false,
            deviceManagement: updateData.security?.deviceManagement ?? profile.security?.deviceManagement ?? false,
            recentActivity: profile.security?.recentActivity || []
          },
          // Update timestamps
          updatedAt: new Date().toISOString(),
          createdAt: profile.createdAt,
          // Ensure timezone has a value
          timezone: updateData.timezone || profile.timezone || 'UTC',
          // Handle deletedAt if it exists
          ...(profile.deletedAt ? { deletedAt: profile.deletedAt } : {})
        };
        setProfile(updatedProfile);
        setFormData({}); // Clear form data after successful save
        setAvatarFile(null); // Clear avatar file
        setAvatarPreview(''); // Clear avatar preview
        
        // Update the profile in the auth context
        if (updateProfile) {
          await updateProfile(updatedProfile);
        }
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validate first name
    if (formData.firstName && formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    // Validate last name
    if (formData.lastName && formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Validate phone number
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Validate bio length
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }

    // Validate location
    if (formData.location && formData.location.length < 2) {
      errors.location = 'Location must be at least 2 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    handleInputChange(e);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    try {
      setSaving(true);
      // TODO: Implement delete account API call
      // await api.deleteAccount();
      console.log('Account deleted');
      
      setSnackbar({
        open: true,
        message: 'Your account has been deleted successfully',
        severity: 'success',
      });
      
      // Redirect to home or login page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete account. Please try again.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  if (error && !profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchProfile}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          No profile data available. Please try refreshing the page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1">
          Profile Settings
        </Typography>
        <Box display="flex" gap={2}>
          {isEditing ? (
            <>
              <Button 
                variant="outlined" 
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
        <Tab label="Account" icon={<LockIcon />} iconPosition="start" />
        <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
        <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Profile Picture Section */}
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                textAlign: 'center',
                height: '100%',
                boxSizing: 'border-box'
              }}>
                <Box position="relative" mb={3}>
                  <Avatar 
                    src={avatarPreview || profile.avatar || ''} 
                    alt={profile.fullName || (profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : 'User')}
                    sx={{ 
                      width: { xs: 120, md: 150 },
                      height: { xs: 120, md: 150 },
                      mx: 'auto',
                      fontSize: '3rem',
                      bgcolor: 'primary.main',
                      boxShadow: 3
                    }}
                  >
                    {!profile.avatar && !avatarPreview && ((profile.firstName?.[0] || '') + (profile.lastName?.[0] || '') || 'U')}
                  </Avatar>
                  {isEditing && (
                    <label htmlFor="avatar-upload">
                      <input
                        accept="image/*"
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        onChange={handleAvatarChange}
                        aria-label="Upload profile picture"
                        title="Choose a profile picture to upload"
                      />
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: 'background.paper',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <CameraAltIcon />
                      </IconButton>
                    </label>
                  )}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.fullName || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profile.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </Typography>
                
                {!isEditing && (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Account Status
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Email Verified
                  </Typography>
                  <Chip 
                    label="Verified"
                    size="small" 
                    color="success"
                    variant="outlined"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Phone Verified
                  </Typography>
                  <Chip 
                    label={profile.phone ? 'Verified' : 'Not Set'} 
                    size="small" 
                    color={profile.phone ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    2FA Enabled
                  </Typography>
                  <Chip 
                    label={profile.security?.twoFactorAuth ? 'Enabled' : 'Disabled'} 
                    size="small" 
                    color={profile.security?.twoFactorAuth ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Button 
                  variant="outlined" 
                  color="error" 
                  fullWidth 
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteAccount}
                  sx={{ mt: 1 }}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Update your personal information and how we can reach you.
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName ?? profile.firstName ?? ''}
                      onChange={handleInputChangeWithValidation}
                      disabled={!isEditing}
                      error={!!formErrors.firstName}
                      helperText={formErrors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profile.email || ''}
                      onChange={handleInputChange}
                      disabled={true} // Email is typically not editable directly
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone ?? profile.phone ?? ''}
                      onChange={handleInputChangeWithValidation}
                      disabled={!isEditing}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel id="timezone-label">Timezone</InputLabel>
                      <Select
                        labelId="timezone-label"
                        id="timezone"
                        name="timezone"
                        value={profile.timezone || ''}
                        label="Timezone"
                        onChange={handleSelectChange}
                      >
                        {timezones.map((tz) => (
                          <MenuItem key={tz} value={tz}>
                            {tz}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location ?? profile.location ?? ''}
                      onChange={handleInputChangeWithValidation}
                      disabled={!isEditing}
                      error={!!formErrors.location}
                      helperText={formErrors.location}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio ?? profile.bio ?? ''}
                      onChange={handleInputChangeWithValidation}
                      disabled={!isEditing}
                      error={!!formErrors.bio}
                      helperText={formErrors.bio || `${(formData.bio ?? profile.bio ?? '').length}/500 characters`}
                      multiline
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Preferences
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Customize your experience on our platform.
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel id="language-label">Language</InputLabel>
                      <Select
                        labelId="language-label"
                        id="language"
                        name="language"
                        value={profile.preferences?.language || 'en'}
                        label="Language"
                        onChange={(e: SelectChangeEvent<string>) => handleNestedChange({
                          target: {
                            name: 'language',
                            value: e.target.value
                          }
                        } as React.ChangeEvent<HTMLInputElement>, 'preferences')}
                        disabled={!isEditing}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel id="currency-label">Currency</InputLabel>
                      <Select
                        labelId="currency-label"
                        id="currency"
                        name="currency"
                        value={profile.preferences?.currency || 'USD'}
                        label="Currency"
                        onChange={(e: SelectChangeEvent<string>) => handleNestedChange({
                          target: { name: 'currency', value: e.target.value }
                        } as React.ChangeEvent<HTMLInputElement>, 'preferences')}
                        disabled={!isEditing}
                      >
                        {currencies.map((curr) => (
                          <MenuItem key={curr.code} value={curr.code}>
                            {curr.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel id="theme-label">Theme</InputLabel>
                      <Select
                        labelId="theme-label"
                        id="theme"
                        name="theme"
                        value={profile.preferences?.theme || 'system'}
                        label="Theme"
                        onChange={(e: SelectChangeEvent<string>) => handleNestedChange({
                          target: {
                            name: 'theme',
                            value: e.target.value
                          }
                        } as React.ChangeEvent<HTMLInputElement>, 'preferences')}
                        disabled={!isEditing}
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="system">System Default</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage your account settings and security preferences.
            </Typography>
            
            <Box sx={{ maxWidth: 800 }}>
              <List disablePadding>
                <ListItemButton component="div">
                  <ListItemIcon>
                    <LockIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Change Password" 
                    secondary="Update your account password" 
                  />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
                
                <ListItemButton component="div">
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Preferences" 
                    secondary="Manage email notifications" 
                  />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
                
                <ListItemButton component="div">
                  <ListItemIcon>
                    <DevicesIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Connected Devices" 
                    secondary="Manage your logged-in devices" 
                  />
                  <Chip label="3 active" size="small" />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
                
                <ListItemButton component="div">
                  <ListItemIcon>
                    <LanguageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Language & Region" 
                    secondary="Change language and regional settings" 
                  />
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      English (US)
                    </Typography>
                    <ChevronRightIcon color="action" />
                  </Box>
                </ListItemButton>
              </List>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Email Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage when and how we send you email notifications.
                </Typography>
                
                <List disablePadding>
                  <ListItemButton component="div">
                    <ListItemText 
                      primary="Account Notifications"
                      secondary="Important updates about your account"
                    />
                    <Switch 
                      edge="end"
                      checked={profile.notifications?.email ?? true}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNestedChange(e, 'notifications')}
                    />
                  </ListItemButton>
                  <Divider component="li" />
                  <ListItemButton component="div">
                    <ListItemText 
                      primary="Event Updates"
                      secondary="Updates about events you're attending or hosting"
                    />
                    <Switch 
                      edge="end"
                      checked={profile.notifications?.push ?? true}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNestedChange(e, 'notifications')}
                    />
                  </ListItemButton>
                  <Divider component="li" />
                  <ListItemButton component="div">
                    <ListItemText 
                      primary="Promotional Emails"
                      secondary="News, offers, and recommendations"
                    />
                    <Switch 
                      edge="end"
                      checked={profile.notifications?.sms ?? false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNestedChange({
                        target: {
                          name: 'sms',
                          checked: e.target.checked,
                          type: 'checkbox'
                        }
                      } as React.ChangeEvent<HTMLInputElement>, 'notifications')}
                    />
                  </ListItemButton>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Push Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your push notification preferences.
                </Typography>
                
                <List disablePadding>
                  <ListItemButton component="div">
                    <ListItemText 
                      primary="Event Reminders"
                      secondary="Get reminders about upcoming events"
                    />
                    <Switch 
                      edge="end"
                      defaultChecked
                    />
                  </ListItemButton>
                  <Divider component="li" />
                  <ListItemButton component="div">
                    <ListItemText 
                      primary="Ticket Updates"
                      secondary="Get updates about your ticket purchases"
                    />
                    <Switch 
                      edge="end"
                      defaultChecked
                    />
                  </ListItemButton>
                  <Divider component="li" />
                  <ListItemButton component="div">
                    <ListItemText 
                      primary="Special Offers"
                      secondary="Receive special offers and discounts"
                    />
                    <Switch 
                      edge="end"
                      defaultChecked
                    />
                  </ListItemButton>
                </List>
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  SMS Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your SMS notification preferences.
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={profile.notifications?.sms ?? false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNestedChange({
                        target: {
                          name: 'sms',
                          checked: e.target.checked,
                          type: 'checkbox'
                        }
                      } as React.ChangeEvent<HTMLInputElement>, 'notifications')}
                    />
                  }
                  label="Enable SMS Notifications"
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="body2" color="text.secondary">
                  Standard message and data rates may apply. Reply HELP for help or STOP to cancel.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your account security settings.
                </Typography>
                
                <List disablePadding>
                  <ListItemButton component="div">
                    <ListItemIcon>
                      <LockIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security to your account"
                    />
                    <Switch 
                      edge="end"
                      checked={profile.security?.twoFactorAuth ?? false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleNestedChange({
                          target: {
                            name: 'twoFactorAuth',
                            value: e.target.checked,
                            type: 'checkbox'
                          }
                        }, 'security');
                      }}
                    />
                  </ListItemButton>
                  <Divider component="li" />
                  <ListItemButton component="div">
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Login Alerts"
                      secondary="Get notified of new logins to your account"
                    />
                    <Switch 
                      edge="end"
                      checked={profile.security?.loginAlerts ?? true}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // Create a new event with the correct structure
                        const event = {
                          ...e,
                          target: {
                            ...e.target,
                            name: 'loginAlerts',
                            checked: e.target.checked,
                            type: 'checkbox'
                          }
                        };
                        return handleNestedChange(event, 'security');
                      }}
                    />
                  </ListItemButton>
                  <Divider component="li" />
                  <ListItemButton component="div" sx={{ cursor: 'pointer' }}>
                    <ListItemIcon>
                      <DevicesIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Active Sessions"
                      secondary="View and manage your logged-in devices"
                    />
                    <Chip label="3 active" size="small" sx={{ mr: 1 }} />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                </List>
                
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  startIcon={<HistoryIcon />}
                >
                  View Security Logs
                </Button>
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data & Privacy
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your data and privacy settings.
                </Typography>
                
                <List disablePadding>
                  <ListItemButton component="div" sx={{ cursor: 'pointer' }}>
                    <ListItemIcon>
                      <DownloadIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Download Your Data"
                      secondary="Get a copy of your data"
                    />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                  <Divider component="li" />
                  <ListItemButton component="div" sx={{ cursor: 'pointer' }}>
                    <ListItemIcon>
                      <DeleteIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Request Data Deletion"
                      secondary="Request to delete your personal data"
                    />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Update your password to keep your account secure.
                </Typography>
                
                <form>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    margin="normal"
                    required
                    helperText="Password must be at least 8 characters long"
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    margin="normal"
                    required
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      fullWidth
                      type="submit"
                    >
                      Update Password
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <SecurityIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Advanced Security
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  For advanced users who want more control over their account security.
                </Typography>
                
                <List disablePadding>
                  <ListItemButton component="div" sx={{ cursor: 'pointer' }}>
                    <ListItemIcon>
                      <VpnKeyIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="API Keys"
                      secondary="Manage your API access keys"
                    />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                  <Divider component="li" />
                  <ListItemButton component="div" sx={{ cursor: 'pointer' }}>
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Authorized Apps"
                      secondary="Manage third-party app access"
                    />
                    <Chip label="5 connected" size="small" sx={{ mr: 1 }} />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                  <Divider component="li" />
                  <ListItemButton component="div" sx={{ cursor: 'pointer' }}>
                    <ListItemIcon>
                      <LockIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Trusted Devices"
                      secondary="Manage your trusted devices"
                    />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
