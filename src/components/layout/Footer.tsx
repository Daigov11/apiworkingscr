export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div>
          <div style={styles.brand}>ApiWorking</div>
          <div style={styles.mini}>Sistemas para negocios en Perú</div>
        </div>

        <div style={styles.cols}>
          <div style={styles.col}>
            <div style={styles.colTitle}>Soluciones</div>
            <a style={styles.link} href="/resto">Restaurantes</a>
            <a style={styles.link} href="/sistema-para-hoteles">Hoteles</a>
          </div>

          <div style={styles.col}>
            <div style={styles.colTitle}>Empresa</div>
            <a style={styles.link} href="/nosotros">Nosotros</a>
            <a style={styles.link} href="/contacto">Contacto</a>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        <div style={styles.bottomInner}>
          <small>© {new Date().getFullYear()} ApiWorking. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    marginTop: 36,
    borderTop: "1px solid #1f1f1f",
    background: "#0b0b0b",
    color: "#d4d4d4",
  },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "22px 16px",
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
  },
  brand: { color: "#fff", fontWeight: 800, fontSize: 16 },
  mini: { fontSize: 13, marginTop: 6, color: "#a3a3a3" },
  cols: { display: "flex", gap: 28, flexWrap: "wrap" },
  col: { display: "flex", flexDirection: "column", gap: 8, minWidth: 160 },
  colTitle: { color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 4 },
  link: { textDecoration: "none", color: "#d4d4d4", fontSize: 13 },
  bottom: { borderTop: "1px solid #1f1f1f" },
  bottomInner: { maxWidth: 1100, margin: "0 auto", padding: "12px 16px", color: "#a3a3a3" },
};