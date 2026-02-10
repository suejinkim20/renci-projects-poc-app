export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <p style={styles.text}>
          © {year} RENCI · Projects Explorer
        </p>

        <nav style={styles.nav}>
          <a href="https://renci.org" target="_blank" rel="noreferrer" style={styles.link}>
            RENCI
          </a>
          <span style={styles.divider}>•</span>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={styles.link}>
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "auto",
    borderTop: "1px solid #e5e7eb",
    background: "#fafafa",
    height: "4rem",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0.75rem 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
    color: "#555",
  },
  text: {
    margin: 0,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
  },
  divider: {
    color: "#aaa",
  },
};
