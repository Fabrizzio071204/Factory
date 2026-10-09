import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Casos from "./pages/Casos";
import CasoDetalle from "./pages/CasoDetalle";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/casos" element={<Casos />} />
      <Route path="/casos/:id" element={<CasoDetalle />} />
    </Routes>
  );
}