import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function CasoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [archivo, setArchivo] = useState(null);
  const [progreso, setProgreso] = useState(0);
  const [subidos, setSubidos] = useState([]);
  const [error, setError] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  const subir = async (e) => {
    e.preventDefault();
    if (!archivo) return;
    setError("");
    setProgreso(0);
    setSubiendo(true);

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const { data } = await api.post(`/casos/${id}/archivos`, formData, {
        onUploadProgress: (ev) => {
          if (ev.total) setProgreso(Math.round((ev.loaded * 100) / ev.total));
        },
      });
      setSubidos([data, ...subidos]);
      setArchivo(null);
      e.target.reset();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/");
        return;
      }
      setError(
        err.response?.status === 404
          ? "Caso no encontrado."
          : "No se pudo subir el archivo."
      );
    } finally {
      setSubiendo(false);
    }
  };

  const th = { textAlign: "left", borderBottom: "2px solid #ccc", padding: 8 };
  const td = { borderBottom: "1px solid #eee", padding: 8, wordBreak: "break-all" };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <button onClick={() => navigate("/casos")}>← Volver a casos</button>
      <h2>Subir evidencia</h2>

      <form onSubmit={subir} style={{ display: "grid", gap: 12 }}>
        <input type="file" onChange={(e) => setArchivo(e.target.files[0])} required />
        <button type="submit" disabled={subiendo || !archivo}>
          {subiendo ? "Subiendo..." : "Subir archivo"}
        </button>
        {subiendo && (
          <div>
            <progress value={progreso} max="100" style={{ width: "100%" }} />
            <span> {progreso}%</span>
          </div>
        )}
        {error && <span style={{ color: "crimson" }}>{error}</span>}
      </form>

      <h3 style={{ marginTop: 32 }}>Archivos subidos en esta sesión</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Archivo</th>
            <th style={th}>Hash SHA-256</th>
          </tr>
        </thead>
        <tbody>
          {subidos.map((a) => (
            <tr key={a.id}>
              <td style={td}>{a.nombre_original}</td>
              <td style={{ ...td, fontFamily: "monospace", fontSize: 12 }}>
                {a.hash_original}
              </td>
            </tr>
          ))}
          {subidos.length === 0 && (
            <tr>
              <td style={td} colSpan={2}>Aún no subes archivos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}