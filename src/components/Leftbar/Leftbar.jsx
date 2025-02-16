import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Article, Category, Inventory2, LocalOffer, Grading } from '@mui/icons-material';

const Leftbar = () => {
    const navigate = useNavigate();

    return (
        <Box flex={1}
            sx={{
                display: { xs: "none", md: "block" },
                paddingRight: "3rem",
            }}
        >
            <Box position='fixed'>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/')}>
                            <ListItemIcon>
                                <Inventory2 />
                            </ListItemIcon>
                            <ListItemText primary="Products" />
                        </ListItemButton>
                    </ListItem>
                </List>

                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/orders')}>
                            <ListItemIcon>
                                <Grading />
                            </ListItemIcon>
                            <ListItemText primary="Orders" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
}

export default Leftbar
