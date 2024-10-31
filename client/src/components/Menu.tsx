import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useHistory } from 'react-router-dom';

export default function MenuAppBar(data: any) {
  const [selection, setSelection] = useState(data.page);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const history = useHistory();
  const handleRoutes = (path: string) => {
    history.push(path);
  };

  const handleClose = (event: any, item: string) => {
    if (item !== "backdropClick") {
      setSelection(item);
    }
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, zIndex: 2 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {selection}
          </Typography>
          <div>
            Navigation Menu -{'>'}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={(event) => {
                  handleClose(event, 'Home');
                  handleRoutes('/');
                }}
              >
                Home
              </MenuItem>
              <hr />
              <strong>Web Tools</strong>
              <MenuItem
                onClick={(event) => {
                  handleClose(event, 'Crescent Electric Reach List');
                  handleRoutes('/CrescentElectricReachList');
                }}
              >
                Crescent Electric Reach List
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  handleClose(event, 'Disconnect List');
                  handleRoutes('/DisconnectList');
                }}
              >
                Disconnect List
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  handleClose(event, 'Resident Directory');
                  handleRoutes('/ResidentDirectory');
                }}
              >
                Resident Directory
              </MenuItem>
              {/* Client Info Menu Item */}
              <MenuItem
                onClick={(event) => {
                  handleClose(event, 'Client Info');
                  handleRoutes('/ClientInfo');
                }}
              >
                Client Info
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  handleClose(event, 'Vessel API');
                  handleRoutes('/Vessels');
                }}
              >
                Vessel API
              </MenuItem>
              <hr />
              <strong>Other</strong>
              <MenuItem
                onClick={(event) => {
                  handleClose(event, 'How To');
                  handleRoutes('/HowTo');
                }}
              >
                How To
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  handleClose(event, 'Info');
                  handleRoutes('/Info');
                }}
              >
                Info
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

