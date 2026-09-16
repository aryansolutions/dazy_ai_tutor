import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Welcome from "./pages/Welcome";
import Tutor from "./pages/Tutor";

function loadProfile() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("dazy_profile")
    );

    if (saved?.adult_confirmed) {
      return saved;
    }
  } catch {
    return null;
  }

  return null;
}

export default function App() {
  const [profile, setProfile] = useState(loadProfile);
  const [view, setView] = useState(
    profile ? "tutor" : "home"
  );

  function startTutor(newProfile) {
    localStorage.setItem(
      "dazy_profile",
      JSON.stringify(newProfile)
    );

    setProfile(newProfile);
    setView("tutor");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goHome() {
    setView("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goTutor() {
    if (profile) {
      setView("tutor");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setView("home");

    setTimeout(() => {
      document
        .getElementById("start")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  }

  function resetProfile() {
    localStorage.removeItem("dazy_profile");
    localStorage.removeItem("dazy_messages");
    localStorage.removeItem("dazy_session_id");

    setProfile(null);
    setView("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="app-shell">
      <Navbar
        profile={profile}
        view={view}
        onHome={goHome}
        onTutor={goTutor}
      />

      <main className="app-main">
        {view === "tutor" && profile ? (
          <Tutor
            profile={profile}
            onResetProfile={resetProfile}
          />
        ) : (
          <Welcome
            profile={profile}
            onStart={startTutor}
            onContinue={goTutor}
          />
        )}
      </main>

      <Footer
        profile={profile}
        onTutor={goTutor}
        onHome={goHome}
      />
    </div>
  );
}