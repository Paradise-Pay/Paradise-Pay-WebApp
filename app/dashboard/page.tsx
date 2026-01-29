'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Skeleton,
  Grid
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { 
  Event as EventIcon, 
  ConfirmationNumber as TicketIcon, 
  AccountBalanceWallet as WalletIcon 
} from '@mui/icons-material';
import Link from 'next/link';
import { getOrganizerEvents, getUserTickets } from '@/lib/api'; 
import ParadiseCardSwitcher from '@/components/sections/dashboard/ParadiseCard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  href: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [activeTicketsCount, setActiveTicketsCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch Events (Calculate Upcoming Events)
      // We assume getOrganizerEvents returns an array of events created by user
      const eventsRes = await getOrganizerEvents();
      // Handle array or wrapped response
      const eventsData = Array.isArray(eventsRes) ? eventsRes : (eventsRes as any).data || [];
      
      // Filter for future events if needed, or just count them all
      const futureEvents = eventsData.filter((e: any) => new Date(e.event_date) > new Date());
      setUpcomingEventsCount(futureEvents.length);

      // 2. Fetch Tickets (Calculate Active Tickets)
      const ticketsRes = await getUserTickets();
      const ticketsData = Array.isArray(ticketsRes) ? ticketsRes : (ticketsRes as any).data || [];
      
      // Filter active tickets (assuming active means not past event date)
      // You might need to adjust logic based on your ticket status field
      const activeTickets = ticketsData.filter((t: any) => t.status !== 'cancelled' && t.status !== 'refunded');
      setActiveTicketsCount(activeTickets.length);

      // 3. Wallet Balance (Placeholder Logic)
      // Since there is no wallet endpoint yet, we can either:
      // A. Leave as 0
      // B. Sum up ticket values (if you want to simulate "spent")
      // C. Hardcode for now
      setWalletBalance(0.00); 
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Don't show error to user, just log it. Show 0s instead.
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
        <Box display="flex" justifyContent="space-between"   mb={2}>
          <Icon color={color} />
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
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
        Welcome, { user?.name || "User"}!
      </Typography>
      <Typography color="text.secondary" paragraph>
        Here&apos;s what&apos;s happening with your account today.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2, mb: 4 }}>
        {/* LEFT COLUMN: Paradise Card Switcher */}
        <Grid
          item
          xs={12} md={7} lg={8}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ParadiseCardSwitcher
            cardHolderName={user?.name || "User"}
            expiryDate="07/29"
            qrData={`https://paradisepay.com/u/${user?.id}`}
          />
        </Grid>

        {/* RIGHT COLUMN: Stacked Stat Cards */}
        <Grid item xs={12} md={5} lg={4}>
          <Grid container spacing={2}>
            {/* Stat Card 1 */}
            <Grid item xs={12}>
              <StatCard
                title="Upcoming Events"
                value={upcomingEventsCount}
                icon={EventIcon}
                color="primary"
                href="/dashboard/events"
              />
            </Grid>

            {/* Stat Card 2 */}
            <Grid item xs={12}>
              <StatCard
                title="Active Tickets"
                value={activeTicketsCount}
                icon={TicketIcon}
                color="secondary"
                href="/dashboard/tickets"
              />
            </Grid>

            {/* Stat Card 3 */}
            <Grid item xs={12}>
              <StatCard
                title="Bundle Balance"
                value={`GH₵${walletBalance.toFixed(2)}`}
                icon={WalletIcon}
                color="success"
                href="/dashboard"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}