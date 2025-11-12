// Almost there
 
export default function SummaryPanel({ rows = [] }) {
  if (!rows.length) return <p>No projects found.</p>;

  const projectCount = rows.length;

  // Aggregate staff
  const allStaff = rows.flatMap(r => r.staffDetails);
  const uniqueStaffCount = new Set(allStaff.map(s => s.name)).size;

  // ──────────────────────────────────────────
  // Funders
  const allFunders = rows.flatMap(r => r.fundersWithCount);
  const funderMap = {};
  allFunders.forEach(f => {
    funderMap[f.name] = (funderMap[f.name] || 0) + f.count;
  });

  // ──────────────────────────────────────────
  // Partners
  const allPartners = rows.flatMap(r => r.partnersWithCount);
  const partnerMap = {};
  allPartners.forEach(p => {
    partnerMap[p.name] = (partnerMap[p.name] || 0) + p.count;
  });

  // ──────────────────────────────────────────
  // Affiliation summary
  const affiliationMap = {};
  allStaff.forEach(s => {
    const key = s.affiliation || "Unassigned";
    affiliationMap[key] = (affiliationMap[key] || 0) + 1;
  });

  // ──────────────────────────────────────────
  // Styles
  const cardStyle = {
    background: "#ffffff",
    padding: "12px 16px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    minWidth: "12vw",
    maxWidth: "35vw",
  };

  const containerStyle = {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  };

  const labelStyle = {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "6px",
  };

  const valueStyle = {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4px",
  };

  const listStyle = {
    fontSize: "0.85rem",
    color: "#444",
    margin: 0,
    paddingLeft: "16px",
  };

  const listItemStyle = {
    marginBottom: "2px",
  };

  return (
    <div style={containerStyle}>
      {/* ── Projects ───────────────────────────── */}
      <div style={cardStyle}>
        <div style={labelStyle}>Total Projects</div>
        <div style={valueStyle}>{projectCount}</div>
      </div>

      {/* ── Unique staff ───────────────────────── */}
      <div style={cardStyle}>
        <div style={labelStyle}>Unique Staff Contributors</div>
        <div style={valueStyle}>{uniqueStaffCount}</div>
      </div>

      {/* ── Affiliation breakdown ─────────────── */}
      {Object.keys(affiliationMap).length > 0 && (
        <div style={cardStyle}>
          <div style={labelStyle}>
            Staff by Affiliation ({Object.keys(affiliationMap).length}):
          </div>
          <ul style={listStyle}>
            {Object.entries(affiliationMap).map(([name, count]) => (
              <li key={name} style={listItemStyle}>
                {name} ({count})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Funders breakdown ──────────────────── */}
      {Object.keys(funderMap).length > 0 && (
        <div style={cardStyle}>
          <div style={labelStyle}>
            Funders ({Object.keys(funderMap).length}):
          </div>
          <ul style={listStyle}>
            {Object.entries(funderMap).map(([name, count]) => (
              <li key={name} style={listItemStyle}>{name} ({count})</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Partners breakdown ─────────────────── */}
      {Object.keys(partnerMap).length > 0 && (
        <div style={cardStyle}>
          <div style={labelStyle}>
            Partners ({Object.keys(partnerMap).length}):
          </div>
          <ul style={listStyle}>
            {Object.entries(partnerMap).map(([name, count]) => (
              <li key={name} style={listItemStyle}>{name} ({count})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
