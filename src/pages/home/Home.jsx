import { Box, Button, Grid, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, } from "@mui/material";
import Leftbar from "../../components/Leftbar/Leftbar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useEffect, useState } from "react";
import { changeAppointmentStatus, getAppoinments } from "../../httpCalls/appointment";
import moment from "moment";


const Home = () => {

    const [appointments, setAppointments] = useState([]);
    const rowsPerPageOptions = [5, 10, 25];
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [page, setPage] = useState(0);
    



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    const getAllAppointments = async () => {
        let data = await getAppoinments();
        setAppointments(data);
    };

    const handleStatusChange = async (status, id) => {
        let data = await changeAppointmentStatus(status, id);
        getAllAppointments();
    }

    useEffect(() => {
        getAllAppointments();
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Dept</TableCell>
                                <TableCell>Doctor</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Status</TableCell> 
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                

                                appointments?.map((app) => (
                                    <TableRow key={app._id}>
                                        <TableCell>{app._id}</TableCell>
                                        <TableCell>{app.name}</TableCell>
                                        <TableCell>{app.email}</TableCell>
                                        <TableCell sx={{
                                            textTransform:'capitalize'
                                        }}>{app.department}</TableCell>
                                        <TableCell sx={{
                                            textTransform: 'capitalize'
                                        }}>{app.doctor}
                                        </TableCell>
                                        <TableCell>
                                            {moment(app.date).format('DD/MM/YYYY')}
                                        </TableCell>
                                        <TableCell>{app.time}</TableCell>
                                        <TableCell>
                                            <Select
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(e.target.value, app._id)}
                                            style={{
                                                backgroundColor: app.status == 'pending' ? "orange" : app.status == 'approved' ?  'green' : "red",
                                                color: "white",
                                            }}
                                        >
                                            <MenuItem value={'approved'}>Apporove</MenuItem>
                                            <MenuItem value={'canceled'}>Cancel</MenuItem>
                                            <MenuItem value={'pending'}>Pending</MenuItem>
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
                    count={appointments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
};

export default Home