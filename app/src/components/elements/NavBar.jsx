import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import Select from "react-select";
import { LAST_UPDATED_QUERY } from "../../lib/graphql/queries";

import "./NavBar.css";

function formatLastUpdated(isoString) {
  if (!isoString) return "Unknown";

  const date = new Date(isoString);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

const VIEW_OPTIONS = [
  {
    value: "/research-groups",
    label: "Projects by research group",
  },
  {
    value: "/partners-funders",
    label: "Partners and funders",
  },
  {
    value: "/query-test",
    label: "GraphQL query test playground",
  }
  // future ideas:
  // { value: "/projects", label: "All projects" },
  // { value: "/people", label: "People & roles" },
];

export default function NavBar() {
  const { data, loading, error } = useQuery(LAST_UPDATED_QUERY);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <p>Loading last updated date…</p>;
  if (error) return <p>Error loading last updated date</p>;

  const lastUpdated = formatLastUpdated(
    data?.systemStatus?.dataLastSyncedAt
  );

  const currentView = VIEW_OPTIONS.find(
    option => option.value === location.pathname
  );

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="navbar-title">
            RENCI Projects Explorer App
          </div>
          <div>|</div>
          <div>Last synced: {lastUpdated}</div>
        </div>

        <div className="navbar-links">
          Select a view:
          <Select
            className="view-select"
            classNamePrefix="view-select"
            options={VIEW_OPTIONS}
            value={currentView}
            onChange={(option) => navigate(option.value)}
            isSearchable={false}
            placeholder="-"
          />
        </div>
      </div>
    </nav>
  );
}
