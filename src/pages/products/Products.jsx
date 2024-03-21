import {
    Box,
    Button,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Delete, Edit } from "@mui/icons-material";
import AddProduct from "../../Components/AddProduct/new";
import { getProducts } from "../../httpCalls/product";
import UploadJsonModal from "../../Components/AddJsonProduct/AddJsonProduct";
import { getCountryList } from "../../httpCalls/country";

const Product = () => {

    
    const token = useSelector((state) => state.token);
    const rowsPerPageOptions = [5, 10, 25];
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [gender, setGender] = useState("");
    const [fileUpload, setFileUpload] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');



    const handleChangePage = (event, newPage) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const getAllProducts = async () => {
        let query = `pageSize=${rowsPerPage}&page=${page}`;
        if (search) {
            query = query + `&search=${search}`;
        }
        if (gender) {
            query = query + `&gender=${gender}`;
        }

        if (selectedCountry) {
            query = query + `&country_code=${selectedCountry}`
        }


        // let data = await getProducts(token, product, query);
        // setProducts(data.data);
        // setTotalCount(data.totalCount);
    };

    const handleFilter = async () => {
        getAllProducts();
    };

    const handleAddProductClose = () => {
        setSelectedProduct(null);
        setOpen(false);
        setEdit(false);
    };

    const clearAll = () => {
        setSearch("");
        setGender("");
        setPage(1);
        getAllProducts();
    };

    const getAllCountries = async () => {
        let data = await getCountryList();
        setCountries(data);
    };

    useEffect(() => {
        getAllCountries();
    }, []);

    useEffect(() => {
        getAllProducts();
    }, [product, rowsPerPage, page]);

    return (
        <Grid container>
            <Grid item xs={12} md={2}>
                <Leftbar type={product} />
            </Grid>
            <Grid item xs={12} md={10}>
                <Box flex={1}>
                    <Stack spacing={2} p={4}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h4">
                                {product === "pharma"
                                    ? "Pharma"
                                    : product === "food"
                                        ? "Food"
                                        : "Doctor"}{" "}
                                {product !== "doctor" && "Products"}
                            </Typography>
                            {product !== "doctor" && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginBottom: 2 }}
                                        onClick={() => {
                                            setFileUpload(true);
                                        }}
                                    >
                                        Add File
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginBottom: 2 }}
                                        onClick={() => {
                                            setOpen(true);
                                            setEdit(false);
                                            setSelectedProduct(null);
                                        }}
                                    >
                                        Add New Product
                                    </Button>
                                </>
                            )}
                        </Stack>
                        <Box>
                            <TextField
                                value={search}
                                label="Search"
                                variant="outlined"
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ marginBottom: 1, marginInlineEnd: 2 }}
                            />
                            {product !== "doctor" && (
                                <TextField
                                    select
                                    id="country_codes"
                                    name="country_codes"
                                    label="Country"
                                    value={selectedCountry}
                                    onChange={(e) => {
                                        setSelectedCountry(e.target.value)
                                    }}
                                >
                                    {countries?.map((country) => (
                                        <MenuItem key={country._id} value={country.iso2}>
                                            {country.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                            {product === "doctor" && (
                                <TextField
                                    select
                                    label="Select Gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    sx={{ marginBottom: 1, marginInlineEnd: 2, width: "10rem" }}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </TextField>
                            )}
                            {/* <LocalizationProvider dateAdapter={AdapterMoment}>
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
              </LocalizationProvider> */}
                        </Box>
                        <Stack direction="row">
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginBottom: 2, marginInlineEnd: 2, width: 60 }}
                                onClick={() => handleFilter()}
                            >
                                Filter
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ marginBottom: 2, marginInlineEnd: 2, width: 60 }}
                                onClick={() => clearAll()}
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
                                        <TableCell>Description</TableCell>
                                        {product !== "doctor" && (
                                            <>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Option</TableCell>
                                            </>
                                        )}
                                        {product === "doctor" && <TableCell>Gender</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        //   (rowsPerPage > 0
                                        //     ? products.slice(
                                        //         page * rowsPerPage,
                                        //         page * rowsPerPage + rowsPerPage
                                        //       )
                                        //     : products
                                        //   )

                                        products?.map((pro) => (
                                            <TableRow key={pro._id}>
                                                <TableCell>{pro._id}</TableCell>
                                                <TableCell>{pro.name}</TableCell>
                                                <TableCell>{pro.description}</TableCell>
                                                {product !== "doctor" && (
                                                    <>
                                                        <TableCell>{pro.quantity}</TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                style={{ color: "black" }}
                                                                aria-label="delete"
                                                                onClick={() => handleEditClick(pro)}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton
                                                                style={{ color: "red" }}
                                                                aria-label="delete"
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </>
                                                )}
                                                {product === "doctor" && (
                                                    <TableCell>{pro.gender}</TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={rowsPerPageOptions}
                            component="div"
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page - 1}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <AddProduct
                            modal={open}
                            setModal={handleAddProductClose}
                            type={product}
                            edit={edit}
                            initialValues={selectedProduct}
                            getAllProducts={getAllProducts}
                        />
                        <UploadJsonModal
                            open={fileUpload}
                            onClose={setFileUpload}
                            type={product}
                        />
                    </Stack>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Product;