import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import { useDispatch, } from 'react-redux';
import Leftbar from '../Leftbar/Leftbar';

const LeftToggle = ({ state, setState, type }) => {

    // const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const toggleDrawer = (open) => () => {
        setState(open);
    };
    const navigate = useNavigate();
    // const userId = useSelector((state) => state.user?._id);

    const list = () => (
        <Box
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Leftbar />
        </Box>
    )
    return (
        <Drawer
            anchor="left"
            open={state}
            onClose={toggleDrawer(false)}
        >
            {list("Left")}
        </Drawer>
    )
}

export default LeftToggle