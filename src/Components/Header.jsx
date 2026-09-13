import {
    useState
} from "react";

export default function Header({
    profile,
    autoSpeak,
    setAutoSpeak,
    onClear,
    onResetProfile,
}) {
    const [
        menuOpen,
        setMenuOpen
    ] = useState(false);

    return (
        <header className="topbar">

            <div className="logo-container">

                <div className="logo-icon">
                    D
                </div>

                <div>

                    <strong>
                        Dazy
                    </strong>

                    <span>
                        AI College Tutor · 18+
                    </span>

                </div>

            </div>

            <div className="top-actions">

                <button
                    className={`voice-toggle ${autoSpeak
                            ? "enabled"
                            : ""
                        }`}
                    onClick={() =>
                        setAutoSpeak(
                            (value) =>
                                !value
                        )
                    }
                    type="button"
                >

                    <span>
                        {autoSpeak
                            ? "🔊"
                            : "🔇"}
                    </span>

                    <span>
                        {autoSpeak
                            ? "Voice on"
                            : "Voice off"}
                    </span>

                </button>

                <div className="profile-wrapper">

                    <button
                        className="profile-button"
                        onClick={() =>
                            setMenuOpen(
                                (value) =>
                                    !value
                            )
                        }
                        type="button"
                        aria-expanded={
                            menuOpen
                        }
                    >

                        <div className="profile-avatar">

                            {profile.name
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div className="profile-text">

                            <strong>
                                {profile.name}
                            </strong>

                            <span>
                                {profile.year}
                            </span>

                        </div>

                        <span>⌄</span>

                    </button>

                    {menuOpen && (

                        <div className="profile-menu">

                            <button
                                type="button"
                                onClick={() => {

                                    onClear();

                                    setMenuOpen(false);

                                }}
                            >
                                New conversation
                            </button>

                            <button
                                type="button"
                                className="danger"
                                onClick={
                                    onResetProfile
                                }
                            >
                                Change profile
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
}