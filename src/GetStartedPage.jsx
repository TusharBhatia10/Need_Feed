import { useState } from 'react'
import Icon from './Icon'

export default function GetStartedPage({ onBack, onEnterApp }) {
  const [tab, setTab] = useState("signup");
  const [role, setRole] = useState("donor");

  return (
    <div style={{ minHeight: "100vh", background: "#FBFAF6", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px", borderBottom: "1px solid #E6E9E6", background: "#fff",
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
        <div style={{ width: 80 }}/>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Tab toggle */}
          <div style={{
            display: "flex", background: "#F5F4EE", borderRadius: 12, padding: 4,
            border: "1px solid #E6E9E6", marginBottom: 28,
          }}>
            {["signup", "login"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "10px 0", borderRadius: 9, border: "none", cursor: "pointer",
                fontFamily: "Manrope, sans-serif", fontSize: 13.5, fontWeight: tab === t ? 600 : 500,
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? "#1B2421" : "#6B7A75",
                boxShadow: tab === t ? "0 1px 2px rgba(15,36,30,0.08)" : "none",
                transition: "all .15s",
              }}>
                {t === "signup" ? "Sign up" : "Log in"}
              </button>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #E6E9E6", borderRadius: 16, padding: "32px 28px" }}>

            {tab === "signup" ? (
              <>
                <h2 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 26, fontWeight: 500, color: "#1B2421", margin: "0 0 6px" }}>Create your account</h2>
                <p style={{ fontSize: 13.5, color: "#6B7A75", margin: "0 0 24px" }}>Join NeedFeed — it's completely free.</p>

                {/* Role selector */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3A4945", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>I am a</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { value: "donor", label: "Donor", desc: "I want to donate supplies", icon: "profile" },
                      { value: "admin", label: "Home Admin", desc: "I manage an old age home", icon: "dashboard" },
                    ].map(r => (
                      <button key={r.value} onClick={() => setRole(r.value)} style={{
                        padding: "14px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                        border: role === r.value ? "2px solid #1D9E75" : "1px solid #E6E9E6",
                        background: role === r.value ? "#F2FAF6" : "#FBFAF6",
                        fontFamily: "Manrope, sans-serif",
                        transition: "all .12s",
                      }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: "#1B2421", marginBottom: 3 }}>{r.label}</div>
                        <div style={{ fontSize: 11.5, color: "#6B7A75" }}>{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="formField">
                  <label>Full name</label>
                  <input placeholder="e.g. Tushar Khanna" />
                </div>
                <div className="formField">
                  <label>Email</label>
                  <input type="email" placeholder="you@example.com" />
                </div>
                {role === "admin" && (
                  <div className="formField">
                    <label>Home name</label>
                    <input placeholder="e.g. Shanti Niketan Home" />
                  </div>
                )}
                <div className="formField" style={{ marginBottom: 24 }}>
                  <label>Password</label>
                  <input type="password" placeholder="Min. 8 characters" />
                </div>

                <button className="btn teal block" onClick={onEnterApp}>
                  Create account <Icon name="arrow" size={14}/>
                </button>
                <p style={{ textAlign: "center", fontSize: 12.5, color: "#6B7A75", marginTop: 16 }}>
                  Already have an account?{" "}
                  <button onClick={() => setTab("login")} style={{ background: "none", border: "none", color: "#0F6E56", fontWeight: 600, cursor: "pointer", fontSize: 12.5, fontFamily: "Manrope, sans-serif" }}>
                    Log in
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 26, fontWeight: 500, color: "#1B2421", margin: "0 0 6px" }}>Welcome back</h2>
                <p style={{ fontSize: 13.5, color: "#6B7A75", margin: "0 0 24px" }}>Log in to your NeedFeed account.</p>

                <div className="formField">
                  <label>Email</label>
                  <input type="email" placeholder="you@example.com" />
                </div>
                <div className="formField" style={{ marginBottom: 8 }}>
                  <label>Password</label>
                  <input type="password" placeholder="Your password" />
                </div>
                <div style={{ textAlign: "right", marginBottom: 24 }}>
                  <button style={{ background: "none", border: "none", color: "#0F6E56", fontWeight: 600, cursor: "pointer", fontSize: 12.5, fontFamily: "Manrope, sans-serif" }}>
                    Forgot password?
                  </button>
                </div>

                <button className="btn teal block" onClick={onEnterApp}>
                  Log in <Icon name="arrow" size={14}/>
                </button>
                <p style={{ textAlign: "center", fontSize: 12.5, color: "#6B7A75", marginTop: 16 }}>
                  Don&apos;t have an account?{" "}
                  <button onClick={() => setTab("signup")} style={{ background: "none", border: "none", color: "#0F6E56", fontWeight: 600, cursor: "pointer", fontSize: 12.5, fontFamily: "Manrope, sans-serif" }}>
                    Sign up free
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
