import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Article, Category, Inventory2 } from '@mui/icons-material';


const Leftbar = () => {

    const dispatch = useDispatch();

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
                        <ListItemButton>
                            <ListItemIcon>
                                <Article />
                            </ListItemIcon>
                            <ListItemText primary="Appointments" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={()=>navigate('/categories')}>
                            <ListItemIcon>
                                <Category />
                            </ListItemIcon>
                            <ListItemText primary="Categories" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/products')}>
                            <ListItemIcon>
                                <Inventory2 />
                            </ListItemIcon>
                            <ListItemText primary="Products" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
}

export default Leftbar