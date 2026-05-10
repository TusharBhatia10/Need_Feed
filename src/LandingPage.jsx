export default function LandingPage({ onGetStarted, onLearnMore }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#FBFAF6",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Nav */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 48px",
        borderBottom: "1px solid #E6E9E6",
        background: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#1D9E75", color: "#fff",
            display: "grid", placeItems: "center",
            fontFamily: "Newsreader, Georgia, serif",
            fontWeight: 600, fontSize: 20,
          }}>N</div>
          <span style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>NeedFeed</span>
        </div>
        <button onClick={onGetStarted} className="btn teal">Login</button>
      </nav>

      {/* Hero */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#E1F5EE",
          color: "#0F6E56",
          padding: "6px 16px",
          borderRadius: 999,
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: "0.04em",
          marginBottom: 28,
        }}>
          🌱 Connecting donors with old age homes across Mumbai
        </div>

        <h1 style={{
          fontFamily: "Newsreader, Georgia, serif",
          fontSize: 64,
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "#1B2421",
          maxWidth: 720,
          margin: "0 0 24px",
        }}>
          Give what's needed.<br />Exactly when it's needed.
        </h1>

        <p style={{
          fontSize: 18,
          color: "#6B7A75",
          maxWidth: 520,
          lineHeight: 1.6,
          margin: "0 0 48px",
        }}>
          NeedFeed connects donors directly with old age homes. See real-time supply needs, pledge what you can, and know your donation made it.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={onGetStarted} className="btn teal lg">Get started</button>
          <button className="btn outline lg" onClick={onLearnMore}>Learn more</button>
        </div>
      </main>

      {/* Stats bar */}
      <div style={{
        borderTop: "1px solid #E6E9E6",
        background: "#fff",
        display: "flex",
        justifyContent: "center",
        gap: 80,
        padding: "32px 48px",
        flexWrap: "wrap",
      }}>
        {[
          { value: "24", label: "Homes registered" },
          { value: "1,840", label: "Residents served" },
          { value: "312", label: "Donations this month" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", color: "#1B2421" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#6B7A75", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
