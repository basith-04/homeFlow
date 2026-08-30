import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import GroceryPurchases from "./pages/GroceryPurchases";
import GeneralExpenses from "./pages/GeneralExpenses";
import Trips from "./pages/Trips";
import FilterLogs from "./pages/FilterLogs";
import { Layout } from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path='/' element={<ProtectedRoute><Layout /></ProtectedRoute>} >
        <Route path="/" element={<Dashboard />} />

        <Route path="/grocery" element={<GroceryPurchases />} />
        <Route path="/general" element={<GeneralExpenses />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/filter-logs" element={<FilterLogs />} />
      </Route>

    </Routes>
  );
}

export default App;

