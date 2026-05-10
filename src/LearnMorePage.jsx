import Icon from './Icon'

export default function LearnMorePage({ onBack, onGetStarted }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FBFAF6", fontFamily: "Manrope, sans-serif" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px", borderBottom: "1px solid #E6E9E6", background: "#fff",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "Manrope, sans-serif", fontSize: 14, fontWeight: 600, color: "#1B2421",
        }}>
          <Icon name="back" size={16}/> Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: "#1D9E75", color: "#fff",
            display: "grid", placeItems: "center",
            fontFamily: "Newsreader, Georgia, serif", fontWeight: 600, fontSize: 20,
          }}>N</div>
          <span style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>NeedFeed</span>
        </div>
        <button onClick={onGetStarted} className="btn teal">Get started</button>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 24px 64px", background: "#fff", borderBottom: "1px solid #E6E9E6" }}>
        <h1 style={{
          fontFamily: "Newsreader, Georgia, serif", fontSize: 52, fontWeight: 500,
          letterSpacing: "-0.03em", color: "#1B2421", margin: "0 0 20px",
        }}>How NeedFeed works</h1>
        <p style={{ fontSize: 17, color: "#6B7A75", maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
          A simple platform that connects people who want to give with homes that need supplies — no middlemen, no guessing.
        </p>
      </section>

      {/* How it works — Donors */}
      <section style={{ padding: "72px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E1F5EE", color: "#0F6E56", padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 24 }}>
          FOR DONORS
        </div>
        <h2 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 36, fontWeight: 500, color: "#1B2421", margin: "0 0 48px" }}>Give exactly what's needed</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {[
            { step: "01", title: "Browse homes near you", desc: "See old age homes in your area, their resident count, urgency level, and distance from you." },
            { step: "02", title: "See what they actually need", desc: "Every home posts a real-time needs board — rice, soap, cooking oil. You pick what you want to donate." },
            { step: "03", title: "Pledge and drop off", desc: "Commit to a quantity and drop-off date. The home gets notified and confirms receipt when you arrive." },
          ].map(s => (
            <div key={s.step} style={{ background: "#fff", border: "1px solid #E6E9E6", borderRadius: 14, padding: 28 }}>
              <div style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 40, color: "#E6E9E6", fontWeight: 500, marginBottom: 16 }}>{s.step}</div>
              <h3 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 20, fontWeight: 500, color: "#1B2421", margin: "0 0 10px" }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "#6B7A75", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — Homes */}
      <section style={{ padding: "72px 48px", background: "#fff", borderTop: "1px solid #E6E9E6", borderBottom: "1px solid #E6E9E6" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FBE7DE", color: "#D85A30", padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 24 }}>
            FOR HOME ADMINS
          </div>
          <h2 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 36, fontWeight: 500, color: "#1B2421", margin: "0 0 48px" }}>Manage donations with ease</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {[
              { step: "01", title: "Register your home", desc: "Set up your profile in minutes — add your address, resident count, contact details, and operating hours." },
              { step: "02", title: "Post your needs", desc: "Add items to your needs board with quantities. Mark urgency levels so donors know what to prioritise." },
              { step: "03", title: "Track and confirm", desc: "See incoming pledges, expected drop-off dates, and confirm deliveries when they arrive." },
            ].map(s => (
              <div key={s.step} style={{ background: "#FBFAF6", border: "1px solid #E6E9E6", borderRadius: 14, padding: 28 }}>
                <div style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 40, color: "#E6E9E6", fontWeight: 500, marginBottom: 16 }}>{s.step}</div>
                <h3 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 20, fontWeight: 500, color: "#1B2421", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#6B7A75", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why NeedFeed */}
      <section style={{ padding: "72px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 36, fontWeight: 500, color: "#1B2421", margin: "0 0 48px", textAlign: "center" }}>Why NeedFeed</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {[
            { title: "No more guessing", desc: "Homes post exactly what they need. Donors don't have to guess or buy the wrong thing." },
            { title: "Completely free", desc: "Free for donors, free for homes. No commissions, no subscriptions, no hidden fees." },
            { title: "Nothing gets lost", desc: "Every pledge is tracked from commitment to confirmed delivery. Full transparency on both sides." },
            { title: "Your impact is visible", desc: "Donors see how many residents they've helped, which homes they've supported, and their donation streak." },
          ].map(w => (
            <div key={w.title} style={{ background: "#fff", border: "1px solid #E6E9E6", borderRadius: 14, padding: 28, display: "flex", gap: 18 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1D9E75", marginTop: 6, flexShrink: 0 }}/>
              <div>
                <h3 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 19, fontWeight: 500, color: "#1B2421", margin: "0 0 8px" }}>{w.title}</h3>
                <p style={{ fontSize: 14, color: "#6B7A75", lineHeight: 1.6, margin: 0 }}>{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "72px 48px", background: "#fff", borderTop: "1px solid #E6E9E6", borderBottom: "1px solid #E6E9E6" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 36, fontWeight: 500, color: "#1B2421", margin: "0 0 40px", textAlign: "center" }}>Common questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { q: "Is NeedFeed free to use?", a: "Yes — completely free for both donors and homes. There are no fees, commissions, or subscriptions." },
              { q: "Can I donate money instead of goods?", a: "Not yet. NeedFeed currently focuses on in-kind donations — physical supplies dropped off directly at the home." },
              { q: "How do I know my donation was received?", a: "The home admin confirms your delivery on their dashboard. You get a notification and it shows up in your impact history." },
              { q: "Can corporates or groups donate?", a: "Absolutely. Whether you're an individual, a family, or a company doing a CSR drive, NeedFeed works for all." },
              { q: "How do homes get verified?", a: "We manually verify each home before they go live on the platform to ensure legitimacy and protect donors." },
            ].map((f, i) => (
              <div key={i} style={{ padding: "22px 0", borderBottom: "1px solid #EFF1EE" }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#1B2421", marginBottom: 8 }}>{f.q}</div>
                <div style={{ fontSize: 14, color: "#6B7A75", lineHeight: 1.6 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 42, fontWeight: 500, color: "#1B2421", margin: "0 0 16px" }}>Ready to make a difference?</h2>
        <p style={{ fontSize: 16, color: "#6B7A75", marginBottom: 36 }}>Join donors and homes across Mumbai on NeedFeed.</p>
        <button onClick={onGetStarted} className="btn teal lg">Get started — it's free</button>
      </section>
    </div>
  );
}
