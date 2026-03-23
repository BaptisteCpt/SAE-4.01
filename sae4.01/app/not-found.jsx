import Link from "next/link";

/**
 * Page 404 personnalisée affichée pour les routes introuvables.
 * @returns {JSX.Element}
 */
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2c3e50",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "40px 30px",
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h1 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>404</h1>
        <h2 style={{ margin: "0 0 12px 0", color: "#2c3e50" }}>
          Page introuvable
        </h2>
        <p style={{ margin: "0 0 24px 0", color: "#666" }}>
          L&apos;URL demandée n&apos;existe pas ou a été déplacée.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            backgroundColor: "#f39c12",
            color: "#fff",
            textDecoration: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
