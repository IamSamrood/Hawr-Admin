import { Box, Button, Grid, MenuItem, Select, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, } from "@mui/material";
import Leftbar from "../../components/Leftbar/Leftbar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useEffect, useState } from "react";
import moment from "moment";
import { getOrders, updateOrderStatus } from "../../httpCalls/order";


const Orders = () => {

    const [orders, setOrders] = useState([]);
    const rowsPerPageOptions = [5, 10, 25];
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);




    const handleChangePage = (event, newPage) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };



    const getAllOrders = async (page, rowsPerPage) => {
        let { orders, total } = await getOrders(page, rowsPerPage);
        setOrders(orders);
        setTotal(total);
    };

    const handleStatusChange = async (status, id) => {
        try {
            let { order } = await updateOrderStatus(status, id);
            getAllOrders();
            
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        getAllOrders(page, rowsPerPage);
    }, [rowsPerPage, page]);




    return (
        <Grid container>
            <Grid item xs={12} md={2}>
                <Leftbar />
            </Grid>
            <Grid item xs={12} md={10} sx={{
                ml: { xs: 2, md: 0 }
            }}>
                <Stack spacing={2} mt={2}>
                    <Box>
                        <TextField
                            value={''}
                            label="Search"
                            variant="outlined"
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ marginBottom: 1, marginInlineEnd: 2 }}
                        />
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                sx={{ marginBottom: 1, marginInlineEnd: 2 }}
                                label="Start Date"
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" />
                                )}
                            />
                            <DatePicker
                                sx={{ marginBottom: 1, marginInlineEnd: 2 }}
                                label="End Date"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        sx={{ marginBottom: 2 }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Box>
                </Stack>
                <Stack direction="row" justifyContent={'end'}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginBottom: 2, marginInlineEnd: 2, width: 60 }}
                    // onClick={() => handleFilter()}
                    >
                        Filter
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ marginBottom: 2, marginInlineEnd: 2, width: 60 }}
                    // onClick={() => clearAll()}
                    >
                        Clear
                    </Button>
                </Stack>
                <h1>Orders</h1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Pyament Method</TableCell>
                                <TableCell>Pyament Status</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell>Delivery Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {


                                orders?.map((app) => (
                                    <TableRow key={app._id}>
                                        <TableCell>{app._id}</TableCell>
                                        <TableCell>{moment(app?.date).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell>
                                           {app?.paymentMethod}
                                        </TableCell>
                                        <TableCell>
                                            {app?.status}
                                        </TableCell>
                                        <TableCell>
                                            <a href="/order/items">view items</a>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={app?.deliveryStatus} // Assuming app.deliveryStatus contains the delivery status
                                                onChange={(e) => handleStatusChange(e.target.value, app._id)}
                                                style={{
                                                    backgroundColor: 'lavender', // Define getStatusColor function to determine color based on status
                                                    color: "white",
                                                }}
                                            >
                                                {['Placed', 'Packed', 'Shipped', 'Out for the delivery', 'Delivered'].map(status => (
                                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
};

export default Orders;