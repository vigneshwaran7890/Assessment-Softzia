import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect } from "react";

const queryClient = new QueryClient();
const assessToken = localStorage.getItem("token");



const App = () => {



  useEffect(() => {
    if (
      !assessToken &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/signup"
    ) {
      window.location.href = "/login"
    } else if (
      assessToken &&
      (window.location.pathname === "/login" ||
        window.location.pathname === "/signup")
    ) {
      window.location.href = "/home"
    }
  }, [])



  return (
    <QueryClientProvider client={queryClient}>

      <ThemeProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={
                <Home />
              }
            />
            <Route path="/book-details/:id" element={<BookDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>

    </QueryClientProvider>)
};

export default App;
