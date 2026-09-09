import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import StudioLayout from "./layouts/StudioLayout";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import Strategist from "./pages/Strategist";
import Campaign from "./pages/Campaign";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StudioLayout />}>
          <Route index element={<Home />} />
          <Route path="resume" element={<Resume />} />
          <Route path="strategist" element={<Strategist />} />
          <Route path="campaign" element={<Campaign />} />
          <Route path="history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}