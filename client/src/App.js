import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Attendance from "./Pages/Attendance";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeList from "./Pages/EmployeeList";
import Profile from "./Pages/Profile";
import AddEmployee from "./Pages/AddEmployee";
import UpdateEmployee from "./Pages/UpdateEmployee";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import PrivateRoute from "./Utils/PrivateRoute";
import { AuthProvider } from "./Context/AuthContext";
import "./App.css";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import EditEmployee from "./Pages/EditEmployee";

function LayoutWrapper() {
  const location = useLocation();

  // Hide Navbar & Sidebar on Login or Signup pages
  const hideLayout = ["/login", "/signup"].includes(
    location.pathname.toLowerCase(),
  );

  return (
    <>
      {!hideLayout && <Navbar />}
     <div className="d-flex">
      {!hideLayout && <Sidebar />} 

      <div
        className="main-content flex-grow-1"
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-employee"
            element={
              <PrivateRoute role="admin">
                <AddEmployee />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute role="admin">
                <EmployeeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-employee"
            element={
              <PrivateRoute role="admin">
                <UpdateEmployee />
              </PrivateRoute>
            }
          />

          <Route
            path="/update/:id"
            element={
              <PrivateRoute role="admin">
                <EditEmployee />
              </PrivateRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute role="employee">
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <PrivateRoute role="employee">
                <Attendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee-dashboard"
            element={
              <PrivateRoute role="employee">
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
