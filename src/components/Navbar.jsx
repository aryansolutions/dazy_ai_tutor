import { useState } from "react";

export default function Navbar({
    profile,
    view,
    onHome,
    onTutor,
}) {
    const [open, setOpen] = useState(false);

    function scrollToSection(id) {
        onHome();

        setOpen(false);

        setTimeout(() => {
            document
                .getElementById(id)
                ?.scrollIntoView({
                    behavior: "smooth",
                });
        }, 100);
    }

    return (
        <header className="main-navbar">
            <div className="nav-container">
                <button
                    className="nav-brand"
                    onClick={() => {
                        onHome();
                        setOpen(false);
                    }}
                >
                    <span className="brand-mark">
                        D
                    </span>

                    <span className="brand-copy">
                        <strong>Dazy</strong>
                        <small>AI Learning Platform</small>
                    </span>
                </button>

                <nav
                    className={`nav-links ${open ? "nav-open" : ""
                        }`}
                >
                    <button
                        className={
                            view === "home"
                                ? "nav-link active"
                                : "nav-link"
                        }
                        onClick={() => {
                            onHome();
                            setOpen(false);
                        }}
                    >
                        Home
                    </button>

                    <button
                        className="nav-link"
                        onClick={() =>
                            scrollToSection("features")
                        }
                    >
                        Features
                    </button>

                    <button
                        className="nav-link"
                        onClick={() =>
                            scrollToSection("how-it-works")
                        }
                    >
                        How it works
                    </button>

                    <button
                        className="nav-link"
                        onClick={() =>
                            scrollToSection("platform")
                        }
                    >
                        Platform
                    </button>
                </nav>

                <div className="nav-actions">
                    <div className="system-status">
                        <span className="status-dot" />
                        AI online
                    </div>

                    <button
                        className="nav-primary"
                        onClick={onTutor}
                    >
                        {profile
                            ? "Open workspace"
                            : "Start learning"}

                        <span>→</span>
                    </button>

                    <button
                        className="mobile-menu"
                        onClick={() =>
                            setOpen((current) => !current)
                        }
                        aria-label="Toggle navigation"
                    >
                        {open ? "×" : "☰"}
                    </button>
                </div>
            </div>
        </header>
    );
}