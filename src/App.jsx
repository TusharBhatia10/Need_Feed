import { useState } from 'react'
import Icon from './Icon'
import DonorApp from './DonorApp'
import AdminApp from './AdminApp'
import LandingPage from './LandingPage'
import LearnMorePage from './LearnMorePage'
import GetStartedPage from './GetStartedPage'

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
  const [page, setPage] = useState("landing");
  const [view, setView] = useState("donor");

  if (page === "landing") return (
    <LandingPage
      onGetStarted={() => setPage("getstarted")}
      onLearnMore={() => setPage("learnmore")}
    />
  );

  if (page === "learnmore") return (
    <LearnMorePage
      onBack={() => setPage("landing")}
      onGetStarted={() => setPage("getstarted")}
    />
  );

  if (page === "getstarted") return (
    <GetStartedPage
      onBack={() => setPage("landing")}
      onEnterApp={() => setPage("app")}
    />
  );

  const AppView = view === "donor" ? DonorApp : AdminApp;
  return (
    <>
      <ViewToggle view={view} setView={setView} />
      <AppView onSignOut={() => setPage("landing")} />
    </>
  );
}
