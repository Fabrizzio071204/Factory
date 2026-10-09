import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api";

export default function Layout({ children }) {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setUsuario(data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        }
      });
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const iniciales = usuario
    ? usuario.nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "··";

  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
        <div className="h-16 w-full px-gutter flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">shield_lock</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">CustodiaDigital</span>
              <span className="font-label-code-sm text-label-code-sm text-outline uppercase tracking-wider">
                Cadena de Custodia Forense
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container border border-outline-variant/40">
            <div className="relative w-8 h-8 rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 flex items-center justify-center font-label-ui text-label-ui">
              {iniciales}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-surface-container-lowest"></span>
            </div>
            <div className="flex flex-col pr-space-xs">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                {usuario ? usuario.nombre : "Perito"}
              </span>
              <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">
                {usuario ? `Perito en ${usuario.especialidad}` : "Cargando..."}
              </span>
            </div>
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest z-40 flex flex-col justify-between py-space-lg border-r border-outline-variant/30">
        <div className="flex flex-col gap-space-lg">
          <div className="px-space-lg">
            <span className="font-label-ui text-label-ui text-outline uppercase tracking-widest block">
              Consola Pericial
            </span>
          </div>
          <nav className="flex flex-col px-space-sm gap-1">
            <NavLink
              to="/casos"
              className={({ isActive }) =>
                `flex items-center gap-3 px-space-md py-2.5 rounded-r-lg transition-colors font-body-md text-body-md ${
                  isActive
                    ? "bg-surface-container-high text-primary font-semibold border-l-2 border-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`
              }
            >
              <span className="material-symbols-outlined">folder_special</span>
              <span>Casos</span>
            </NavLink>

            {[
              { icono: "history_edu", texto: "Historial de Custodia" },
              { icono: "enhanced_encryption", texto: "Verificación" },
            ].map((item) => (
              <div
                key={item.texto}
                className="flex items-center gap-3 px-space-md py-2.5 text-outline opacity-60 font-body-md text-body-md cursor-not-allowed"
              >
                <span className="material-symbols-outlined">{item.icono}</span>
                <span className="flex-1">{item.texto}</span>
                <span className="font-label-code-sm text-label-code-sm bg-surface-container px-1.5 py-0.5 rounded">
                  Pronto
                </span>
              </div>
            ))}
          </nav>
        </div>

        <div className="px-space-md">
          <button
            onClick={cerrarSesion}
            className="w-full flex items-center gap-3 px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors font-body-md text-body-md"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="pl-64 pt-16 min-h-screen">
        <div className="px-gutter py-space-lg">{children}</div>
      </main>
    </div>
  );
}