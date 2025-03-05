import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Login from "../component/login/LoginScreen";
import SignupScreen from "../component/signup/signupScreen";
import MainscreenScreen from "../component/mainscreen/MainScreen";
import StockDashboard from "../component/recomented/RecomendedScreen"; 
import StockPortfolio from "../component/stocks/Stocksscreen";

export default function AppRoutes() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupScreen />} /> 
        <Route path="/StockPortfolio" element={<StockPortfolio />} />
        <Route path="/mainscreen" element={<StockDashboard />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}
