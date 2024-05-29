import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./components/login";
import Register from "./components/register";
import DashboardPage from "./components/dashboard";
import PrivateRoutes from "./utils/privateRoutes";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
