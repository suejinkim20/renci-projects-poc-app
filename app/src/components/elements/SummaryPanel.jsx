// src/components/elements/SummaryPanel.jsx

export default function SummaryPanel({ rows = [], onClose }) {
  if (!rows.length) return <p>No projects found.</p>;

  const projectCount = rows.length;

  const allStaff = rows.flatMap(r => r.staffDetails);
  const uniqueStaffCount = new Set(allStaff.map(s => s.name)).size;

  const allFunders = rows.flatMap(r => r.fundersWithCount);
  const funderMap = {};
  allFunders.forEach(f => {
    funderMap[f.name] = (funderMap[f.name] || 0) + f.count;
  });

  const allPartners = rows.flatMap(r => r.partnersWithCount);
  const partnerMap = {};
  allPartners.forEach(p => {
    partnerMap[p.name] = (partnerMap[p.name] || 0) + p.count;
  });

  // ── styles (unchanged, trimmed for clarity) ──
  const cardStyle = {
    background: "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Summary</h3>
        <button onClick={onClose} style={{ fontSize: "0.85rem" }}>
          ✕ Close
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <div>Total Projects</div>
          <strong>{projectCount}</strong>
        </div>

        <div style={cardStyle}>
          <div>Unique Staff Contributors</div>
          <strong>{uniqueStaffCount}</strong>
        </div>

        {Object.keys(funderMap).length > 0 && (
          <div style={cardStyle}>
            <div>Funders</div>
            <ul>
              {Object.entries(funderMap).map(([name, count]) => (
                <li key={name}>{name} ({count})</li>
              ))}
            </ul>
          </div>
        )}

        {Object.keys(partnerMap).length > 0 && (
          <div style={cardStyle}>
            <div>Partners</div>
            <ul>
              {Object.entries(partnerMap).map(([name, count]) => (
                <li key={name}>{name} ({count})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
