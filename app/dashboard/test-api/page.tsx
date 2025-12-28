'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Alert } from '@mui/material';
import { getDashboardStats, getUserProfile, getUserActivity } from '@/lib/api';
import { DashboardStats, UserProfile, Activity } from '@/types/dashboard';

export default function TestApiPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const testApiEndpoints = async () => {
      setLoading(true);
      const newErrors: string[] = [];

      try {
        // Test dashboard stats
        const statsResponse = await getDashboardStats();
        if (statsResponse.success && statsResponse.data) {
          setDashboardStats(statsResponse.data);
          console.log('✅ Dashboard stats API working:', statsResponse.data);
        } else {
          newErrors.push('Dashboard stats API failed: ' + (statsResponse.message || 'Unknown error'));
        }

        // Test user profile
        const profileResponse = await getUserProfile();
        if (profileResponse.success && profileResponse.data) {
          setUserProfile(profileResponse.data);
          console.log('✅ User profile API working:', profileResponse.data);
        } else {
          newErrors.push('User profile API failed: ' + (profileResponse.message || 'Unknown error'));
        }

        // Test user activities
        const activityResponse = await getUserActivity(5);
        if (activityResponse.success && activityResponse.data) {
          setUserActivities(activityResponse.data);
          console.log('✅ User activities API working:', activityResponse.data);
        } else {
          newErrors.push('User activities API failed: ' + (activityResponse.message || 'Unknown error'));
        }

      } catch (error) {
        console.error('❌ API test failed:', error);
        newErrors.push('Network/API error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setErrors(newErrors);
        setLoading(false);
      }
    };

    testApiEndpoints();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Testing API Endpoints...
        </Typography>
        <Typography color="text.secondary">
          Please wait while we test the API connections.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Endpoint Test Results
      </Typography>
      
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Errors:
          </Typography>
          {errors.map((error, index) => (
            <Typography key={index} variant="body2">
              • {error}
            </Typography>
          ))}
        </Alert>
      )}

      {dashboardStats && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dashboard Stats
            </Typography>
            <Typography variant="body2">
              Upcoming Events: {dashboardStats.upcomingEvents}
            </Typography>
            <Typography variant="body2">
              Active Tickets: {dashboardStats.activeTickets}
            </Typography>
            <Typography variant="body2">
              Wallet Balance: ${dashboardStats.walletBalance.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      )}

      {userProfile && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Profile
            </Typography>
            <Typography variant="body2">
              Name: {userProfile.firstName} {userProfile.lastName}
            </Typography>
            <Typography variant="body2">
              Email: {userProfile.email}
            </Typography>
            <Typography variant="body2">
              Phone: {userProfile.phone || 'Not provided'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {userActivities.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activities ({userActivities.length})
            </Typography>
            {userActivities.map((activity) => (
              <Box key={activity.id} sx={{ mb: 1, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>{activity.title}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activity.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(activity.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {!loading && errors.length === 0 && dashboardStats && userProfile && userActivities.length > 0 && (
        <Alert severity="success" sx={{ mt: 2 }}>
          ✅ All API endpoints are working correctly with mock data!
        </Alert>
      )}
    </Box>
  );
}