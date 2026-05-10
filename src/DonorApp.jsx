import { useState, useMemo } from 'react'
import Icon from './Icon'
import DatePicker from './DatePicker'
import { initials, HOMES, RECENT_DONORS, DONOR_PLEDGES } from './data'

const NAV_DONOR = [
  { key: "home", label: "Home", icon: "home" },
  { key: "browse", label: "Browse Homes", icon: "browse" },
  { key: "pledges", label: "My Pledges", icon: "pledge" },
  { key: "impact", label: "Impact", icon: "impact" },
  { key: "profile", label: "Profile", icon: "profile" },
];

function SignOutModal({ onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Sign out?</h2>
        <p className="subtitle">You'll be taken back to the NeedFeed home page.</p>
        <div className="footer">
          <button className="btn outline" onClick={onCancel}>Cancel</button>
          <button className="btn coral" onClick={onConfirm}><Icon name="logout" size={14}/> Sign out</button>
        </div>
      </div>
    </div>
  );
}

function DonorSidebar({ active, setActive, onSignOut }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark">N</div>
        <div>
          <div className="name">NeedFeed</div>
          <div className="tag">Donor</div>
        </div>
      </div>
      <nav className="navList">
        {NAV_DONOR.map(n => (
          <button key={n.key}
            className={"navItem " + (active === n.key ? "active" : "")}
            onClick={() => setActive(n.key)}>
            <Icon name={n.icon} size={18} />
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebarFoot">
        <div className="userChip">
          <div className="avatar">TK</div>
          <div>
            <div className="name">Tushar Khanna</div>
            <div className="role">Donor since Feb 2025</div>
          </div>
        </div>
        <button className="signOut" onClick={() => setConfirming(true)}><Icon name="logout" size={14}/> Sign out</button>
      </div>
      {confirming && <SignOutModal onConfirm={onSignOut} onCancel={() => setConfirming(false)} />}
    </aside>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Pledged": "pledged", "Delivered": "delivered", "Confirmed": "confirmed",
    "Missed": "missed", "Overdue": "overdue",
    "Urgent": "urgent", "Moderate": "moderate", "Covered": "covered", "Partial": "partial",
  };
  return <span className={"badge " + (map[status] || "")}><span className="dot"/>{status}</span>;
}

function UrgentCard({ home, item, qtyText, onPledge }) {
  return (
    <div className="urgentCard">
      <div className="head">
        <div>
          <div className="item">{item}</div>
          <div className="qty">{qtyText}</div>
        </div>
        <StatusBadge status="Urgent" />
      </div>
      <div className="home">
        <div className={"avatar " + home.avatarTone}>{initials(home.name)}</div>
        <div style={{flex:1}}>
          <div className="name">{home.name}</div>
          <div className="meta">{home.area} · {home.distance} km away</div>
        </div>
      </div>
      <div className="ftrow">
        <span className="tinyNote">{home.residents} residents</span>
        <button className="btn teal sm" onClick={onPledge}>Pledge</button>
      </div>
    </div>
  );
}

function DonorHome({ go, openPledge }) {
  const urgent = HOMES.filter(h => h.urgency === "urgent").slice(0, 3);
  const recent = DONOR_PLEDGES.slice(0, 3);
  return (
    <div className="fadeIn">
      <div className="pageHead">
        <div className="greeting">Saturday, May 9</div>
        <h1 className="pageTitle">Good morning, Tushar.</h1>
        <p className="pageSub">3 homes near you have urgent needs this week.</p>
      </div>

      <div className="statsRow">
        <div className="stat featured">
          <div className="label">Homes registered</div>
          <div className="value">24</div>
          <div className="delta">across Mumbai</div>
        </div>
        <div className="stat">
          <div className="label">Donations this month</div>
          <div className="value">312</div>
          <div className="delta up">↑ 18% from April</div>
        </div>
        <div className="stat">
          <div className="label">Residents served</div>
          <div className="value">1,840</div>
          <div className="delta">community-wide</div>
        </div>
      </div>

      <div className="section">
        <div className="sectionHead">
          <h2>Urgent needs near you</h2>
          <button className="linkBtn" onClick={() => go("browse")}>Browse all homes →</button>
        </div>
        <div className="urgentRow">
          <UrgentCard home={urgent[0]} item="Mustard Oil" qtyText="20 L needed · 0 pledged"
            onPledge={() => openPledge({ home: urgent[0], itemName: "Mustard Oil", unit: "L" })} />
          <UrgentCard home={urgent[1]} item="Adult Diapers" qtyText="40 packs needed · 5 pledged"
            onPledge={() => openPledge({ home: urgent[1], itemName: "Adult Diapers", unit: "packets" })} />
          <UrgentCard home={urgent[2]} item="Basmati Rice" qtyText="30 kg needed · 0 pledged"
            onPledge={() => openPledge({ home: urgent[2], itemName: "Basmati Rice", unit: "kg" })} />
        </div>
      </div>

      <div className="section">
        <div className="sectionHead">
          <h2>Your recent activity</h2>
          <button className="linkBtn" onClick={() => go("pledges")}>See all pledges →</button>
        </div>
        <div className="card flat" style={{padding:"4px 18px"}}>
          <div className="activityList">
            {recent.map(p => (
              <div className="activityItem" key={p.id}>
                <div className="avatar teal">{initials(p.home)}</div>
                <div className="body">
                  <div className="title">{p.qty} of {p.item}</div>
                  <div className="sub">{p.home} · drop-off {p.dropDate}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeCard({ home, onClick }) {
  return (
    <button className="homeCard" onClick={onClick}>
      <div className="head">
        <div className={"avatar lg " + home.avatarTone}>{initials(home.name)}</div>
        <div className="info">
          <div className="name">{home.name}</div>
          <div className="meta">
            <span><Icon name="pin" size={13}/> {home.area}</span>
            <span>· {home.distance} km</span>
          </div>
          <div style={{marginTop:8}}>
            <StatusBadge status={home.urgency.charAt(0).toUpperCase() + home.urgency.slice(1)} />
          </div>
        </div>
      </div>
      <div>
        <div className="tinyNote" style={{marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:600}}>Top needs</div>
        <div className="needs">
          {home.topNeeds.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
      <div className="ftrow">
        <span className="residents"><Icon name="users" size={13}/> {home.residents} residents</span>
        <span className="linkBtn">View Home →</span>
      </div>
    </button>
  );
}

function DonorBrowse({ openHome }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = HOMES;
    if (filter === "urgent") list = list.filter(h => h.urgency === "urgent");
    if (filter === "moderate") list = list.filter(h => h.urgency === "moderate");
    if (filter === "near") list = list.filter(h => h.distance <= 5);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(s) || h.area.toLowerCase().includes(s));
    }
    return list;
  }, [filter, q]);

  const counts = {
    all: HOMES.length,
    urgent: HOMES.filter(h => h.urgency === "urgent").length,
    moderate: HOMES.filter(h => h.urgency === "moderate").length,
    near: HOMES.filter(h => h.distance <= 5).length,
  };

  return (
    <div className="fadeIn">
      <div className="pageHead">
        <h1 className="pageTitle">Browse homes</h1>
        <p className="pageSub">Find a home near you that needs support this week.</p>
      </div>

      <div className="toolbar">
        <div className="searchWrap">
          <span className="ico"><Icon name="search" size={16}/></span>
          <input placeholder="Search by area or home name…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="pillRow">
          <button className={"pill " + (filter==="all"?"active":"")} onClick={() => setFilter("all")}>All <span className="count">{counts.all}</span></button>
          <button className={"pill " + (filter==="urgent"?"active":"")} onClick={() => setFilter("urgent")}>Urgent <span className="count">{counts.urgent}</span></button>
          <button className={"pill " + (filter==="moderate"?"active":"")} onClick={() => setFilter("moderate")}>Moderate <span className="count">{counts.moderate}</span></button>
          <button className={"pill " + (filter==="near"?"active":"")} onClick={() => setFilter("near")}>Near me <span className="count">{counts.near}</span></button>
        </div>
      </div>

      <div className="homeGrid">
        {filtered.map(h => <HomeCard key={h.id} home={h} onClick={() => openHome(h)} />)}
      </div>
      {filtered.length === 0 && <div className="empty">No homes match that filter.</div>}
    </div>
  );
}

function DonorHomeProfile({ home, back, openPledge }) {
  const fullHome = HOMES.find(h => h.id === home.id) || home;
  const needs = fullHome.needs || [
    { item: "Atta", category: "Grains", needed: 30, pledged: 10, unit: "kg" },
    { item: "Soap", category: "Toiletries", needed: 25, pledged: 25, unit: "pieces" },
    { item: "Toor Dal", category: "Grains", needed: 20, pledged: 0, unit: "kg" },
  ];
  const statusOf = (n) => n.pledged === 0 ? "Urgent" : n.pledged >= n.needed ? "Covered" : "Partial";

  return (
    <div className="fadeIn">
      <button className="linkBtn" onClick={back} style={{marginBottom:14, display:"inline-flex", alignItems:"center", gap:6}}>
        <Icon name="back" size={14}/> Back to all homes
      </button>

      <div className="detailHero">
        <div className={"avatar lg " + fullHome.avatarTone} style={{width:72, height:72, fontSize:22}}>{initials(fullHome.name)}</div>
        <div className="meta">
          <h1>{fullHome.name}</h1>
          <div className="addr">{fullHome.address}</div>
          <div className="factrow">
            <div className="fact"><div className="label">Residents</div><div className="value">{fullHome.residents}</div></div>
            <div className="fact"><div className="label">Distance</div><div className="value">{fullHome.distance} km</div></div>
            <div className="fact"><div className="label">Contact</div><div className="value">{fullHome.contact}</div></div>
            <div className="fact"><div className="label">Phone</div><div className="value">{fullHome.phone}</div></div>
          </div>
        </div>
        <div className="actions">
          <StatusBadge status={fullHome.urgency.charAt(0).toUpperCase() + fullHome.urgency.slice(1)} />
        </div>
      </div>

      <div className="section">
        <div className="sectionHead"><h2>Needs board</h2><span className="tinyNote">{needs.length} items · updated 2 hours ago</span></div>
        <div className="tableCard">
          <table className="tbl">
            <thead><tr>
              <th>Item</th><th>Category</th><th>Needed</th><th>Pledged</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {needs.map(n => {
                const status = statusOf(n);
                const pct = Math.min(100, Math.round((n.pledged/n.needed)*100));
                const cls = status === "Urgent" ? "coral" : status === "Partial" ? "amber" : "green";
                return (
                  <tr className="row" key={n.item}>
                    <td><span className="strong">{n.item}</span></td>
                    <td>{n.category}</td>
                    <td><span className="strong">{n.needed} {n.unit}</span></td>
                    <td>
                      <div className="qtyCell">
                        <span><span className="num">{n.pledged}</span> <span className="of">/ {n.needed} {n.unit}</span></span>
                        <div className="progress"><div className={"bar " + cls} style={{width: pct + "%"}}/></div>
                      </div>
                    </td>
                    <td><StatusBadge status={status} /></td>
                    <td style={{textAlign:"right"}}>
                      {status !== "Covered" ? (
                        <button className="btn teal sm" onClick={() => openPledge({ home: fullHome, itemName: n.item, unit: n.unit, needed: n.needed, pledged: n.pledged })}>
                          Pledge this
                        </button>
                      ) : (
                        <span className="tinyNote">Fully pledged</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="twoCol section">
        <div className="card">
          <h3>About this home</h3>
          <p style={{marginTop:10, color:"var(--ink-2)", lineHeight:1.6}}>{fullHome.about}</p>
          <div className="divider"/>
          <div className="row" style={{gap:24, flexWrap:"wrap"}}>
            <span className="row" style={{gap:6, color:"var(--ink-3)"}}><Icon name="phone" size={14}/> {fullHome.phone}</span>
            <span className="row" style={{gap:6, color:"var(--ink-3)"}}><Icon name="mail" size={14}/> {fullHome.email}</span>
            <span className="row" style={{gap:6, color:"var(--ink-3)"}}><Icon name="clock" size={14}/> {fullHome.hours}</span>
          </div>
        </div>
        <div className="card">
          <h3>Recent donors</h3>
          <div style={{marginTop:14, display:"flex", flexDirection:"column", gap:10}}>
            {RECENT_DONORS.map(d => (
              <div className="row" key={d.name} style={{gap:10}}>
                <div className={"avatar sm " + d.tone}>{initials(d.name)}</div>
                <div style={{fontSize:13, fontWeight:500}}>{d.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodCard({ icon, title, desc, tag, tagTone, active, disabled, onClick }) {
  return (
    <button type="button" onClick={disabled ? undefined : onClick} style={{
      appearance:"none", textAlign:"left", cursor: disabled ? "not-allowed" : "pointer",
      background: active ? "var(--teal-tint)" : "var(--surface)",
      border: "1.5px solid " + (active ? "var(--teal)" : "var(--line)"),
      borderRadius:"var(--radius)", padding:16, display:"flex", gap:14,
      opacity: disabled ? 0.55 : 1, transition:"all .12s", width:"100%",
      boxShadow: active ? "0 0 0 3px rgba(29,158,117,0.15)" : "none",
    }}>
      <div style={{
        width:40, height:40, borderRadius:10, flexShrink:0,
        background: active ? "var(--teal)" : "var(--bg-2)",
        color: active ? "#fff" : "var(--ink-2)",
        display:"grid", placeItems:"center",
      }}>
        <Icon name={icon} size={20}/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div className="row between" style={{alignItems:"flex-start", gap:8}}>
          <div style={{fontFamily:"var(--serif)", fontSize:17, fontWeight:600, lineHeight:1.2}}>{title}</div>
          {tag && <span className={"badge " + (tagTone || "")} style={{flexShrink:0}}>{tag}</span>}
        </div>
        <div style={{fontSize:12.5, color:"var(--ink-3)", marginTop:6, lineHeight:1.5}}>{desc}</div>
      </div>
    </button>
  );
}

function PledgeForm({ ctx, onClose, openPledge }) {
  const [step, setStep] = useState("details");
  const [qty, setQty] = useState(ctx.qty || "");
  const [unit, setUnit] = useState(ctx.unit || "kg");
  const [method, setMethod] = useState(null);
  const [platform, setPlatform] = useState("Blinkit");
  const [date, setDate] = useState("2026-05-12");
  const [slot, setSlot] = useState("Morning (9am–12pm)");
  const [note, setNote] = useState("");

  const home = ctx.home;
  const itemName = ctx.itemName;
  const address = (home && home.address) || "23, Link Road, Andheri West, Mumbai — 400053";
  const contact = (home && home.contact) ? home.contact + ", " + home.phone : "Meera Joshi, +91 98765 43210";

  const goBack = () => {
    if (step === "details") onClose();
    else if (step === "method") setStep("details");
    else if (step === "order" || step === "drop") setStep("method");
    else onClose();
  };

  if (step === "success") {
    const methodLabel = method === "order" ? `Order & Deliver via ${platform}` : "Drop off myself";
    const expected = method === "order" ? `Via ${platform}` : date;
    return (
      <div className="pledgeWrap success fadeIn">
        <div className="card" style={{padding:"36px 28px", textAlign:"center"}}>
          <div className="checkBig"><Icon name="checkBig" size={36}/></div>
          <h1 style={{fontSize:28}}>Pledge confirmed!</h1>
          <p className="muted" style={{marginTop:8, fontSize:14}}>Thank you, Tushar. {home.name} has been notified.</p>
          <div style={{textAlign:"left", marginTop:22, padding:18, background:"var(--teal-tint)", border:"1px solid var(--teal-light)", borderRadius:"var(--radius)"}}>
            <div className="row between"><span className="muted">Item</span><span style={{fontWeight:600}}>{itemName} · {qty} {unit}</span></div>
            <div className="divider" style={{margin:"10px 0"}}/>
            <div className="row between"><span className="muted">Home</span><span style={{fontWeight:600}}>{home.name}, {home.area}</span></div>
            <div className="divider" style={{margin:"10px 0"}}/>
            <div className="row between"><span className="muted">Method</span><span style={{fontWeight:600}}>{methodLabel}</span></div>
            <div className="divider" style={{margin:"10px 0"}}/>
            <div className="row between"><span className="muted">Expected delivery</span><span style={{fontWeight:600}}>{expected}</span></div>
          </div>
          <div className="row" style={{justifyContent:"center", gap:10, marginTop:22}}>
            <button className="btn teal lg" onClick={onClose}>Back to home</button>
            <button className="btn lg" style={{background:"#25D366", borderColor:"#25D366"}}>
              <Icon name="phone" size={14}/> Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pledgeWrap fadeIn">
      <button className="linkBtn" onClick={goBack} style={{marginBottom:14, display:"inline-flex", alignItems:"center", gap:6}}>
        <Icon name="back" size={14}/> {step === "details" ? "Cancel" : "Back"}
      </button>

      {/* Step progress bar */}
      <div className="row" style={{gap:8, marginBottom:18}}>
        {["details","method","confirm"].map((s, i) => {
          const idx = step === "details" ? 0 : step === "method" ? 1 : 2;
          return <div key={s} style={{flex:1, height:4, borderRadius:2, background: i <= idx ? "var(--teal)" : "var(--line)"}}/>;
        })}
      </div>

      <div className="card" style={{padding:"26px 28px"}}>
        {/* Step 1 — Details */}
        {step === "details" && <>
          <h1 style={{fontSize:26}}>Pledge a donation</h1>
          <p className="muted" style={{marginTop:6, marginBottom:20, fontSize:13.5}}>Confirm what you&apos;d like to donate.</p>
          <div className="formField"><label>Home</label><div className="readonly">{home.name} · {home.area}</div></div>
          <div className="formField"><label>Item</label><div className="readonly">{itemName}</div></div>
          <div className="formField"><label>Unit</label><div className="readonly">{unit}</div></div>
          <div className="formField">
            <label>Quantity to donate</label>
            <input type="number" placeholder="Enter quantity" value={qty} onChange={e => setQty(e.target.value)}/>
            {ctx.needed && <div className="hint">{ctx.pledged}/{ctx.needed} {unit} pledged so far · {ctx.needed - ctx.pledged} {unit} remaining</div>}
          </div>
          <div className="row" style={{justifyContent:"flex-end", gap:8, marginTop:18}}>
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn teal" disabled={!qty} onClick={() => setStep("method")}>
              Next <Icon name="arrow" size={14}/>
            </button>
          </div>
        </>}

        {/* Step 2 — Choose method */}
        {step === "method" && <>
          <h1 style={{fontSize:26}}>How would you like to deliver?</h1>
          <p className="muted" style={{marginTop:6, marginBottom:20, fontSize:13.5}}>{itemName} · {qty} {unit} · {home.name}</p>
          <div className="col" style={{gap:10}}>
            <MethodCard icon="browse" title="Order & Deliver"
              desc="We'll create a pre-filled cart on Blinkit or JioMart. You pay on their platform and it gets delivered directly to the home."
              tag="Fastest" tagTone="pledged" active={method === "order"} onClick={() => setMethod("order")}/>
            <MethodCard icon="pin" title="Drop off myself"
              desc="Get the home's address and deliver the supplies in person. Perfect if you want to visit."
              tag="Personal" tagTone="covered" active={method === "drop"} onClick={() => setMethod("drop")}/>
            <MethodCard icon="impact" title="Pay & we handle it"
              desc="Pay via UPI and our NGO partner will source and deliver on your behalf."
              tag="Coming soon" tagTone="outline" active={false} disabled={true}/>
          </div>
          <div className="row" style={{justifyContent:"flex-end", gap:8, marginTop:18}}>
            <button className="btn teal" disabled={!method} onClick={() => setStep(method === "order" ? "order" : "drop")}>
              Continue <Icon name="arrow" size={14}/>
            </button>
          </div>
        </>}

        {/* Step 2A — Order & Deliver */}
        {step === "order" && <>
          <h1 style={{fontSize:24}}>Order & deliver</h1>
          <p className="muted" style={{marginTop:6, marginBottom:20, fontSize:13.5}}>{itemName} · {qty} {unit} · {home.name}</p>
          <div className="formField">
            <label>Select platform</label>
            <div className="row" style={{gap:10, marginTop:4}}>
              {["Blinkit","JioMart","BigBasket"].map(p => (
                <button key={p} type="button" onClick={() => setPlatform(p)} style={{
                  flex:1, padding:"14px 8px", borderRadius:10,
                  border:"1.5px solid " + (platform === p ? "var(--teal)" : "var(--line)"),
                  background: platform === p ? "var(--teal-tint)" : "var(--surface)",
                  fontWeight:600, fontSize:13.5,
                  color: platform === p ? "var(--teal-dark)" : "var(--ink-2)",
                  cursor:"pointer", transition:"all .12s",
                }}>{p}</button>
              ))}
            </div>
            <div className="hint">Estimated price: ₹120–150 (approximate)</div>
          </div>
          <div className="formField">
            <label>Delivery address</label>
            <div className="readonly">{address}</div>
          </div>
          <button className="btn teal block lg" style={{marginTop:12}} onClick={() => setStep("success")}>
            <Icon name="arrow" size={14}/> Open cart & order
          </button>
          <p className="tinyNote" style={{textAlign:"center", marginTop:10}}>After ordering, come back here and confirm your pledge</p>
          <div className="row" style={{justifyContent:"center", marginTop:14}}>
            <button className="linkBtn" onClick={() => setStep("method")}>← Back to method selection</button>
          </div>
        </>}

        {/* Step 2B — Drop off myself */}
        {step === "drop" && <>
          <h1 style={{fontSize:24}}>Drop off yourself</h1>
          <p className="muted" style={{marginTop:6, marginBottom:20, fontSize:13.5}}>{itemName} · {qty} {unit} · {home.name}</p>
          <div className="formField">
            <label>Preferred drop-off date</label>
            <DatePicker value={date} onChange={setDate}/>
          </div>
          <div className="formField">
            <label>Preferred time slot</label>
            <div className="row" style={{gap:8, flexWrap:"wrap", marginTop:4}}>
              {["Morning (9am–12pm)","Afternoon (12–4pm)","Evening (4–7pm)"].map(s => (
                <button key={s} type="button" onClick={() => setSlot(s)} className={"pill " + (slot === s ? "active" : "")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="formField">
            <label>Note to the home (optional)</label>
            <textarea rows={3} placeholder="e.g. Will drop off at 10am" value={note} onChange={e => setNote(e.target.value)}/>
          </div>
          <div className="formField">
            <label>Home address</label>
            <div className="readonly">{address}</div>
          </div>
          <div className="formField">
            <label>Contact</label>
            <div className="readonly">{contact}</div>
          </div>
          <div className="row" style={{justifyContent:"space-between", alignItems:"center", marginTop:18}}>
            <button className="linkBtn" onClick={() => setStep("method")}>← Back to method selection</button>
            <button className="btn teal" onClick={() => setStep("success")}>
              <Icon name="check" size={14}/> Confirm Pledge
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}

const MY_PLEDGES_SEED = [
  { id:1, home:"Shanti Niketan Home", area:"Andheri West", item:"Atta", qty:"5 kg", unit:"kg", method:"Drop off", pledgeDate:"8 May 2026", dropDate:"12 May 2026", status:"Pledged" },
  { id:2, home:"Aashraya Ashram", area:"Andheri West", item:"Rice", qty:"3 kg", unit:"kg", method:"Order & Deliver", pledgeDate:"5 May 2026", dropDate:"6 May 2026", status:"Delivered" },
  { id:3, home:"Snehalaya Trust", area:"Bandra East", item:"Oil", qty:"2 L", unit:"L", method:"Drop off", pledgeDate:"3 May 2026", dropDate:"8 May 2026", status:"Pledged" },
  { id:4, home:"Shanti Niketan Home", area:"Andheri West", item:"Dal", qty:"2 kg", unit:"kg", method:"Drop off", pledgeDate:"25 Apr 2026", dropDate:"28 Apr 2026", status:"Missed" },
  { id:5, home:"Snehalaya Trust", area:"Bandra East", item:"Soap", qty:"10 bars", unit:"pieces", method:"Drop off", pledgeDate:"1 May 2026", dropDate:"3 May 2026", status:"Confirmed" },
  { id:6, home:"Jeevan Dhara", area:"Dadar West", item:"Toothpaste", qty:"5 tubes", unit:"pieces", method:"Order & Deliver", pledgeDate:"20 Apr 2026", dropDate:"21 Apr 2026", status:"Confirmed" },
  { id:7, home:"Shanti Niketan Home", area:"Andheri West", item:"Rice", qty:"4 kg", unit:"kg", method:"Drop off", pledgeDate:"15 Apr 2026", dropDate:"17 Apr 2026", status:"Confirmed" },
];

function DonorPledges({ openPledge }) {
  const [tab, setTab] = useState("active");
  const [pledges, setPledges] = useState(MY_PLEDGES_SEED);

  const active = pledges.filter(p => p.status === "Pledged" || p.status === "Delivered" || p.status === "Missed");
  const done = pledges.filter(p => p.status === "Confirmed");
  const list = tab === "active" ? active : done;

  const markDelivered = (id) => setPledges(pledges.map(p => p.id === id ? {...p, status:"Delivered"} : p));

  const rePledge = (p) => {
    const home = HOMES.find(h => h.name === p.home) || { id:"unknown", name:p.home, area:p.area, address:"", contact:"", phone:"", avatarTone:"teal" };
    openPledge && openPledge({ home, itemName:p.item, unit:p.unit, qty:parseInt(p.qty,10) || "" });
  };

  return (
    <div className="fadeIn">
      <div className="pageHead">
        <h1 className="pageTitle">My pledges</h1>
        <p className="pageSub">Track everything you&apos;ve committed to and how it&apos;s progressing.</p>
      </div>

      <div className="tabs">
        <button className={"tab " + (tab==="active"?"active":"")} onClick={() => setTab("active")}>Active <span className="count">{active.length}</span></button>
        <button className={"tab " + (tab==="completed"?"active":"")} onClick={() => setTab("completed")}>Completed <span className="count">{done.length}</span></button>
      </div>

      <div className="tableCard" style={{overflowX:"auto"}}>
        <table className="tbl" style={{minWidth:980}}>
          <thead><tr>
            <th style={{minWidth:220}}>Home</th><th>Item</th><th>Qty</th><th>Method</th><th>Pledged</th><th>Delivery</th><th>Status</th><th style={{textAlign:"right", minWidth:140}}>Action</th>
          </tr></thead>
          <tbody>
            {list.map(p => (
              <tr className="row" key={p.id}>
                <td>
                  <div className="row" style={{gap:10}}>
                    <div className="avatar sm teal">{initials(p.home)}</div>
                    <div style={{minWidth:0}}>
                      <div className="strong" style={{whiteSpace:"nowrap"}}>{p.home}</div>
                      <div className="tinyNote">{p.area}</div>
                    </div>
                  </div>
                </td>
                <td>{p.item}</td>
                <td><span className="strong">{p.qty}</span></td>
                <td><span className="tag">{p.method}</span></td>
                <td style={{whiteSpace:"nowrap"}}>{p.pledgeDate}</td>
                <td style={{whiteSpace:"nowrap"}}>{p.dropDate}</td>
                <td><StatusBadge status={p.status}/></td>
                <td style={{textAlign:"right"}}>
                  {p.status === "Pledged" && (
                    <button className="btn teal sm" onClick={() => markDelivered(p.id)}>
                      <Icon name="check" size={13}/> Mark Delivered
                    </button>
                  )}
                  {p.status === "Missed" && (
                    <button className="linkBtn" onClick={() => rePledge(p)}>Re-pledge →</button>
                  )}
                  {(p.status === "Delivered" || p.status === "Confirmed") && <span className="tinyNote">—</span>}
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={8}><div className="empty">No pledges in this tab yet.</div></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DonorImpact() {
  const months = [
    { m: "Dec", v: 28 }, { m: "Jan", v: 42 }, { m: "Feb", v: 56 },
    { m: "Mar", v: 38 }, { m: "Apr", v: 64 }, { m: "May", v: 22, partial: true },
  ];
  const max = Math.max(...months.map(m => m.v));

  const topHomes = [
    { name: "Shanti Niketan Home", count: 8, area: "Andheri West", tone: "teal" },
    { name: "Asha Bhavan", count: 5, area: "Bandra East", tone: "coral" },
    { name: "Sneh Old Age Home", count: 3, area: "Malad East", tone: "amber" },
  ];

  return (
    <div className="fadeIn">
      <div className="pageHead">
        <h1 className="pageTitle">Your impact</h1>
        <p className="pageSub">Every pledge changes someone&apos;s week. Here&apos;s what you&apos;ve done so far.</p>
      </div>

      <div className="statsRow">
        <div className="stat featured">
          <div className="label">Total pledges</div>
          <div className="value">28</div>
          <div className="delta">since Feb 2025</div>
        </div>
        <div className="stat">
          <div className="label">Homes supported</div>
          <div className="value">9</div>
          <div className="delta">across Mumbai</div>
        </div>
        <div className="stat">
          <div className="label">Residents helped</div>
          <div className="value">412</div>
          <div className="delta up">↑ 60 this month</div>
        </div>
        <div className="stat">
          <div className="label">Streak</div>
          <div className="value">5<span style={{fontSize:18, color:"var(--ink-3)", marginLeft:4}}>mo</span></div>
          <div className="delta">consecutive months</div>
        </div>
      </div>

      <div className="twoCol section">
        <div className="card">
          <div className="row between" style={{marginBottom:6}}>
            <h3>Donations by month</h3>
            <span className="tinyNote">Last 6 months</span>
          </div>
          <div className="barChart">
            {months.map(m => {
              const h = (m.v / max) * 100;
              return (
                <div className="col" key={m.m}>
                  <div className={"bar " + (m.partial ? "muted" : "")} style={{height: h + "%"}}>
                    <span className="lbl">{m.v}</span>
                  </div>
                  <div className="month">{m.m}</div>
                </div>
              );
            })}
          </div>
          <p className="tinyNote" style={{marginTop:14}}>Counts pledged units (kg, L, packets) normalised per month.</p>
        </div>

        <div className="card">
          <h3>Your top homes</h3>
          <div style={{display:"flex", flexDirection:"column", gap:14, marginTop:14}}>
            {topHomes.map((h, i) => (
              <div key={h.name} className="row" style={{gap:12}}>
                <div style={{fontFamily:"var(--serif)", fontSize:22, color:"var(--ink-3)", width:18, textAlign:"center"}}>{i+1}</div>
                <div className={"avatar " + h.tone}>{initials(h.name)}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600, fontSize:13.5}}>{h.name}</div>
                  <div className="tinyNote">{h.area}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"var(--serif)", fontSize:22, fontWeight:500}}>{h.count}</div>
                  <div className="tinyNote">pledges</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DonorProfile() {
  return (
    <div className="fadeIn">
      <div className="pageHead">
        <h1 className="pageTitle">Profile</h1>
        <p className="pageSub">Your account and notification preferences.</p>
      </div>
      <div className="twoCol">
        <div className="card">
          <div className="row" style={{gap:16, marginBottom:18}}>
            <div className="avatar lg">TK</div>
            <div>
              <h2 style={{fontSize:22}}>Tushar Khanna</h2>
              <div className="muted" style={{fontSize:13}}>Donor since Feb 2025 · Mumbai</div>
            </div>
            <button className="btn outline sm" style={{marginLeft:"auto"}}>Edit</button>
          </div>
          <div className="formGrid">
            <div className="formField"><label>Full name</label><div className="readonly">Tushar Khanna</div></div>
            <div className="formField"><label>Phone</label><div className="readonly">+91 98201 11234</div></div>
            <div className="formField"><label>Email</label><div className="readonly">tushar.khanna@gmail.com</div></div>
            <div className="formField"><label>Neighbourhood</label><div className="readonly">Juhu, Mumbai</div></div>
          </div>
        </div>
        <div className="card">
          <h3>Notifications</h3>
          <div style={{display:"flex", flexDirection:"column", gap:14, marginTop:16}}>
            {[
              ["New urgent need within 5km", true],
              ["Weekly digest of nearby homes", true],
              ["Pledge reminders 2 days before", true],
              ["Confirmation when delivery is verified", true],
              ["Monthly impact report", false],
            ].map(([label, on]) => (
              <div key={label} className="row between" style={{padding:"4px 0"}}>
                <div style={{fontSize:13.5}}>{label}</div>
                <div style={{
                  width:36, height:20, borderRadius:999,
                  background: on ? "var(--teal)" : "var(--line)",
                  position:"relative", transition:"all .15s"
                }}>
                  <div style={{
                    position:"absolute", top:2, left: on ? 18 : 2,
                    width:16, height:16, borderRadius:"50%", background:"#fff",
                    transition:"all .15s",
                    boxShadow:"0 1px 2px rgba(0,0,0,0.15)"
                  }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonorApp({ onSignOut }) {
  const [active, setActive] = useState("home");
  const [selectedHome, setSelectedHome] = useState(null);
  const [pledgeCtx, setPledgeCtx] = useState(null);

  const openHome = (h) => { setSelectedHome(h); setActive("homeProfile"); };
  const openPledge = (ctx) => { setPledgeCtx(ctx); setActive("pledge"); };
  const closePledge = () => { setPledgeCtx(null); setActive(selectedHome ? "homeProfile" : "home"); };
  const navTo = (k) => { setSelectedHome(null); setPledgeCtx(null); setActive(k); };

  let screen = null;
  if (active === "home") screen = <DonorHome go={navTo} openPledge={openPledge}/>;
  else if (active === "browse") screen = <DonorBrowse openHome={openHome} />;
  else if (active === "homeProfile") screen = <DonorHomeProfile home={selectedHome} back={() => navTo("browse")} openPledge={openPledge}/>;
  else if (active === "pledge") screen = <PledgeForm ctx={pledgeCtx} onClose={closePledge}/>;
  else if (active === "pledges") screen = <DonorPledges openPledge={openPledge}/>;
  else if (active === "impact") screen = <DonorImpact/>;
  else if (active === "profile") screen = <DonorProfile/>;

  const navKey = active === "homeProfile" ? "browse" : active === "pledge" ? (selectedHome ? "browse" : "home") : active;

  return (
    <div className="app">
      <DonorSidebar active={navKey} setActive={navTo} onSignOut={onSignOut} />
      <main className="main">{screen}</main>
    </div>
  );
}
