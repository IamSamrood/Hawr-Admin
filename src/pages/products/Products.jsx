import { Box, Button, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, } from "@mui/material";
import Leftbar from "../../components/Leftbar/Leftbar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useEffect, useState } from "react";
import moment from "moment";
import { Delete, Edit } from "@mui/icons-material";
import { addProductPost, getProducts } from "../../httpCalls/product";
import AddEditProductModal from "../../components/AddProduct/AddProduct";


const Products = () => {

    const [products, setProducts] = useState([]);
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



    const getAllProducts = async (page, rowsPerPage) => {
        let { products, total } = await getProducts(page, rowsPerPage);
        setProducts(products);
        setTotal(total);
    };

    useEffect(() => {
        getAllProducts(page, rowsPerPage);
    }, [rowsPerPage, page]);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialValues, setInitialValues] = useState({ category: '', image: '' });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEditClick = (category, image, id) => {
        setInitialValues({
            category, image, id
        });
        handleOpenModal();
    }

    const addProduct = async (formData) => {
        addProductPost(formData)
    };

    const editProduct = async (productId, formData) => {
        // Implement logic to edit product using productId and formData
        console.log('Editing product:', productId, formData);
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
                <h1>Products</h1>
                <Button onClick={() => handleOpenModal()}>
                    Add Product
                </Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Options</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {


                                products?.map((app) => (
                                    <TableRow key={app._id}>
                                        <TableCell>{app._id}</TableCell>
                                        <TableCell>{app.category.category}</TableCell>
                                        <TableCell>
                                            <Box sx={{
                                                height: '3rem',
                                                width: '3rem'
                                            }}>
                                                <img src={app.images[0]} style={{
                                                    width: '100%',
                                                    height: '100%'
                                                }} alt="" />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {moment(app.date).format('DD/MM/YYYY')}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditClick(app.category, app.image, app._id)}>
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
            <AddEditProductModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                initialValues={initialValues}
                addProduct={addProduct}
                editProduct={editProduct}
            />
        </Grid>
    );
};

export default Products