export default function Footer({
    profile,
    onTutor,
    onHome,
}) {
    const year = new Date().getFullYear();

    function goSection(id) {
        onHome();

        setTimeout(() => {
            document
                .getElementById(id)
                ?.scrollIntoView({
                    behavior: "smooth",
                });
        }, 100);
    }

    return (
        <footer className="site-footer">
            <div className="footer-glow" />

            <div className="footer-container">
                <div className="footer-main">
                    <div className="footer-company">
                        <div className="footer-brand">
                            <span className="brand-mark">
                                D
                            </span>

                            <span>
                                <strong>Dazy</strong>
                                <small>
                                    Intelligent Learning Platform
                                </small>
                            </span>
                        </div>

                        <p>
                            An AI-powered learning workspace
                            designed for college students and
                            adult learners who want clearer,
                            faster and more interactive study
                            sessions.
                        </p>

                        <button
                            className="footer-cta"
                            onClick={onTutor}
                        >
                            {profile
                                ? "Return to workspace"
                                : "Start a learning session"}

                            <span>↗</span>
                        </button>
                    </div>

                    <div className="footer-links">
                        <div>
                            <h4>Product</h4>

                            <button
                                onClick={() =>
                                    goSection("features")
                                }
                            >
                                Features
                            </button>

                            <button
                                onClick={() =>
                                    goSection("how-it-works")
                                }
                            >
                                How it works
                            </button>

                            <button onClick={onTutor}>
                                AI Tutor
                            </button>
                        </div>

                        <div>
                            <h4>Learning</h4>

                            <span>Concept learning</span>
                            <span>Exam preparation</span>
                            <span>Interview practice</span>
                            <span>Revision sessions</span>
                        </div>

                        <div>
                            <h4>Platform</h4>

                            <span>Voice interaction</span>
                            <span>Conversation memory</span>
                            <span>Adaptive tutoring</span>
                            <span>Study modes</span>
                        </div>
                    </div>
                </div>

                <div className="footer-divider" />

                <div className="footer-bottom">
                    <span>
                        © {year} Dazy Learning.
                    </span>

                    <span>
                        Designed for learners aged 18+.
                    </span>

                    <span className="footer-tech">
                        AI • Voice • Learning
                    </span>
                </div>
            </div>
        </footer>
    );
}