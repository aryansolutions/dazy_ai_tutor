import { useState } from "react";

import Welcome from "./pages/Welcome";
import Tutor from "./pages/Tutor";

const PROFILE_KEY = "dazy_profile";

function loadProfile() {
  try {
    const stored =
      localStorage.getItem(PROFILE_KEY);

    if (!stored) {
      return null;
    }

    const profile =
      JSON.parse(stored);

    if (!profile?.adult_confirmed) {
      localStorage.removeItem(PROFILE_KEY);

      return null;
    }

    return profile;
  } catch {
    return null;
  }
}

export default function App() {
  const [profile, setProfile] =
    useState(loadProfile);

  function startDazy(profileData) {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(profileData)
    );

    setProfile(profileData);
  }

  function resetProfile() {
    localStorage.removeItem(
      PROFILE_KEY
    );

    localStorage.removeItem(
      "dazy_messages"
    );

    localStorage.removeItem(
      "dazy_session_id"
    );

    setProfile(null);
  }

  return profile ? (
    <Tutor
      profile={profile}
      onResetProfile={resetProfile}
    />
  ) : (
    <Welcome
      onStart={startDazy}
    />
  );
}