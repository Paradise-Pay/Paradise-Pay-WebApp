'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Skeleton,
  Alert,
  Grid
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { 
  Event as EventIcon, 
  ConfirmationNumber as TicketIcon, 
  AccountBalanceWallet as WalletIcon 
} from '@mui/icons-material';
import Link from 'next/link';
import { getDashboardStats, getUserActivity } from '@/lib/api';
import type { DashboardStats, Activity } from '@/types/dashboard';
import ParadiseCardSwitcher from '@/components/sections/dashboard/ParadiseCard';

// User type is imported from the auth context

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  href: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard stats
      const statsResponse = await getDashboardStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        throw new Error(statsResponse.message || 'Failed to fetch dashboard stats');
      }
      
      // Fetch recent activities
      const activityResponse = await getUserActivity(5);
      if (activityResponse.success && activityResponse.data) {
        setActivities(activityResponse.data);
      }
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      
      // Fallback to mock data for development
      if (process.env.NODE_ENV === 'development') {
        setStats({
          upcomingEvents: 3,
          activeTickets: 5,
          walletBalance: 1250.75,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon,
    color = 'primary',
    href
  }: StatCardProps) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Icon color={color} />
        </Box>
        {loading ? (
          <Skeleton variant="text" width="60%" height={40} />
        ) : (
          <Typography variant="h4" component="div" color={color}>
            {value}
          </Typography>
        )}
        <Box mt={2}>
          <Button 
            component={Link} 
            href={href}
            size="small"
            color={color}
            sx={{ mt: 1 }}
          >
            View All
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name || user?.email?.split("@")[0] || "User"}!
      </Typography>
      <Typography color="text.secondary" paragraph>
        Here&apos;s what&apos;s happening with your account today.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2, mb: 4 }}>
        {/* LEFT COLUMN: Paradise Card Switcher */}
        <Grid
          size={{ xs: 12, md: 7, lg: 8 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ParadiseCardSwitcher
            cardHolderName={user?.name || user?.email?.split("@")[0] || "User"}
            expiryDate="07/29"
            qrData="https://paradisepay.com/u/eugene"
          />
        </Grid>

        {/* RIGHT COLUMN: Stacked Stat Cards */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Grid container spacing={2}>
            {/* Stat Card 1 */}
            <Grid size={{ xs: 12 }}>
              <StatCard
                title="Upcoming Events"
                value={
                  loading ? "..." : stats?.upcomingEvents?.toString() || "0"
                }
                icon={EventIcon}
                color="primary"
                href="/dashboard/events"
              />
            </Grid>

            {/* Stat Card 2 */}
            <Grid size={{ xs: 12 }}>
              <StatCard
                title="Active Tickets"
                value={
                  loading ? "..." : stats?.activeTickets?.toString() || "0"
                }
                icon={TicketIcon}
                color="secondary"
                href="/dashboard/tickets"
              />
            </Grid>

            {/* Stat Card 3 */}
            <Grid size={{ xs: 12 }}>
              <StatCard
                title="Wallet Balance"
                value={
                  loading
                    ? "..."
                    : `GH₵${stats?.walletBalance?.toFixed(2) || "0.00"}`
                }
                icon={WalletIcon}
                color="success"
                href="/dashboard/wallet"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          {loading ? (
            <Box>
              <Skeleton
                variant="rectangular"
                height={80}
                sx={{ mb: 2, borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                height={80}
                sx={{ mb: 2, borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                height={80}
                sx={{ borderRadius: 1 }}
              />
            </Box>
          ) : activities.length > 0 ? (
            <Box>
              {activities.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      {activity.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {activity.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box>
              <Typography color="text.secondary" textAlign="center" py={4}>
                No recent activity
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/events"
              sx={{ py: 2 }}
            >
              Browse Events
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/dashboard/events/create"
              sx={{ py: 2 }}
            >
              Create Event
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/dashboard/wallet/deposit"
              sx={{ py: 2 }}
            >
              Add Funds
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/support"
              sx={{ py: 2 }}
            >
              Get Help
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
