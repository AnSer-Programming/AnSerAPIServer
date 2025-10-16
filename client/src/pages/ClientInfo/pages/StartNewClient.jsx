import React, { useState } from 'react';
import {
  Box,
  Paper,
  Container,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
} from '@mui/material';
import {
  BusinessOutlined,
  PhoneOutlined,
  ScheduleOutlined,
  ReviewsOutlined,
  CheckCircleOutlined,
  TimerOutlined,
  PlayArrowRounded,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import ClientInfoNavbar from '../shared_layout_routing/ClientInfoNavbar';
import ClientInfoFooter from '../shared_layout_routing/ClientInfoFooter';
import { createSharedStyles } from '../utils/sharedStyles';
import { WIZARD_ROUTES } from '../constants/routes';

// Import AnSer logo
import AnSerLogoStar from '../../../assets/img/ClientInfo/AnSerLogoStar.png';

const StartNewClient = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const theme = useTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loadingMode, setLoadingMode] = useState(null);
  const isLoading = Boolean(loadingMode);

  const handleStart = async () => {
    setLoadingMode('standard');
    // Simulate brief loading for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    history.push(WIZARD_ROUTES.COMPANY_INFO);
  };

  const setupSteps = [
    { icon: <BusinessOutlined />, title: 'Basic Info', desc: 'Essential contacts and addresses' },
    { icon: <ScheduleOutlined />, title: 'What You Need From Us', desc: 'Availability, hours, and expectations' },
    { icon: <PhoneOutlined />, title: 'Call Handling', desc: 'How we should answer and route callers' },
    { icon: <ReviewsOutlined />, title: 'Review & Submit', desc: 'Double-check the details before launch' },
  ];

  const benefits = [
    'Professional call answering 24/7',
    'Customized greeting and procedures',
    'Seamless integration with your business',
    'Detailed call reporting and analytics',
  ];

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>
      <ClientInfoNavbar />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        {/* Hero Section */}
        <Fade in timeout={800}>
          <Paper 
            elevation={3} 
            sx={{ 
              ...sharedStyles.layout.wizardCard,
              textAlign: 'center',
              p: { xs: 4, md: 8 },
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
              border: `1px solid ${theme.palette.primary.main}20`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <img
                src={AnSerLogoStar}
                alt="AnSer Communications"
                style={{ 
                  height: isMobile ? 80 : 120, 
                  marginBottom: 20,
                  filter: darkMode ? 'brightness(0.9)' : 'none'
                }}
              />
            </Box>
            
            <Typography 
              variant={isMobile ? 'h4' : 'h3'} 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                color: theme.palette.primary.main,
                mb: 2
              }}
            >
              Welcome to AnSer
            </Typography>
            
            <Typography 
              variant={isMobile ? 'h6' : 'h5'}
              color="text.secondary" 
              sx={{ 
                mb: 3,
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Let's set up your professional call handling service in just a few easy steps
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Chip 
                icon={<TimerOutlined />} 
                label="~15 minutes" 
                color="primary" 
                variant="outlined"
                size={isMobile ? 'small' : 'medium'}
              />
              <Chip 
                icon={<CheckCircleOutlined />} 
                label="4 simple steps" 
                color="secondary" 
                variant="outlined"
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleStart}
                disabled={isLoading}
                startIcon={loadingMode === 'standard' ? <CircularProgress size={20} /> : <PlayArrowRounded />}
                sx={{ 
                  ...sharedStyles.navigation.nextButton,
                  minWidth: isMobile ? 240 : 260,
                  py: isMobile ? 1.5 : 2,
                  fontSize: isMobile ? '1rem' : '1.05rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {loadingMode === 'standard' ? 'Starting Your Setup…' : 'START CLIENT SETUP'}
              </Button>

            </Box>

          </Paper>
        </Fade>

        {/* Setup Steps Preview */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                textAlign: 'center', 
                mb: 3, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              What We'll Set Up Together
            </Typography>
            
            <Grid container spacing={3}>
              {setupSteps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[6],
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box 
                        sx={{ 
                          color: theme.palette.primary.main, 
                          mb: 2,
                          '& svg': { fontSize: 40 }
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Benefits Section */}
        <Fade in timeout={1600}>
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Why Choose AnSer?
            </Typography>
            
            <List sx={{ maxWidth: 500, mx: 'auto' }}>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleOutlined sx={{ color: theme.palette.success.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={benefit}
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontSize: '1rem',
                        fontWeight: 500 
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>

        {/* Development Test Buttons - Hidden in production */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ 
            mt: 4,
            p: 2,
            textAlign: 'center',
            backgroundColor: theme.palette.warning.light + '20',
            borderRadius: 2,
            border: `1px dashed ${theme.palette.warning.main}`,
          }}>
            <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 1 }}>
              Development Tools
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              justifyContent: 'center',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <Button 
                size="small" 
                variant="outlined"
                color="warning"
                onClick={() => history.push('/ClientInfoReact/invite/mock-token-123')}
                sx={{ fontSize: '0.75rem' }}
              >
                Test Invite: mock-token-123
              </Button>
              <Button 
                size="small" 
                variant="outlined"
                color="warning"
                onClick={() => history.push('/ClientInfoReact/invite/mock-token-review')}
                sx={{ fontSize: '0.75rem' }}
              >
                Test Invite: mock-token-review
              </Button>
            </Box>
          </Box>
        )}
      </Container>

      <ClientInfoFooter />
    </Box>
  );
};

export default StartNewClient;
