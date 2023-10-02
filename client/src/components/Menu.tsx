import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link, useHistory } from 'react-router-dom';

export default function MenuAppBar(data:any) {
  const [selection, setSelection] = useState(data.page);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const history = useHistory();
  const handleRoutes = (path:any) => {
    history.push(path);
  }

  const handleClose = (event:any, item:string) => {
    if(item !== "backdropClick") {
      setSelection(item);
    }
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, bgColor: "secondary"}}>
            {selection}
          </Typography>
          {(
            <div>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ mr: 2 }} >
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
                onClose={handleClose} >
                <MenuItem
                  onClick={(event: any) => {
                    handleClose(event, 'Home');
                    handleRoutes('/');
                  }} >
                  Home
                </MenuItem>
                <hr />
                <strong>Web Tools</strong>
                <MenuItem
                  onClick={(event: any) => {
                    handleClose(event, 'Contact Dispatch List');
                    handleRoutes('/ContactDispatch');
                  }} >
                  Contact Dispatch List
                </MenuItem>
                <MenuItem
                  onClick={(event: any) => {
                    handleClose(event, 'Disconnect List');
                    handleRoutes('/DisconnectList');
                  }} >
                  Disconnect List
                </MenuItem>
                <MenuItem
                  href="/Vessels" 
                  onClick={(event: any) => {
                    handleClose(event, 'Vessel API');
                    handleRoutes('/Vessels');
                  }} >
                  Vessel API
                </MenuItem>
                <hr />
                <strong>Other</strong>
                <MenuItem
                  href="/StatTracker" 
                  onClick={(event: any) => {
                    handleClose(event, 'Stat Tracker');
                    handleRoutes('/StatTracker');
                  }} >
                  Stat Tracker
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}