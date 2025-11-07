'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Theme } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Box, Container, IconButton, Menu, MenuItem, Typography, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '@/context/AuthProvider';
import Image from 'next/image';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isAuthenticated = !!user;

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isAuthenticated ? (
        [
          <MenuItem key="profile" component={Link} href="/dashboard/profile" onClick={handleMenuClose}>
            Profile
          </MenuItem>,
          <MenuItem key="account" component={Link} href="/dashboard/account" onClick={handleMenuClose}>
            My Account
          </MenuItem>,
          <MenuItem key="logout" onClick={handleLogout}>
            Logout
          </MenuItem>
        ]
      ) : (
        [
          <MenuItem key="login" component={Link} href="/login" onClick={handleMenuClose}>
            Login
          </MenuItem>,
          <MenuItem key="register" component={Link} href="/register" onClick={handleMenuClose}>
            Register
          </MenuItem>
        ]
      )}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem component={Link} href="/events" onClick={handleMobileMenuClose}>
        Events
      </MenuItem>
      <MenuItem component={Link} href="/pricing" onClick={handleMobileMenuClose}>
        Pricing
      </MenuItem>
      <MenuItem component={Link} href="/about" onClick={handleMobileMenuClose}>
        About
      </MenuItem>
      <MenuItem component={Link} href="/contact" onClick={handleMobileMenuClose}>
        Contact
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}` }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" passHref>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Image 
                  src="/logos/Paradise Pay_Logo.png" 
                  alt="Paradise Pay" 
                  width={40} 
                  height={40} 
                  style={{ marginRight: 8 }}
                />
                <Typography variant="h6" component="div" sx={{ fontWeight: 700, display: { xs: 'none', md: 'block' } }}>
                  Paradise Pay
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Button 
              component={Link} 
              href="/events" 
              color={pathname === '/events' ? 'primary' : 'inherit'}
              sx={{ mx: 1.5 }}
            >
              Events
            </Button>
            <Button 
              component={Link} 
              href="/pricing" 
              color={pathname === '/pricing' ? 'primary' : 'inherit'}
              sx={{ mx: 1.5 }}
            >
              Pricing
            </Button>
            <Button 
              component={Link} 
              href="/about" 
              color={pathname === '/about' ? 'primary' : 'inherit'}
              sx={{ mx: 1.5 }}
            >
              About
            </Button>
            <Button 
              component={Link} 
              href="/contact" 
              color={pathname === '/contact' ? 'primary' : 'inherit'}
              sx={{ mx: 1.5 }}
            >
              Contact
            </Button>

            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ ml: 2 }}
                >
                  <AccountCircle />
                </IconButton>
                <Button 
                  component={Link} 
                  href="/dashboard" 
                  variant="contained" 
                  color="primary"
                  sx={{ ml: 2 }}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  href="/login" 
                  variant="outlined" 
                  color="primary"
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
                <Button 
                  component={Link} 
                  href="/register" 
                  variant="contained" 
                  color="primary"
                  sx={{ ml: 2 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile menu button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      {renderMobileMenu}
      {renderMenu}
    </AppBar>
  );
};

export default Navbar;
