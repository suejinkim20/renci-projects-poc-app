import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import * as queries from "../lib/graphql/queries";

const QUERY_OPTIONS = Object.entries(queries).map(([key, query]) => ({
  label: key,
  value: key,
  query,
}));

export default function QueryTestPage() {
  const [selectedKey, setSelectedKey] = useState(QUERY_OPTIONS[0].value);

  const selectedQuery = QUERY_OPTIONS.find(
    (q) => q.value === selectedKey
  )?.query;

  const { data, loading, error } = useQuery(selectedQuery);

  return (
    <div style={{ padding: "0 1.5rem", maxWidth: 1000 }}>
      <h2 style={{ marginBottom: "0.75rem" }}>GraphQL Query Output Playground</h2>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        <strong>Query:</strong>
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          style={{
            marginLeft: "0.5rem",
            padding: "0.25rem 0.5rem",
          }}
        >
          {QUERY_OPTIONS.map((q) => (
            <option key={q.value} value={q.value}>
              {q.label}
            </option>
          ))}
        </select>
      </label>
      
      <p><strong>Output:</strong></p>

      {loading && <p>Loading…</p>}

      {error && (
        <pre style={codeBoxStyle}>
          {error.message}
        </pre>
      )}
      {data && (
        <pre style={codeBoxStyle}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

const codeBoxStyle = {
  background: "#20252e",
  color: "#e5e7eb",
  padding: "1rem",
  borderRadius: "6px",
  fontSize: "0.85rem",
  lineHeight: 1.4,
  overflowX: "auto",
};
