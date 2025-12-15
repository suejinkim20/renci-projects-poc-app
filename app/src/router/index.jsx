import { Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "../pages/DashboardPage.jsx"
import PartnersFundersPage from "../pages/PartnersFundersPage.jsx"

export default function Router() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/partners-funders" element={<PartnersFundersPage />} />
      </Routes>
  )
}
