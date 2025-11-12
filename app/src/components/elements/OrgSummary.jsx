export default function OrgSummary({ rows = [] }) {
  if (!rows.length) return <p>No projects found.</p>;

  const projectCount = rows.length;

  // Aggregate staff
  const allStaff = rows.flatMap((r) => r.staffDetails);
  const uniqueStaffCount = new Set(allStaff.map((s) => s.name)).size;

  // ──────────────────────────────────────────
  // Funders — now storing { count, link }
  const allFunders = rows.flatMap((r) => r.fundersWithCount);
  const funderMap = {};
  allFunders.forEach((f) => {
    if (!f.name) return;
    if (!funderMap[f.name]) {
      funderMap[f.name] = { count: 0, link: f.link || null };
    }
    funderMap[f.name].count += f.count;
  });

  // Partners — same logic
  const allPartners = rows.flatMap((r) => r.partnersWithCount);
  const partnerMap = {};
  allPartners.forEach((p) => {
    if (!p.name) return;
    if (!partnerMap[p.name]) {
      partnerMap[p.name] = { count: 0, link: p.link || null };
    }
    partnerMap[p.name].count += p.count;
  });

  // Affiliation summary (for later expansion)
  const affiliationMap = {};
  allStaff.forEach((s) => {
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

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "6px 10px",
    textAlign: "left",
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
  };

  const linkStyle = {
    color: "#0073aa",
    textDecoration: "none",
  };

  const linkHoverStyle = {
    textDecoration: "underline",
  };

  return (
    <div>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div>Total Active Projects</div>
          <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            {projectCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div>Unique Staff Contributors</div>
          <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            {uniqueStaffCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div>Unique Funding Organizations</div>
          <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            {Object.keys(funderMap).length}
          </div>
        </div>

        <div style={cardStyle}>
          <div>Unique Partner Organizations</div>
          <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            {Object.keys(partnerMap).length}
          </div>
        </div>
      </div>

      {/* ── Funders & Partners Tables ───────────────────────── */}
      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        {Object.keys(funderMap).length > 0 && (
          <div style={cardStyle}>
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
              Funders Summary
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Project Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(funderMap).map(([name, { count, link }]) => (
                  <tr key={name}>
                    <td style={thTdStyle}>
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={linkStyle}
                          onMouseEnter={(e) =>
                            (e.target.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.textDecoration = "none")
                          }
                        >
                          {name}
                        </a>
                      ) : (
                        name
                      )}
                    </td>
                    <td style={thTdStyle}>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {Object.keys(partnerMap).length > 0 && (
          <div style={cardStyle}>
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
              Partners Summary
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Project Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(partnerMap).map(([name, { count, link }]) => (
                  <tr key={name}>
                    <td style={thTdStyle}>
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={linkStyle}
                          onMouseEnter={(e) =>
                            (e.target.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.textDecoration = "none")
                          }
                        >
                          {name}
                        </a>
                      ) : (
                        name
                      )}
                    </td>
                    <td style={thTdStyle}>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
