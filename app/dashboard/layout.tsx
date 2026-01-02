'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, AppBar, IconButton, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Theme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '@/context/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';
import {
  Home as HomeIcon,
  ConfirmationNumber as TicketIcon,
  Event as EventIcon,
  AccountBalanceWallet as WalletIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  People as UserIcon,
  MonetizationOn as MoneyIcon,
  AddBusiness as MarketIcon,
  BarChart as ReportsIcon,
  SupportAgent as SupportIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  EVENT_MANAGER: 'Event Manager',
  FINANCE_ADMIN: 'Finance/Admin',
  SUPPORT_AGENT: 'Support Agent',
  CUSTOMER: 'Customer',
};

const menuItems = [
  { 
    text: 'Admin', 
    icon: <AdminIcon />, 
    path: '/dashboard/admin-dash',
    allowedRoles: [ROLES.SUPER_ADMIN] 
  },
  { 
    text: 'Dashboard', 
    icon: <HomeIcon />, 
    path: '/dashboard',
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.EVENT_MANAGER, ROLES.FINANCE_ADMIN, ROLES.SUPPORT_AGENT, ROLES.CUSTOMER] 
  },
  { 
    text: 'Finances', 
    icon: <MoneyIcon />, 
    path: '/dashboard/finances',
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.FINANCE_ADMIN] 
  },
  { 
    text: 'Manage Events', 
    icon: <EventIcon />, 
    path: '/dashboard/manage-events',
    allowedRoles: [ROLES.SUPER_ADMIN] 
  },
  { 
    text: 'Manage Users', 
    icon: <UserIcon />, 
    path: '/dashboard/manage-users',
    allowedRoles: [ROLES.SUPER_ADMIN] 
  },
  { 
    text: 'Marketing', 
    icon: <MarketIcon />, 
    path: '/dashboard/marketing',
    allowedRoles: [ROLES.SUPER_ADMIN] 
  },
  { 
    text: 'My Events', 
    icon: <EventIcon />, 
    path: '/dashboard/events',
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.EVENT_MANAGER] 
  },
  { 
    text: 'My Tickets', 
    icon: <TicketIcon />, 
    path: '/dashboard/tickets',
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.EVENT_MANAGER, ROLES.FINANCE_ADMIN, ROLES.SUPPORT_AGENT, ROLES.CUSTOMER] 
  },
  { 
    text: 'Reports', 
    icon: <ReportsIcon />, 
    path: '/dashboard/reports',
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.FINANCE_ADMIN] 
  },
  { 
    text: 'Settings', 
    icon: <SettingsIcon />, 
    path: '/dashboard/settings',
     allowedRoles: [ROLES.SUPER_ADMIN, ROLES.EVENT_MANAGER, ROLES.FINANCE_ADMIN, ROLES.SUPPORT_AGENT, ROLES.CUSTOMER]
  },
  { 
    text: 'Support', 
    icon: <SupportIcon />, 
    path: '/dashboard/support',
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT] 
  },
  { 
    text: 'Ticket & Bundle Control', 
    icon: <TicketIcon />, 
    path: '/dashboard/manage-tickets-bundles',
    allowedRoles: [ROLES.SUPER_ADMIN] 
  },
  { 
    text: 'Wallet', 
    icon: <WalletIcon />, 
    path: '/dashboard/wallet',
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.EVENT_MANAGER, ROLES.FINANCE_ADMIN, ROLES.SUPPORT_AGENT, ROLES.CUSTOMER] 
  },
];

export const getMenuByRole = (userRole: string) => {
  return menuItems.filter(item => item.allowedRoles.includes(userRole));
};

const currentUserRole = ROLES.CUSTOMER; 
const visibleMenuItems = getMenuByRole(currentUserRole);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const DRAWER_WIDTH = 240;
  const COLLAPSED_DRAWER_WIDTH = 65;

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const currentDrawerWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          px: 1,
        }}
      >
        {/* Hide Logo when collapsed to prevent overflow */}
        {!isCollapsed && (
          <Box 
            as="button"
            cursor={"pointer"}
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => router.push("/")}
          >
            <Image
              src="/logos/Paradise Pay_Logo.png"
              alt="Paradise Pay"
              width={120}
              height={40}
              priority
            />
          </Box>
        )}

        {/* Toggle Button: Swaps icon based on state */}
        <IconButton onClick={handleCollapseToggle}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />

      <List>
        {visibleMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            {/* Add Tooltip for better UX when collapsed */}
            <Tooltip title={isCollapsed ? item.text : ""} placement="right">
              <ListItemButton
                component={Link}
                href={item.path}
                selected={pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: isCollapsed ? "center" : "initial", // Center icon if collapsed
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "action.selected",
                    "&:hover": { backgroundColor: "action.hover" },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? "auto" : 3, // Remove margin if collapsed
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: isCollapsed ? 0 : 1,
                    display: isCollapsed ? "none" : "block",
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          transition: (theme: Theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === pathname)?.text ||
              "Dashboard"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ThemeToggle />
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls="account-menu"
              aria-haspopup="true"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.firstName?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: currentDrawerWidth },
          flexShrink: { sm: 0 },
          transition: (theme: Theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: currentDrawerWidth, // Dynamic Width
              overflowX: "hidden", // Hide scrollbar during transition
              transition: (theme: Theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // Ensure content width adjusts
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          mt: "64px",
          transition: (theme: Theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => router.push("/dashboard/profile")}>
          <Avatar /> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
