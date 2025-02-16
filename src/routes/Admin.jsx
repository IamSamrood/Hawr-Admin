import { ThemeProvider } from "@emotion/react";
import { Box, createTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Products from "../pages/products/Products";
import Orders from "../pages/Orders/Orders";

const Admin = () => {
    const currentUser = true; //useSelector((state) => Boolean(state.token));
    const mode = useSelector((state) => state.mode);

    const darkTheme = createTheme({
        palette: {
            mode: mode,
        },
    });

    const Layout = () => {
        return (
            <>
                <ThemeProvider theme={darkTheme}>
                    <Box bgcolor={'background.default'} color={'text.primary'}>
                        <Navbar />
                        <Outlet />
                    </Box>
                </ThemeProvider>
            </>
        );
    };

    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login" />;
        }

        return children;
    };

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="*" element={<div>NOT FOUND</div>} />
            </Route>
        </Routes>
    );
}

export default Admin;
