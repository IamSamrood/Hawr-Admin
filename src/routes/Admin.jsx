import { ThemeProvider } from "@emotion/react";
import { Box, createTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import SignIn from "../pages/signin/SingIn";
import Signup from "../pages/signup/Signup";
import Home from "../pages/home/Home";




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
                <Route path="/" element={<Home />} />
            </Route>
            <Route
                path="/login"
                element={currentUser ? <Navigate to="/" /> : <SignIn />}
            />
            <Route
        path="/signup"
        element={currentUser ? <Navigate to="/" /> : <Signup />}
      />
        </Routes>
    );
}

export default Admin;