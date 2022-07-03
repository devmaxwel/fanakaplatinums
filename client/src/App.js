import ForgortPass from "./components/ForgortPass";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UpdatePassword } from "./components/UpdatePassword";
import CreateProduct from "./components/CreateProduct";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<CreateProduct />} path="/" />
          <Route
            element={<UpdatePassword />}
            path="/api/v1/reset-password/:userid/:token"
          />
          <Route element={<ForgortPass />} path="/forgotpass" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
