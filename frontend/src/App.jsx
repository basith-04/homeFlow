import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import GroceryPurchases from "./pages/GroceryPurchases";
import GeneralExpenses from "./pages/GeneralExpenses";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/grocery" element={<GroceryPurchases />} />
      <Route path="/general" element={<GeneralExpenses />} />
    </Routes>
  );
}

export default App;

