import { Box, Button, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, } from "@mui/material";
import Leftbar from "../../components/Leftbar/Leftbar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useEffect, useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { addCouponPost, getCoupons } from "../../httpCalls/coupon";
import AddEditCouponModal from "../../components/AddCoupon/AddCoupon";


const Coupons = () => {

    const [coupons, setCoupons] = useState([]);
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



    const getAllCoupons = async (page, rowsPerPage) => {
        let { coupons, total } = await getCoupons(page, rowsPerPage);
        setCoupons(coupons);
        setTotal(total);
    };

    useEffect(() => {
        getAllCoupons(page, rowsPerPage);
    }, [rowsPerPage, page]);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialValues, setInitialValues] = useState({ code: '', offer: '' });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEditClick = (code, offer, id) => {
        setInitialValues({
            code, offer, id
        });
        handleOpenModal();
    }

    const addCoupon = async (formData) => {
        addCouponPost(formData)
    };

    const editCoupon = async (couponId, formData) => {
        // Implement logic to edit category using categoryId and formData
        console.log('Editing category:', couponId, formData);
    };

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
                <h1>Coupons</h1>
                <Button onClick={() => handleOpenModal()}>
                    Add Coupon
                </Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>code</TableCell>
                                <TableCell>offer</TableCell>
                                <TableCell>Options</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {


                                coupons?.map((app) => (
                                    <TableRow key={app._id}>
                                        <TableCell>{app._id}</TableCell>
                                        <TableCell>{app.code}</TableCell>
                                        <TableCell>
                                            {app.offer}
                                        </TableCell>
                                        
                                        <TableCell>
                                            <IconButton onClick={() => handleEditClick(app.code, app.offer, app._id)}>
                                                <Edit sx={{ color: 'blue' }} />
                                            </IconButton>
                                            <IconButton>
                                                <Delete sx={{ color: 'red' }} />
                                            </IconButton>
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
            <AddEditCouponModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                initialValues={initialValues}
                addCoupon={addCoupon}
                editCoupon={editCoupon}
            />
        </Grid>
    );
};

export default Coupons