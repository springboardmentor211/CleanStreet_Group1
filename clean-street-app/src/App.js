import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import NewComplaint from "./pages/NewComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import ViewComplaints from "./pages/ViewComplaints";

function App() {
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/new-complaint" element={<NewComplaint />} />
        <Route path="/complaints" element={<ViewComplaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetail />} /> 
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
