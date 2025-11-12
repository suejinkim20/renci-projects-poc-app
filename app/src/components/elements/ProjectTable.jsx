export default function ProjectTable({ rows = [] }) {
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed", // ensures consistent column widths
    wordWrap: "break-word", // wrap long text
  };

  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    verticalAlign: "top",
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
  };

  const linkStyle = {
    color: "#1a73e8",
    textDecoration: "none",
  };

  const tbodyTrStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
  });

  if (!rows.length) {
    return <p>No projects found for the selected research group.</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Project</th>
            <th style={thStyle}>Staff Count</th>
            <th style={thStyle}>Funders</th>
            <th style={thStyle}>Partner Organizations</th>
            <th style={thStyle}>View Project Page</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(
            (
              {
                project,
                staffCount,
                fundersWithCount,
                partnersWithCount,
              },
              index
            ) => (
              <tr key={project.slug} style={tbodyTrStyle(index)}>
                <td style={thTdStyle}>{project.title}</td>
                <td style={thTdStyle}>{staffCount}</td>
                <td style={thTdStyle}>
                  {fundersWithCount.length > 0 ? (
                    fundersWithCount.map((f, i) => (
                      <div key={i}>
                        {f.link ? (
                          <a href={f.link} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                            {f.name}
                          </a>
                        ) : (
                          f.name
                        )}
                      </div>
                    ))
                  ) : (
                    "—"
                  )}
                </td>
                <td style={thTdStyle}>
                  {partnersWithCount.length > 0 ? (
                    partnersWithCount.map((p, i) => (
                      <div key={i}>
                        {p.link ? (
                          <a href={p.link} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                            {p.name}
                          </a>
                        ) : (
                          p.name
                        )}
                      </div>
                    ))
                  ) : (
                    "—"
                  )}
                </td>
                <td style={thTdStyle}>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    View
                  </a>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
