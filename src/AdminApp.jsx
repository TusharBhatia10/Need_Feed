import { useState, useMemo } from 'react'
import Icon from './Icon'
import { initials, INCOMING_PLEDGES, HISTORY } from './data'

const NAV_ADMIN = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "needs", label: "Needs Board", icon: "needs" },
  { key: "incoming", label: "Incoming Pledges", icon: "incoming" },
  { key: "history", label: "Donation History", icon: "history" },
  { key: "profile", label: "Home Profile", icon: "settings" },
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

function AdminSidebar({ active, setActive, onSignOut }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark">N</div>
        <div>
          <div className="name">NeedFeed</div>
          <div className="tag">Home admin</div>
        </div>
      </div>
      <nav className="navList">
        {NAV_ADMIN.map(n => (
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
          <div className="avatar teal">SN</div>
          <div>
            <div className="name">Shanti Niketan</div>
            <div className="role">Anuradha Pillai · Admin</div>
          </div>
        </div>
        <button className="signOut" onClick={() => setConfirming(true)}><Icon name="logout" size={14}/> Sign out</button>
      </div>
      {confirming && <SignOutModal onConfirm={onSignOut} onCancel={() => setConfirming(false)} />}
    </aside>
  );
}

function ABadge({ status }) {
  const map = { "Urgent":"urgent", "Partial":"partial", "Covered":"covered", "Pledged":"pledged", "Overdue":"overdue", "Confirmed":"confirmed", "Delivered":"delivered", "Ordered":"ordered" };
  return <span className={"badge " + (map[status] || "")}><span className="dot"/>{status}</span>;
}

const statusOf = (n) => n.pledged === 0 ? "Urgent" : n.pledged >= n.needed ? "Covered" : "Partial";

const INITIAL_NEEDS = [
  { id:1, item:"Atta (whole wheat flour)", category:"Grains",      needed:60, pledged:25, unit:"kg" },
  { id:2, item:"Basmati Rice",             category:"Grains",      needed:50, pledged:50, unit:"kg" },
  { id:3, item:"Toor Dal",                 category:"Grains",      needed:30, pledged:8,  unit:"kg" },
  { id:4, item:"Mustard Oil",              category:"Grains",      needed:20, pledged:0,  unit:"L" },
  { id:5, item:"Bath Soap",                category:"Toiletries",  needed:50, pledged:32, unit:"pieces" },
  { id:6, item:"Toothpaste (200g)",        category:"Toiletries",  needed:25, pledged:0,  unit:"pieces" },
  { id:7, item:"Potatoes",                 category:"Vegetables",  needed:40, pledged:12, unit:"kg" },
  { id:8, item:"Onions",                   category:"Vegetables",  needed:35, pledged:35, unit:"kg" },
];

function AdminDashboard({ go }) {
  const todayDeliveries = INCOMING_PLEDGES.filter(p => p.when === "today");
  const attention = INITIAL_NEEDS.filter(n => n.pledged === 0 || (n.pledged > 0 && n.pledged < n.needed * 0.4));

  const feed = [
    { dot:"teal",  text:<span><b>Tushar Khanna</b> pledged <b>10 kg Atta</b></span>, when:"12 min ago" },
    { dot:"green", text:<span>Confirmed <b>Priya&apos;s 8 kg Toor Dal</b> delivery</span>, when:"1 hr ago" },
    { dot:"coral", text:<span><b>Vikram&apos;s Bath Soap</b> pledge is now overdue</span>, when:"3 hr ago" },
    { dot:"teal",  text:<span><b>Aditi Kulkarni</b> pledged <b>12 kg Potatoes</b></span>, when:"yesterday" },
    { dot:"amber", text:<span>You added a new need: <b>Toothpaste (200g)</b></span>, when:"yesterday" },
    { dot:"green", text:<span>Confirmed <b>Karthik&apos;s 20 kg Onions</b> delivery</span>, when:"2 days ago" },
  ];

  return (
    <div className="fadeIn">
      <div className="topbar">
        <div className="left">
          <h1>Shanti Niketan Home</h1>
          <div className="sub">Andheri West, Mumbai · 42 residents · Saturday, May 9</div>
        </div>
        <div className="row" style={{gap:8}}>
          <button className="btn outline sm">Share donor link</button>
          <button className="btn teal sm" onClick={() => go("needs")}><Icon name="plus" size={14}/> Add need</button>
        </div>
      </div>

      <div className="statsRow">
        <div className="stat featured"><div className="label">Active needs</div><div className="value">7</div><div className="delta">3 urgent</div></div>
        <div className="stat"><div className="label">Incoming pledges</div><div className="value">5</div><div className="delta up">2 expected today</div></div>
        <div className="stat"><div className="label">Delivered this month</div><div className="value">18</div><div className="delta up">↑ 4 from April</div></div>
        <div className="stat"><div className="label">Coverage rate</div><div className="value">64<span style={{fontSize:18, color:"var(--ink-3)", marginLeft:2}}>%</span></div><div className="delta">across all items</div></div>
      </div>

      <div className="twoCol section">
        <div className="card">
          <div className="row between" style={{marginBottom:6}}>
            <h3>Needs requiring attention</h3>
            <button className="linkBtn" onClick={() => go("needs")}>Open needs board →</button>
          </div>
          <div className="attnList">
            {attention.map(n => {
              const pct = Math.min(100, Math.round((n.pledged/n.needed)*100));
              const status = statusOf(n);
              return (
                <div className="attnRow" key={n.id}>
                  <div>
                    <div className="name">{n.item}</div>
                    <div className="cat">{n.category}</div>
                  </div>
                  <div className="qtyCell">
                    <span><span className="num">{n.pledged}</span> <span className="of">/ {n.needed} {n.unit}</span></span>
                    <div className="progress"><div className={"bar " + (status==="Urgent"?"coral":"amber")} style={{width: pct + "%"}}/></div>
                  </div>
                  <div><ABadge status={status} /></div>
                  <div style={{textAlign:"right"}}><button className="btn outline sm">Edit</button></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3>Today&apos;s expected deliveries</h3>
          <div style={{marginTop:14, display:"flex", flexDirection:"column", gap:14}}>
            {todayDeliveries.map(p => (
              <div className="row" key={p.id} style={{gap:12}}>
                <div className="avatar coral">{initials(p.donor)}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600, fontSize:13.5}}>{p.donor}</div>
                  <div className="tinyNote">{p.qty} of {p.item}</div>
                </div>
                <button className="btn teal sm">Mark received</button>
              </div>
            ))}
            {todayDeliveries.length === 0 && <div className="tinyNote">No deliveries scheduled today.</div>}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="sectionHead"><h2>Recent activity</h2><span className="tinyNote">Last 48 hours</span></div>
        <div className="card">
          <div className="feed">
            {feed.map((f, i) => (
              <div className="item" key={i}>
                <div className={"dot " + f.dot}/>
                <div style={{flex:1}}>{f.text}</div>
                <div className="when">{f.when}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddNeedForm({ onAdd, onCancel }) {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("Grains");
  const [needed, setNeeded] = useState("");
  const [unit, setUnit] = useState("kg");
  return (
    <div className="card fadeIn" style={{borderColor:"var(--teal-light)", background:"var(--teal-tint)"}}>
      <div className="row between" style={{marginBottom:12}}>
        <h3>Add a new need</h3>
        <button className="btn ghost sm" onClick={onCancel}><Icon name="x" size={14}/></button>
      </div>
      <div className="formGrid">
        <div className="formField full"><label>Item name</label><input placeholder="e.g. Sugar" value={item} onChange={e => setItem(e.target.value)} /></div>
        <div className="formField"><label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option>Grains</option><option>Vegetables</option><option>Toiletries</option><option>Medicine</option><option>Other</option>
          </select>
        </div>
        <div className="formField"><label>Quantity needed</label><input type="number" placeholder="e.g. 30" value={needed} onChange={e => setNeeded(e.target.value)} /></div>
        <div className="formField"><label>Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value)}>
            <option>kg</option><option>L</option><option>packets</option><option>pieces</option>
          </select>
        </div>
      </div>
      <div className="row" style={{justifyContent:"flex-end", gap:8, marginTop:6}}>
        <button className="btn ghost" onClick={onCancel}>Cancel</button>
        <button className="btn teal" disabled={!item || !needed} onClick={() => onAdd({ item, category, needed: Number(needed), pledged: 0, unit })}>
          <Icon name="check" size={14}/> Add need
        </button>
      </div>
    </div>
  );
}

function NeedsBoard() {
  const [needs, setNeeds] = useState(INITIAL_NEEDS);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return needs;
    return needs.filter(n => statusOf(n).toLowerCase() === filter);
  }, [needs, filter]);

  const counts = {
    all: needs.length,
    urgent: needs.filter(n => statusOf(n) === "Urgent").length,
    partial: needs.filter(n => statusOf(n) === "Partial").length,
    covered: needs.filter(n => statusOf(n) === "Covered").length,
  };

  return (
    <div className="fadeIn">
      <div className="topbar">
        <div className="left">
          <h1>Needs board</h1>
          <div className="sub">Add, edit and prioritise your home&apos;s supply requests.</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="pillRow">
          <button className={"pill " + (filter==="all"?"active":"")} onClick={() => setFilter("all")}>All <span className="count">{counts.all}</span></button>
          <button className={"pill " + (filter==="urgent"?"active":"")} onClick={() => setFilter("urgent")}>Urgent <span className="count">{counts.urgent}</span></button>
          <button className={"pill " + (filter==="partial"?"active":"")} onClick={() => setFilter("partial")}>Partial <span className="count">{counts.partial}</span></button>
          <button className={"pill " + (filter==="covered"?"active":"")} onClick={() => setFilter("covered")}>Covered <span className="count">{counts.covered}</span></button>
        </div>
        <button className="btn teal" onClick={() => setAdding(true)} style={{marginLeft:"auto"}}><Icon name="plus" size={14}/> Add new need</button>
      </div>

      {adding && (
        <div style={{marginBottom:18}}>
          <AddNeedForm onAdd={(n) => { setNeeds([{ id: Date.now(), ...n }, ...needs]); setAdding(false); }} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="tableCard">
        <table className="tbl">
          <thead><tr>
            <th>Item</th><th>Category</th><th style={{width:120}}>Needed</th><th style={{width:200}}>Pledged</th><th style={{width:120}}>Status</th><th style={{width:90, textAlign:"right"}}>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(n => {
              const status = statusOf(n);
              const pct = Math.min(100, Math.round((n.pledged/n.needed)*100));
              const cls = status === "Urgent" ? "coral" : status === "Partial" ? "amber" : "green";
              return (
                <tr className="row" key={n.id}>
                  <td><span className="strong">{n.item}</span></td>
                  <td><span className="tag">{n.category}</span></td>
                  <td><span className="strong">{n.needed} {n.unit}</span></td>
                  <td>
                    <div className="qtyCell">
                      <span><span className="num">{n.pledged}</span> <span className="of">/ {n.needed} {n.unit}</span></span>
                      <div className="progress"><div className={"bar " + cls} style={{width: pct + "%"}}/></div>
                    </div>
                  </td>
                  <td><ABadge status={status}/></td>
                  <td style={{textAlign:"right"}}>
                    <div className="row" style={{gap:4, justifyContent:"flex-end"}}>
                      <button className="btn ghost sm" title="Edit"><Icon name="edit" size={14}/></button>
                      <button className="btn ghost sm" title="Remove" onClick={() => setNeeds(needs.filter(x => x.id !== n.id))}><Icon name="trash" size={14}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IncomingPledges() {
  const [tab, setTab] = useState("upcoming");
  const [pledges, setPledges] = useState(INCOMING_PLEDGES);

  const filtered = pledges.filter(p => p.when === tab);
  const counts = {
    upcoming: pledges.filter(p => p.when === "upcoming").length,
    today: pledges.filter(p => p.when === "today").length,
    overdue: pledges.filter(p => p.when === "overdue").length,
  };

  const markReceived = (id) => {
    setPledges(pledges.map(p => p.id === id ? { ...p, status: "Confirmed", when: "received" } : p));
  };

  return (
    <div className="fadeIn">
      <div className="topbar">
        <div className="left">
          <h1>Incoming pledges</h1>
          <div className="sub">Confirm deliveries as donors drop off their supplies.</div>
        </div>
      </div>

      <div className="tabs">
        <button className={"tab " + (tab==="upcoming"?"active":"")} onClick={() => setTab("upcoming")}>Upcoming <span className="count">{counts.upcoming}</span></button>
        <button className={"tab " + (tab==="today"?"active":"")} onClick={() => setTab("today")}>Today <span className="count">{counts.today}</span></button>
        <button className={"tab " + (tab==="overdue"?"active":"")} onClick={() => setTab("overdue")}>Overdue <span className="count">{counts.overdue}</span></button>
      </div>

      <div className="tableCard">
        <table className="tbl">
          <thead><tr>
            <th>Donor</th><th>Item</th><th>Qty</th><th>Pledged</th><th>Drop-off</th><th>Status</th><th></th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr className="row" key={p.id}>
                <td>
                  <div className="row" style={{gap:10}}>
                    <div className={"avatar sm " + (p.when==="overdue"?"coral":"teal")}>{initials(p.donor)}</div>
                    <span className="strong">{p.donor}</span>
                  </div>
                </td>
                <td>{p.item}</td>
                <td><span className="strong">{p.qty}</span></td>
                <td>{p.pledgeDate}</td>
                <td>{p.dropDate}</td>
                <td><ABadge status={p.status}/></td>
                <td style={{textAlign:"right"}}>
                  <button className="btn teal sm" onClick={() => markReceived(p.id)}>
                    <Icon name="check" size={14}/> Mark as received
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7}><div className="empty">Nothing in this tab.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DonationHistory() {
  const months = [
    { m:"Dec", v: 12 }, { m:"Jan", v: 16 }, { m:"Feb", v: 14 },
    { m:"Mar", v: 22 }, { m:"Apr", v: 20 }, { m:"May", v: 8, partial: true },
  ];
  const max = Math.max(...months.map(x => x.v));
  const uniqueDonors = new Set(HISTORY.map(h => h.donor)).size;
  return (
    <div className="fadeIn">
      <div className="topbar">
        <div className="left">
          <h1>Donation history</h1>
          <div className="sub">Every confirmed delivery, on the record.</div>
        </div>
        <button className="btn outline sm">Export CSV</button>
      </div>

      <div className="statsRow">
        <div className="stat featured"><div className="label">Total deliveries</div><div className="value">92</div><div className="delta">all time</div></div>
        <div className="stat"><div className="label">Unique donors</div><div className="value">{uniqueDonors + 14}</div><div className="delta up">↑ 4 new in May</div></div>
        <div className="stat"><div className="label">Most donated item</div><div className="value" style={{fontSize:24}}>Atta</div><div className="delta">328 kg total</div></div>
      </div>

      <div className="twoCol section">
        <div className="tableCard" style={{gridColumn:"1 / 2"}}>
          <table className="tbl">
            <thead><tr><th>Donor</th><th>Item</th><th>Qty</th><th>Date</th><th>Confirmed by</th></tr></thead>
            <tbody>
              {HISTORY.map((h, i) => (
                <tr className="row" key={i}>
                  <td><div className="row" style={{gap:10}}><div className="avatar sm teal">{initials(h.donor)}</div><span className="strong">{h.donor}</span></div></td>
                  <td>{h.item}</td>
                  <td><span className="strong">{h.qty}</span></td>
                  <td>{h.date}</td>
                  <td>{h.confirmedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="row between" style={{marginBottom:6}}>
            <h3>Monthly deliveries</h3>
            <span className="tinyNote">Last 6 mo</span>
          </div>
          <div className="barChart" style={{height:180}}>
            {months.map(m => {
              const h = (m.v / max) * 100;
              return (
                <div className="col" key={m.m}>
                  <div className={"bar " + (m.partial?"muted":"")} style={{height: h + "%"}}>
                    <span className="lbl">{m.v}</span>
                  </div>
                  <div className="month">{m.m}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeProfileEdit() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Shanti Niketan Home",
    address: "Plot 14, Veera Desai Road, Andheri West",
    city: "Mumbai", pin: "400053",
    contactName: "Anuradha Pillai", phone: "+91 98201 44872", email: "shanti.niketan@needfeed.in",
    residents: 42,
    about: "Shanti Niketan has been a refuge for elderly women in West Mumbai since 1987. We house 42 residents — most of whom have outlived their families — and provide daily meals, basic medical care, and a quiet, dignified community.",
    hours: "Mon–Sat, 9:30 AM – 5:30 PM",
  });
  const update = (k, v) => { setForm({ ...form, [k]: v }); setSaved(false); };

  return (
    <div className="fadeIn">
      <div className="topbar">
        <div className="left">
          <h1>Home profile</h1>
          <div className="sub">This is what donors see when they open your home page.</div>
        </div>
        <div className="row" style={{gap:8}}>
          <button className="btn outline">Cancel</button>
          <button className="btn teal" onClick={() => setSaved(true)}><Icon name="check" size={14}/> Save changes</button>
        </div>
      </div>

      {saved && (
        <div className="card fadeIn" style={{borderColor:"var(--green-light)", background:"var(--green-light)", color:"#4a7517", marginBottom:18, padding:"12px 16px", display:"flex", alignItems:"center", gap:10, fontWeight:600, fontSize:13}}>
          <Icon name="check" size={16}/> Profile saved.
        </div>
      )}

      <div className="twoCol">
        <div className="card">
          <h3>Basic information</h3>
          <div className="formGrid" style={{marginTop:14}}>
            <div className="formField full"><label>Home name</label><input value={form.name} onChange={e => update("name", e.target.value)}/></div>
            <div className="formField full"><label>Address</label><input value={form.address} onChange={e => update("address", e.target.value)}/></div>
            <div className="formField"><label>City</label><input value={form.city} onChange={e => update("city", e.target.value)}/></div>
            <div className="formField"><label>Pin code</label><input value={form.pin} onChange={e => update("pin", e.target.value)}/></div>
            <div className="formField"><label>Resident count</label><input type="number" value={form.residents} onChange={e => update("residents", e.target.value)}/></div>
            <div className="formField"><label>Operating hours</label><input value={form.hours} onChange={e => update("hours", e.target.value)}/></div>
            <div className="formField full"><label>About</label><textarea rows={4} value={form.about} onChange={e => update("about", e.target.value)}/></div>
          </div>

          <div className="divider"/>
          <h3>Contact</h3>
          <div className="formGrid" style={{marginTop:14}}>
            <div className="formField"><label>Contact person</label><input value={form.contactName} onChange={e => update("contactName", e.target.value)}/></div>
            <div className="formField"><label>Phone</label><input value={form.phone} onChange={e => update("phone", e.target.value)}/></div>
            <div className="formField full"><label>Email</label><input value={form.email} onChange={e => update("email", e.target.value)}/></div>
          </div>
        </div>

        <div className="col" style={{gap:14}}>
          <div className="shareCard">
            <h3 style={{display:"flex", alignItems:"center", gap:8}}><Icon name="arrow" size={16}/> Your NeedFeed link</h3>
            <p className="muted" style={{fontSize:12.5, marginTop:6}}>Share this with potential donors — anyone with the link can see your needs and pledge directly.</p>
            <div className="url">
              <span>needfeed.in/h/shanti-niketan</span>
              <button className="btn ghost sm"><Icon name="copy" size={13}/> Copy</button>
            </div>
          </div>
          <div className="card">
            <h3>Live preview</h3>
            <div style={{marginTop:14, padding:14, background:"var(--bg-2)", borderRadius:10, border:"1px solid var(--line-2)"}}>
              <div className="row" style={{gap:12, alignItems:"flex-start"}}>
                <div className="avatar lg teal" style={{width:48, height:48, fontSize:14}}>{initials(form.name)}</div>
                <div>
                  <div style={{fontFamily:"var(--serif)", fontSize:18, fontWeight:500, lineHeight:1.2}}>{form.name}</div>
                  <div className="tinyNote" style={{marginTop:4}}>{form.address}, {form.city} {form.pin}</div>
                  <div style={{marginTop:8, fontSize:12.5, color:"var(--ink-2)", lineHeight:1.5}}>{form.about.slice(0, 120)}…</div>
                </div>
              </div>
            </div>
            <p className="tinyNote" style={{marginTop:10}}>Updates appear instantly in donors&apos; search results.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminApp({ onSignOut }) {
  const [active, setActive] = useState("dashboard");
  let screen = null;
  if (active === "dashboard") screen = <AdminDashboard go={setActive}/>;
  else if (active === "needs") screen = <NeedsBoard/>;
  else if (active === "incoming") screen = <IncomingPledges/>;
  else if (active === "history") screen = <DonationHistory/>;
  else if (active === "profile") screen = <HomeProfileEdit/>;
  return (
    <div className="app">
      <AdminSidebar active={active} setActive={setActive} onSignOut={onSignOut}/>
      <main className="main dense">{screen}</main>
    </div>
  );
}
