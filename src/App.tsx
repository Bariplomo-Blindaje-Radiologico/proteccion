import React, { useState } from "react";

type Section =
  | "inicio"
  | "proteccion"
  | "procedimientos"
  | "equipos"
  | "documentos"
  | "contacto";

export default function Aplicación() {
  const [section, setSection] = useState<Section>("inicio");

  const menu: { id: Section; label: string }[] = [
    { id: "inicio", label: "Inicio" },
    { id: "proteccion", label: "Protección radiológica" },
    { id: "procedimientos", label: "Procedimientos" },
    { id: "equipos", label: "Equipos" },
    { id: "documentos", label: "Documentos" },
    { id: "contacto", label: "Contacto" },
  ];

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logo}>PR</div>
          <div>
            <div style={styles.brandTitle}>Protección Radiológica</div>
            <div style={styles.brandSubtitle}>
              Seguridad · Control · Prevención
            </div>
          </div>
        </div>

        <nav style={styles.nav}>
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              style={{
                ...styles.navButton,
                ...(section === item.id ? styles.navButtonActive : {}),
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {section === "inicio" && (
          <>
            <section style={styles.hero}>
              <div style={styles.heroContent}>
                <span style={styles.badge}>SISTEMA DE PROTECCIÓN</span>

                <h1 style={styles.heroTitle}>
                  Protección radiológica
                  <br />
                  <span style={styles.heroAccent}>
                    clara, segura y organizada
                  </span>
                </h1>

                <p style={styles.heroText}>
                  Plataforma para consultar procedimientos, equipos,
                  documentación y buenas prácticas relacionadas con la
                  protección radiológica.
                </p>

                <div style={styles.heroButtons}>
                  <button
                    style={styles.primaryButton}
                    onClick={() => setSection("proteccion")}
                  >
                    Comenzar
                  </button>

                  <button
                    style={styles.secondaryButton}
                    onClick={() => setSection("documentos")}
                  >
                    Ver documentos
                  </button>
                </div>
              </div>

              <div style={styles.heroCard}>
                <div style={styles.shield}>☢</div>
                <h2 style={styles.cardTitle}>Seguridad primero</h2>
                <p style={styles.cardText}>
                  Información organizada para apoyar el trabajo seguro con
                  radiación ionizante.
                </p>
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Áreas principales</h2>

              <div style={styles.grid}>
                <InfoCard
                  icon="🛡️"
                  title="Protección"
                  text="Principios y medidas fundamentales de protección radiológica."
                  onClick={() => setSection("proteccion")}
                />

                <InfoCard
                  icon="📋"
                  title="Procedimientos"
                  text="Consulta procedimientos y protocolos de trabajo."
                  onClick={() => setSection("procedimientos")}
                />

                <InfoCard
                  icon="⚙️"
                  title="Equipos"
                  text="Información para el control y seguimiento de equipos."
                  onClick={() => setSection("equipos")}
                />

                <InfoCard
                  icon="📁"
                  title="Documentos"
                  text="Acceso rápido a documentación y recursos."
                  onClick={() => setSection("documentos")}
                />
              </div>
            </section>
          </>
        )}

        {section === "proteccion" && (
          <Page title="Protección radiológica">
            <div style={styles.grid}>
              <InfoCard
                icon="⏱️"
                title="Tiempo"
                text="Reducir el tiempo de exposición disminuye la dosis recibida."
              />
              <InfoCard
                icon="📏"
                title="Distancia"
                text="Aumentar la distancia respecto a la fuente reduce la exposición."
              />
              <InfoCard
                icon="🧱"
                title="Blindaje"
                text="Utilizar blindajes adecuados entre la fuente y el trabajador."
              />
            </div>

            <div style={styles.notice}>
              <strong>Principio ALARA</strong>
              <p>
                Mantener las exposiciones tan bajas como razonablemente sea
                posible, considerando los factores técnicos, económicos y
                sociales.
              </p>
            </div>
          </Page>
        )}

        {section === "procedimientos" && (
          <Page title="Procedimientos">
            <ListItem
              number="01"
              title="Antes de iniciar"
              text="Verificar el área, señalización, equipo y condiciones de seguridad."
            />
            <ListItem
              number="02"
              title="Durante el procedimiento"
              text="Aplicar las medidas de protección y utilizar correctamente los equipos."
            />
            <ListItem
              number="03"
              title="Finalización"
              text="Comprobar el área y registrar cualquier incidencia."
            />
          </Page>
        )}

        {section === "equipos" && (
          <Page title="Equipos">
            <div style={styles.grid}>
              <InfoCard
                icon="📟"
                title="Dosimetría"
                text="Control y seguimiento de la exposición ocupacional."
              />
              <InfoCard
                icon="🦺"
                title="Protección personal"
                text="Elementos de protección individual adecuados al procedimiento."
              />
              <InfoCard
                icon="🔬"
                title="Equipos de medición"
                text="Instrumentos utilizados para verificar niveles de radiación."
              />
            </div>
          </Page>
        )}

        {section === "documentos" && (
          <Page title="Documentos">
            <div style={styles.document}>
              <div style={styles.documentIcon}>📄</div>
              <div>
                <h3 style={styles.documentTitle}>
                  Manual de Protección Radiológica
                </h3>
                <p style={styles.documentText}>
                  Documento principal de consulta del sistema.
                </p>
              </div>
              <button style={styles.smallButton}>Consultar</button>
            </div>

            <div style={styles.document}>
              <div style={styles.documentIcon}>📋</div>
              <div>
                <h3 style={styles.documentTitle}>
                  Procedimientos de seguridad
                </h3>
                <p style={styles.documentText}>
                  Procedimientos y recomendaciones para el personal.
                </p>
              </div>
              <button style={styles.smallButton}>Consultar</button>
            </div>
          </Page>
        )}

        {section === "contacto" && (
          <Page title="Contacto">
            <div style={styles.contact}>
              <h2>Área de Protección Radiológica</h2>
              <p>
                Utiliza este espacio para incorporar posteriormente los datos
                de contacto, correo electrónico, teléfono y ubicación.
              </p>

              <button
                style={styles.primaryButton}
                onClick={() => setSection("inicio")}
              >
                Volver al inicio
              </button>
            </div>
          </Page>
        )}
      </main>

      <footer style={styles.footer}>
        <div>
          <strong>Protección Radiológica</strong>
          <div style={styles.footerText}>
            Sistema de información y seguridad radiológica
          </div>
        </div>

        <div style={styles.footerText}>
          © {new Date().getFullYear()} · Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}

function Page({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.page}>
      <div style={styles.pageHeader}>
        <span style={styles.badge}>PROTECCIÓN RADIOLÓGICA</span>
        <h1 style={styles.pageTitle}>{title}</h1>
      </div>

      <div>{children}</div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: string;
  title: string;
  text: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.infoCard,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={styles.infoIcon}>{icon}</div>
      <h3 style={styles.infoTitle}>{title}</h3>
      <p style={styles.infoText}>{text}</p>

      {onClick && <span style={styles.cardLink}>Ver más →</span>}
    </button>
  );
}

function ListItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div style={styles.listItem}>
      <div style={styles.number}>{number}</div>
      <div>
        <h3 style={styles.listTitle}>{title}</h3>
        <p style={styles.listText}>{text}</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: "#f5f7fa",
    color: "#17212b",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  header: {
    minHeight: 76,
    padding: "0 6%",
    background: "#ffffff",
    borderBottom: "1px solid #e5e9ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 30,
    boxSizing: "border-box",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#173b57",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
  },

  brandTitle: {
    fontWeight: 800,
    fontSize: 16,
  },

  brandSubtitle: {
    color: "#758392",
    fontSize: 11,
    marginTop: 2,
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  navButton: {
    border: 0,
    background: "transparent",
    color: "#596775",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
  },

  navButtonActive: {
    background: "#eaf2f7",
    color: "#173b57",
    fontWeight: 700,
  },

  hero: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "85px 30px 65px",
    display: "grid",
    gridTemplateColumns: "1.5fr 0.8fr",
    gap: 60,
    alignItems: "center",
  },

  heroContent: {
    maxWidth: 720,
  },

  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 20,
    background: "#e8f2f7",
    color: "#23617d",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.8,
  },

  heroTitle: {
    fontSize: "clamp(40px, 6vw, 68px)",
    lineHeight: 1.03,
    margin: "20px 0",
    letterSpacing: -2,
  },

  heroAccent: {
    color: "#23617d",
  },

  heroText: {
    maxWidth: 650,
    color: "#647381",
    fontSize: 18,
    lineHeight: 1.7,
  },

  heroButtons: {
    display: "flex",
    gap: 12,
    marginTop: 30,
    flexWrap: "wrap",
  },

  primaryButton: {
    border: 0,
    background: "#173b57",
    color: "#ffffff",
    padding: "13px 22px",
    borderRadius: 9,
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #cbd5dc",
    background: "#ffffff",
    color: "#173b57",
    padding: "13px 22px",
    borderRadius: 9,
    fontWeight: 700,
    cursor: "pointer",
  },

  heroCard: {
    background: "#ffffff",
    border: "1px solid #e0e7ec",
    borderRadius: 22,
    padding: 40,
    boxShadow: "0 18px 45px rgba(25, 50, 70, 0.08)",
    textAlign: "center",
  },

  shield: {
    width: 95,
    height: 95,
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#eaf2f7",
    color: "#23617d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 42,
  },

  cardTitle: {
    margin: "0 0 10px",
    fontSize: 22,
  },

  cardText: {
    color: "#6b7985",
    lineHeight: 1.6,
    margin: 0,
  },

  section: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "20px 30px 80px",
  },

  sectionTitle: {
    fontSize: 30,
    marginBottom: 25,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
  },

  infoCard: {
    textAlign: "left",
    border: "1px solid #e0e7ec",
    background: "#ffffff",
    borderRadius: 15,
    padding: 24,
    minHeight: 180,
    boxSizing: "border-box",
    transition: "transform .15s ease",
  },

  infoIcon: {
    fontSize: 28,
    marginBottom: 15,
  },

  infoTitle: {
    margin: "0 0 8px",
    fontSize: 18,
  },

  infoText: {
    color: "#697885",
    lineHeight: 1.55,
    margin: 0,
    fontSize: 14,
  },

  cardLink: {
    display: "block",
    marginTop: 18,
    color: "#23617d",
    fontSize: 13,
    fontWeight: 700,
  },

  page: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "70px 30px 100px",
  },

  pageHeader: {
    marginBottom: 35,
  },

  pageTitle: {
    fontSize: 45,
    margin: "16px 0 0",
  },

  notice: {
    marginTop: 25,
    padding: 25,
    background: "#eaf2f7",
    borderRadius: 14,
    color: "#23475d",
    lineHeight: 1.6,
  },

  listItem: {
    display: "flex",
    gap: 22,
    alignItems: "flex-start",
    background: "#ffffff",
    border: "1px solid #e0e7ec",
    borderRadius: 14,
    padding: 25,
    marginBottom: 14,
  },

  number: {
    fontSize: 13,
    fontWeight: 800,
    color: "#23617d",
    background: "#eaf2f7",
    padding: "8px 10px",
    borderRadius: 8,
  },

  listTitle: {
    margin: "3px 0 7px",
  },

  listText: {
    margin: 0,
    color: "#687783",
    lineHeight: 1.5,
  },

  document: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    background: "#ffffff",
    border: "1px solid #e0e7ec",
    borderRadius: 14,
    padding: 22,
    marginBottom: 14,
  },

  documentIcon: {
    fontSize: 28,
  },

  documentTitle: {
    margin: 0,
    fontSize: 17,
  },

  documentText: {
    margin: "5px 0 0",
    color: "#6b7985",
    fontSize: 14,
  },

  smallButton: {
    marginLeft: "auto",
    border: "1px solid #cbd5dc",
    background: "#ffffff",
    color: "#173b57",
    padding: "9px 14px",
    borderRadius: 8,
    fontWeight: 700,
    cursor: "pointer",
  },

  contact: {
    background: "#ffffff",
    border: "1px solid #e0e7ec",
    borderRadius: 16,
    padding: 30,
    lineHeight: 1.7,
  },

  footer: {
    background: "#173b57",
    color: "#ffffff",
    padding: "30px 6%",
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
  },

  footerText: {
    opacity: 0.7,
    fontSize: 12,
    marginTop: 5,
  },
};
