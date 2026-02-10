import { Routes, Route, Navigate } from "react-router-dom"
import ResearchGroupsPage from "../pages/ResearchGroupsPage.jsx"
import PartnersFundersPage from "../pages/PartnersFundersPage.jsx"
import QueryTestPage from "../pages/QueryTestPage.jsx";

export default function Router() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/research-groups" replace />} />
        <Route path="/research-groups" element={<ResearchGroupsPage />} />
        <Route path="/partners-funders" element={<PartnersFundersPage />} />
        <Route path="/query-test" element={<QueryTestPage />} />
      </Routes>
  )
}
