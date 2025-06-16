import React, { useState, useEffect } from 'react';
import translations from '../utils/translations';
import { Link as RouterLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  useMediaQuery,
  useTheme as useMuiTheme,
  Tooltip,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Medication as MedicationIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Person as PersonIcon,
  FlightTakeoff as FlightIcon,
  Logout as LogoutIcon,
  MedicalInformation as MedicalIcon,
  SupervisorAccount as SupervisorIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { animations } from '../theme/animations';
import { useAuth, USER_TYPES } from '../context/AuthContext';
import NotificationChecker from './NotificationChecker';

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, mode, toggleTheme } = useTheme();
  const { currentUser, userType, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };
  
  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };
  
  // Define menu items based on user type
  const getMenuItems = () => {
    const commonItems = [
      { text: translations.dashboard, icon: <DashboardIcon />, path: '/' },
      { text: translations.schedule, icon: <ScheduleIcon />, path: '/schedule' },
    ];
    
    // Items specific to client users
    const clientItems = [
      { text: translations.medications, icon: <MedicationIcon />, path: '/medications' },
      { text: translations.addMedication, icon: <AddIcon />, path: '/add-medication' },
      { text: translations.travelMode, icon: <FlightIcon />, path: '/travel' }
    ];
    
    // Items specific to caregiver users
    const caregiverItems = [
      { text: translations.medications, icon: <MedicationIcon />, path: '/medications' },
      { text: translations.addMedication, icon: <AddIcon />, path: '/add-medication' },
      { text: 'Patients', icon: <MedicalIcon />, path: '/patients' }
    ];
    
    // Items specific to responsible users
    const responsibleItems = [
      { text: 'Care Receivers', icon: <SupervisorIcon />, path: '/care-receivers' },
      { text: 'Updates', icon: <NotificationsIcon />, path: '/updates' }
    ];
    
    // Return appropriate items based on user type
    switch (userType) {
      case USER_TYPES.CLIENT:
        return [...commonItems, ...clientItems];
      case USER_TYPES.CAREGIVER:
        return [...commonItems, ...caregiverItems];
      case USER_TYPES.RESPONSIBLE:
        return [...commonItems, ...responsibleItems];
      default:
        return commonItems;
    }
  };
  
  const menuItems = currentUser ? getMenuItems() : [];

  // Get appropriate icon based on user type
  const getUserIcon = () => {
    if (!currentUser) return <PersonIcon />;
    
    switch (userType) {
      case USER_TYPES.CAREGIVER:
        return <MedicalIcon />;
      case USER_TYPES.RESPONSIBLE:
        return <SupervisorIcon />;
      default:
        return <PersonIcon />;
    }
  };
  
  const drawer = (
    <div>
      <Toolbar sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: theme.palette.primary.contrastText,
        transition: 'all 0.3s ease',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              mr: 2, 
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
              color: theme.palette.secondary.contrastText,
              width: 40,
              height: 40,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              animation: `${animations.pulse.animation}`,
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            SL
          </Avatar>
          <Typography variant="h6" noWrap component="div" sx={{ 
            fontWeight: 700,
            letterSpacing: '0.5px',
            background: 'linear-gradient(90deg, #ffffff, #e0e0e0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            SaveLife
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              margin: '4px 8px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: theme.palette.primary.contrastText,
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.contrastText,
                },
              },
              '&.Mui-selected:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              },
              '&:hover': {
                backgroundColor: mode === 'light' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: location.pathname === item.path ? 
                  theme.palette.primary.contrastText : 
                  theme.palette.text.primary 
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Notification Checker - invisible component that checks for upcoming medications */}
      <NotificationChecker />
      
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              letterSpacing: '0.5px',
              animation: `${animations.fadeIn.animation}`,
            }}
          >
            {menuItems.find(item => item.path === location.pathname)?.text || 'SaveLife'}
          </Typography>
          
          {/* Dark Mode Toggle */}
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          
          {/* User Avatar and Menu */}
          {currentUser ? (
            <>
              <Tooltip title="Account settings">
                <IconButton 
                  color="inherit" 
                  sx={{ ml: 1 }}
                  onClick={handleMenuOpen}
                  aria-controls="user-menu"
                  aria-haspopup="true"
                >
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}>
                    {getUserIcon()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
              sx={{ ml: 1 }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          p: { xs: 2, sm: 3 }, 
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          marginTop: { xs: '56px', sm: '64px' },
          overflow: 'hidden',
          backgroundColor: mode === 'dark' ? 'background.default' : '#f5f7fa',
          backgroundImage: mode === 'dark' 
            ? 'radial-gradient(circle at 25% 25%, rgba(30, 64, 175, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(30, 64, 175, 0.15) 0%, transparent 50%)'
            : 'radial-gradient(circle at 25% 25%, rgba(25, 118, 210, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(25, 118, 210, 0.05) 0%, transparent 50%)',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="lg" sx={{ 
          py: 2,
          '& > *': {
            animation: `${animations.fadeIn.animation}`,
          } 
        }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
