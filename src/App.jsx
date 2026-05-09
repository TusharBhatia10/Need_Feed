import { useState } from 'react'
import Icon from './Icon'
import DonorApp from './DonorApp'
import AdminApp from './AdminApp'

function ViewToggle({ view, setView }) {
  return (
    <div className="viewToggle" role="tablist" aria-label="Switch app view">
      <button
        className={view === "donor" ? "active" : ""}
        onClick={() => setView("donor")}
        role="tab"
        aria-selected={view === "donor"}>
        <Icon name="profile" size={13}/> Donor
      </button>
      <button
        className={view === "admin" ? "active" : ""}
        onClick={() => setView("admin")}
        role="tab"
        aria-selected={view === "admin"}>
        <Icon name="dashboard" size={13}/> Home admin
      </button>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("donor");
  const AppView = view === "donor" ? DonorApp : AdminApp;
  return (
    <>
      <ViewToggle view={view} setView={setView} />
      <AppView />
    </>
  );
}
