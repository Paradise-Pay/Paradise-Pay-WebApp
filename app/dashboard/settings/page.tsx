'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Alert, 
  Snackbar,
  IconButton,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  InputAdornment,
  Skeleton,
  Chip,
  Grid
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
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
  Devices as DevicesIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
  Download as DownloadIcon,
  Language as LanguageIcon
} from '@mui/icons-material';

import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateUserDetails, uploadUserAvatar } from '@/lib/api';

// --- Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified?: boolean;
  phone?: string;
  avatar?: string;
}

interface ExtendedProfile extends User {
  bio?: string;
  location?: string;
  timezone?: string;
  preferences?: {
    theme?: string;
    language?: string;
    currency?: string;
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
  };
  security?: {
    twoFactorAuth?: boolean;
    loginAlerts?: boolean;
    recentActivity?: any[];
  };
}

interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  preferences?: ExtendedProfile['preferences'];
  notifications?: ExtendedProfile['notifications'];
  security?: ExtendedProfile['security'];
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
}

// --- Constants ---

const timezones = [
  'UTC-12:00', 'UTC-08:00', 'UTC-05:00', 'UTC+00:00', 
  'UTC+01:00', 'UTC+03:00', 'UTC+05:30', 'UTC+08:00', 'UTC+09:00'
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

const currencies = [
  { code: 'GHS', name: 'Ghanaian Cedi (GH₵)' },
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'GBP', name: 'British Pound (£)' },
];

export default function ProfileSettingsPage() {
  const { user: authUser, updateProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({});
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '' });

  // --- Helpers ---

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const splitName = (fullName: string) => {
    const parts = fullName ? fullName.split(' ') : [''];
    const first = parts[0] || '';
    const last = parts.slice(1).join(' ') || '';
    return { first, last };
  };

  // --- Fetch Data ---
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    let profileData: ExtendedProfile | null = null;

    try {
      // 1. Try fetching from API
      const response = await getUserProfile();
      if (response.success && response.data) {
        profileData = response.data as unknown as ExtendedProfile;
      }
    } catch (err) {
      console.warn("API Fetch failed, falling back to context:", err);
      // Suppress UI error if we have authUser fallback
    }

    // 2. Fallback to Auth Context if API failed or returned null
    if (!profileData && authUser) {
      console.log("Using AuthContext Fallback. Current User:", authUser); // Debug log
      profileData = {
        ...authUser,
        bio: '',
        location: '',
        timezone: 'UTC+00:00',
        preferences: { currency: 'USD', language: 'en', theme: 'system' },
        notifications: { email: true, push: false, sms: false, marketing: false },
        security: { twoFactorAuth: false, loginAlerts: true, recentActivity: [] }
      };
    }

    if (profileData) {
      setProfile(profileData);
      
      const { first, last } = splitName(profileData.name || '');
      
      const rawData = profileData as any;
      const phoneNumber = profileData.phone || rawData.phoneNumber || rawData.mobile || '';

      setFormData({
        firstName: first,
        lastName: last,
        phone: phoneNumber,
        bio: profileData.bio || '',
        location: profileData.location || '',
        timezone: profileData.timezone || 'UTC+00:00',
        preferences: profileData.preferences || { currency: 'USD', language: 'en', theme: 'system' },
        notifications: profileData.notifications || { email: true, push: false, sms: false, marketing: false },
        security: profileData.security || { twoFactorAuth: false, loginAlerts: true, recentActivity: [] }
      });
    } else {
      setError("Unable to load user profile.");
    }

    setLoading(false);
  }, [authUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // --- Input Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const { name, value } = e.target;
    if (name === 'timezone') {
        setFormData(prev => ({ ...prev, [name]: value as string }));
    }
  };

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: any; type?: string; checked?: boolean } }, 
    section: 'preferences' | 'notifications' | 'security'
  ) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [target.name]: value
      }
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- Save Logic ---

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      // 1. Upload Avatar if changed
      let newAvatarUrl = profile.avatar;
      if (avatarFile) {
        const avatarRes = await uploadUserAvatar(avatarFile);
        if (avatarRes.success && avatarRes.data) {
          newAvatarUrl = avatarRes.data.avatarUrl;
        }
      }

      // 2. Combine Names for the API
      const newName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();

      // 3. Update using updateUserDetails
      const response = await updateUserDetails(profile.id, {
        name: newName,
        phone: formData.phone,
        // The updateUserDetails function in api.ts only accepts name, phone, and nickname
        // We will only send those. Other fields like preferences might need a different endpoint.
      });

      if (response.success) {
        // Update local state
        const updatedUser = { 
            ...profile, 
            name: newName,
            phone: formData.phone,
            avatar: newAvatarUrl,
            bio: formData.bio,
            location: formData.location,
            preferences: formData.preferences,
            notifications: formData.notifications
        };
        setProfile(updatedUser);
        
        // Update Auth Context
        if (updateProfile) {
          await updateProfile({
            ...authUser, // Keep existing auth fields
            id: profile.id,
            name: newName,
            email: profile.email,
            avatar: newAvatarUrl,
            role: profile.role
          });
        }

        setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
        setIsEditing(false);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating profile';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (error && !profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Profile Settings
        </Typography>
        <Box display="flex" gap={2}>
          {isEditing ? (
            <>
              <Button variant="outlined" onClick={() => { setIsEditing(false); fetchProfile(); }} disabled={saving}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="scrollable"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
        <Tab label="Account" icon={<LockIcon />} iconPosition="start" />
        <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
        <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
      </Tabs>

      {/* TAB 1: PROFILE */}
      {activeTab === 0 && profile && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, textAlign: 'center' }}>
                <Box position="relative" mb={3}>
                  <Avatar 
                    src={avatarPreview || profile.avatar || ''} 
                    alt="Profile"
                    sx={{ width: 120, height: 120, fontSize: '3rem', bgcolor: 'primary.main' }}
                  >
                    {formData.firstName?.[0] || profile.name?.[0]}
                  </Avatar>
                  {isEditing && (
                    <label htmlFor="avatar-upload">
                      <input accept="image/*" id="avatar-upload" type="file" className="hidden" style={{ display: 'none' }} onChange={handleAvatarChange} />
                      <IconButton color="primary" component="span" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper', boxShadow: 1 }}>
                        <CameraAltIcon />
                      </IconButton>
                    </label>
                  )}
                </Box>
                <Typography variant="h6">{profile.name}</Typography>
                <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                <Chip 
                  label={profile.role?.toUpperCase()} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mt: 1 }} 
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth label="First Name" name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth label="Last Name" name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth label="Email" value={profile.email} disabled
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth label="Phone" name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Bio" name="bio"
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      multiline rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        name="timezone"
                        value={formData.timezone || ''}
                        label="Timezone"
                        onChange={handleSelectChange}
                      >
                        {timezones.map((tz) => (
                          <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Preferences</Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        name="currency"
                        value={formData.preferences?.currency || 'USD'}
                        label="Currency"
                        onChange={(e: any) => handleNestedChange({ target: { name: 'currency', value: e.target.value } } as any, 'preferences')}
                      >
                        {currencies.map(c => <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel>Language</InputLabel>
                      <Select
                        name="language"
                        value={formData.preferences?.language || 'en'}
                        label="Language"
                        onChange={(e: any) => handleNestedChange({ target: { name: 'language', value: e.target.value } } as any, 'preferences')}
                      >
                        {languages.map(l => <MenuItem key={l.code} value={l.code}>{l.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* TAB 2: ACCOUNT */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6">Account Settings</Typography>
            <List>
              <ListItemButton>
                <ListItemIcon><LockIcon /></ListItemIcon>
                <ListItemText primary="Change Password" secondary="Update your secure password" />
                <ChevronRightIcon />
              </ListItemButton>
              <Divider />
              <ListItemButton onClick={() => setSnackbar({ open: true, message: "Delete functionality coming soon", severity: 'info' })}>
                <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
                <ListItemText primary="Delete Account" secondary="Permanently delete your data" />
              </ListItemButton>
            </List>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Email Notifications</Typography>
            <List>
              <ListItemButton>
                <ListItemText primary="Marketing Emails" secondary="Receive updates about new features" />
                <Switch 
                  checked={formData.notifications?.marketing ?? false}
                  onChange={(e: any) => handleNestedChange(e, 'notifications')}
                  name="marketing"
                  disabled={!isEditing}
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Security Alerts" secondary="Get notified about logins" />
                <Switch 
                  checked={true} disabled 
                />
              </ListItemButton>
            </List>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: SECURITY */}
      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Security</Typography>
            <List>
              <ListItemButton>
                <ListItemIcon><SecurityIcon /></ListItemIcon>
                <ListItemText primary="Two-Factor Authentication" secondary="Add an extra layer of security" />
                <Switch 
                  checked={formData.security?.twoFactorAuth ?? false}
                  onChange={(e: any) => handleNestedChange(e, 'security')}
                  name="twoFactorAuth"
                  disabled={!isEditing}
                />
              </ListItemButton>
            </List>
            
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Recent Activity</Typography>
            {formData.security?.recentActivity && formData.security.recentActivity.length > 0 ? (
              <List dense>
                {formData.security.recentActivity.map((log: any, index: number) => (
                  <ListItemButton key={index}>
                    <ListItemIcon><HistoryIcon /></ListItemIcon>
                    <ListItemText 
                      primary={log.action} 
                      secondary={`${new Date(log.timestamp).toLocaleString()} • ${log.location}`} 
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No recent activity logs found.</Typography>
            )}
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}