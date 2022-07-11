import ForgortPass from "./components/ForgortPass";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UpdatePassword } from "./components/UpdatePassword";
import CreateProduct from "./components/CreateProduct";
import StripeCheckout from "./components/StripeCheckout";
import Success from "./components/success";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<StripeCheckout />} path="/" />
          <Route
            element={<UpdatePassword />}
            path="/api/v1/reset-password/:userid/:token"
          />
          <Route element={<Success />} path="/booking-success" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
