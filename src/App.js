import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <AppRoutes />
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
