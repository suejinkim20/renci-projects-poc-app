import { Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "../pages/DashboardPage.jsx"
import OrgSummaryPage from "../pages/OrgSummaryPage.jsx"

export default function Router() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/organization" element={<OrgSummaryPage />} />
      </Routes>
  )
}
