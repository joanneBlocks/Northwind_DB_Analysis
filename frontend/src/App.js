import { useState, useEffect } from "react";

const ENDPOINTS = [
  { key: "customers", label: "Customers", url: "http://localhost:3001/api/customers" },
  { key: "expensive", label: "Products > $50", url: "http://localhost:3001/api/products/expensive" },
  { key: "usa-orders", label: "USA Orders", url: "http://localhost:3001/api/orders/usa" },
  { key: "employees", label: "Employees (born after 1960)", url: "http://localhost:3001/api/employees/born-after-1960" },
  { key: "by-category", label: "Products by Category", url: "http://localhost:3001/api/products/by-category" },
  { key: "avg-price", label: "Avg Price by Supplier", url: "http://localhost:3001/api/products/avg-price-by-supplier" },
  { key: "order-details", label: "Order Details", url: "http://localhost:3001/api/orders/details" },
  { key: "no-orders", label: "Customers with No Orders", url: "http://localhost:3001/api/customers/no-orders" },
];

function Table({ data }) {
  if (!data || data.length === 0) return <p style={styles.empty}>No data found.</p>;
  const headers = Object.keys(data[0]);
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>{headers.map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              {headers.map(h => <td key={h} style={styles.td}>{String(row[h] ?? "")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(ENDPOINTS[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(active.url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [active]);

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Northwind</h2>
        {ENDPOINTS.map(e => (
          <button
            key={e.key}
            style={{ ...styles.navBtn, ...(active.key === e.key ? styles.navBtnActive : {}) }}
            onClick={() => setActive(e)}
          >
            {e.label}
          </button>
        ))}
      </div>
      <div style={styles.main}>
        <h1 style={styles.title}>{active.label}</h1>
        {loading ? <p style={styles.empty}>Loading...</p> : <Table data={data} />}
      </div>
    </div>
  );
}

const styles = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif", background: "#f0f2f5" },
  sidebar: { width: 220, background: "#1e293b", padding: "24px 12px", display: "flex", flexDirection: "column", gap: 8 },
  logo: { color: "#fff", textAlign: "center", marginBottom: 16, fontSize: 18 },
  navBtn: { background: "transparent", border: "none", color: "#94a3b8", padding: "10px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 13 },
  navBtnActive: { background: "#3b82f6", color: "#fff" },
  main: { flex: 1, padding: 32 },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#1e293b" },
  tableWrapper: { overflowX: "auto", background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#1e293b", color: "#fff", padding: "10px 14px", textAlign: "left", fontSize: 13 },
  td: { padding: "9px 14px", fontSize: 13, color: "#374151" },
  rowEven: { background: "#fff" },
  rowOdd: { background: "#f8fafc" },
  empty: { color: "#888", marginTop: 20 },
};
