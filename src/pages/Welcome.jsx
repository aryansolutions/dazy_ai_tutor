import { useState } from "react";
import DazyAvatar from "../components/DazyAvatar";

const FEATURES = [
    {
        icon: "01",
        title: "Adaptive AI tutoring",
        text:
            "Ask questions naturally and receive explanations adapted to your course, year and current learning goal.",
    },
    {
        icon: "02",
        title: "Voice conversations",
        text:
            "Talk to Dazy using your microphone and hear responses through integrated browser speech.",
    },
    {
        icon: "03",
        title: "Learning memory",
        text:
            "Your active learning session keeps conversational context so follow-up questions feel natural.",
    },
    {
        icon: "04",
        title: "Multiple study modes",
        text:
            "Switch between teaching, quizzes, interview preparation, revision and exam-focused learning.",
    },
    {
        icon: "05",
        title: "Focused study sessions",
        text:
            "Use a built-in focus timer and structured workspace to keep study sessions intentional.",
    },
    {
        icon: "06",
        title: "Personalized workspace",
        text:
            "Dazy uses your degree, study stage and subject to make explanations more relevant.",
    },
];

const STEPS = [
    {
        number: "01",
        title: "Create your study profile",
        text:
            "Tell Dazy what you study and what you currently want to learn.",
    },
    {
        number: "02",
        title: "Choose a learning mode",
        text:
            "Learn a concept, revise, practice interviews, take a quiz or prepare for an exam.",
    },
    {
        number: "03",
        title: "Talk naturally",
        text:
            "Type or use voice. Ask follow-up questions without restarting your explanation.",
    },
];

const YEARS = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "5th Year",
    "Postgraduate",
    "Graduated",
    "Other",
];

export default function Welcome({
    profile,
    onStart,
    onContinue,
}) {
    const [form, setForm] = useState({
        name: "",
        degree: "",
        year: "",
        subject: "",
        adult_confirmed: false,
    });

    const [error, setError] = useState("");

    function updateField(event) {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (
            !form.name.trim() ||
            !form.degree.trim() ||
            !form.year
        ) {
            setError(
                "Complete your name, course and study stage."
            );

            return;
        }

        if (!form.adult_confirmed) {
            setError(
                "Dazy is currently available to learners aged 18 and above."
            );

            return;
        }

        setError("");

        onStart({
            student_name: form.name.trim(),
            course: form.degree.trim(),
            year: form.year,
            subject: form.subject.trim(),
            adult_confirmed: true,
        });
    }

    return (
        <>
            <section className="hero-section">
                <div className="hero-grid" />

                <div className="hero-container">
                    <div className="hero-copy">
                        <div className="eyebrow">
                            <span className="eyebrow-dot" />
                            AI-powered learning workspace
                        </div>

                        <h1>
                            Learn with an AI tutor that
                            <span>
                                {" "}
                                adapts to the way you study.
                            </span>
                        </h1>

                        <p className="hero-description">
                            Dazy combines conversational AI,
                            voice interaction and persistent
                            session context into one focused
                            study environment for university
                            and adult learners.
                        </p>

                        <div className="hero-buttons">
                            <button
                                className="primary-large"
                                onClick={
                                    profile
                                        ? onContinue
                                        : () =>
                                            document
                                                .getElementById(
                                                    "start"
                                                )
                                                ?.scrollIntoView({
                                                    behavior:
                                                        "smooth",
                                                })
                                }
                            >
                                {profile
                                    ? "Continue learning"
                                    : "Start learning"}

                                <span>→</span>
                            </button>

                            <button
                                className="secondary-large"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "features"
                                        )
                                        ?.scrollIntoView({
                                            behavior:
                                                "smooth",
                                        })
                                }
                            >
                                Explore platform
                            </button>
                        </div>

                        <div className="hero-proof">
                            <div>
                                <strong>Voice + Text</strong>
                                <span>
                                    Natural interaction
                                </span>
                            </div>

                            <div>
                                <strong>5 Study Modes</strong>
                                <span>
                                    Different learning goals
                                </span>
                            </div>

                            <div>
                                <strong>Session Memory</strong>
                                <span>
                                    Context-aware tutoring
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-product-preview">
                        <div className="preview-glow" />

                        <div className="preview-window">
                            <div className="preview-header">
                                <div className="window-controls">
                                    <span />
                                    <span />
                                    <span />
                                </div>

                                <div className="preview-status">
                                    <span />
                                    Learning session
                                </div>
                            </div>

                            <div className="preview-body">
                                <div className="preview-avatar">
                                    <DazyAvatar
                                        state="idle"
                                        size="large"
                                    />
                                </div>

                                <span className="assistant-label">
                                    DAZY AI TUTOR
                                </span>

                                <h3>
                                    What would you like to
                                    understand today?
                                </h3>

                                <p>
                                    Ask a concept, prepare for an
                                    interview or start a focused
                                    revision session.
                                </p>

                                <div className="preview-suggestions">
                                    <span>
                                        Explain a concept
                                    </span>

                                    <span>
                                        Quiz me
                                    </span>

                                    <span>
                                        Interview prep
                                    </span>
                                </div>
                            </div>

                            <div className="preview-input">
                                <span>
                                    Ask Dazy anything...
                                </span>

                                <button>↑</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="trust-strip">
                <div className="trust-container">
                    <span>BUILT FOR</span>
                    <strong>University study</strong>
                    <i />
                    <strong>Technical concepts</strong>
                    <i />
                    <strong>Exam preparation</strong>
                    <i />
                    <strong>Interview practice</strong>
                </div>
            </section>

            <section
                className="features-section"
                id="features"
            >
                <div className="section-container">
                    <div className="section-heading">
                        <div>
                            <span className="section-tag">
                                PLATFORM
                            </span>

                            <h2>
                                More than a simple AI chat.
                            </h2>
                        </div>

                        <p>
                            Dazy is structured as a complete
                            learning workspace rather than a
                            blank chatbot window.
                        </p>
                    </div>

                    <div className="feature-grid">
                        {FEATURES.map((feature) => (
                            <article
                                className="feature-card"
                                key={feature.title}
                            >
                                <span className="feature-number">
                                    {feature.icon}
                                </span>

                                <div className="feature-symbol">
                                    ✦
                                </div>

                                <h3>{feature.title}</h3>

                                <p>{feature.text}</p>

                                <div className="feature-line" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                className="platform-section"
                id="platform"
            >
                <div className="section-container platform-grid">
                    <div className="platform-copy">
                        <span className="section-tag">
                            INTELLIGENT WORKSPACE
                        </span>

                        <h2>
                            One place for different ways of
                            learning.
                        </h2>

                        <p>
                            A professional learning platform
                            should adapt when your objective
                            changes. Dazy lets the same AI
                            tutor move between explanation,
                            testing, revision and interview
                            preparation.
                        </p>

                        <div className="platform-points">
                            <div>
                                <span>✓</span>

                                <p>
                                    <strong>
                                        Teach mode
                                    </strong>
                                    Step-by-step explanations
                                    with examples.
                                </p>
                            </div>

                            <div>
                                <span>✓</span>

                                <p>
                                    <strong>
                                        Quiz mode
                                    </strong>
                                    Active recall instead of
                                    passive reading.
                                </p>
                            </div>

                            <div>
                                <span>✓</span>

                                <p>
                                    <strong>
                                        Interview mode
                                    </strong>
                                    Practice technical questions
                                    conversationally.
                                </p>
                            </div>

                            <div>
                                <span>✓</span>

                                <p>
                                    <strong>
                                        Exam sprint
                                    </strong>
                                    Prioritize important concepts
                                    when time is limited.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mode-showcase">
                        <div className="showcase-top">
                            <span>
                                Learning modes
                            </span>

                            <span className="live-pill">
                                ● LIVE
                            </span>
                        </div>

                        {[
                            [
                                "Teach",
                                "Structured concept learning",
                            ],
                            [
                                "Quiz",
                                "Active recall practice",
                            ],
                            [
                                "Interview",
                                "Question-by-question prep",
                            ],
                            [
                                "Revision",
                                "Condensed key concepts",
                            ],
                            [
                                "Exam Sprint",
                                "High-priority preparation",
                            ],
                        ].map(
                            ([title, description], index) => (
                                <div
                                    className={`showcase-mode ${index === 0
                                            ? "showcase-active"
                                            : ""
                                        }`}
                                    key={title}
                                >
                                    <span>
                                        0{index + 1}
                                    </span>

                                    <div>
                                        <strong>
                                            {title}
                                        </strong>

                                        <small>
                                            {description}
                                        </small>
                                    </div>

                                    <b>→</b>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>

            <section
                className="how-section"
                id="how-it-works"
            >
                <div className="section-container">
                    <div className="center-heading">
                        <span className="section-tag">
                            HOW IT WORKS
                        </span>

                        <h2>
                            Start a focused learning session
                            in minutes.
                        </h2>
                    </div>

                    <div className="steps-grid">
                        {STEPS.map((step) => (
                            <article
                                className="step-card"
                                key={step.number}
                            >
                                <span>
                                    {step.number}
                                </span>

                                <h3>{step.title}</h3>

                                <p>{step.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {!profile && (
                <section
                    className="onboarding-section"
                    id="start"
                >
                    <div className="section-container onboarding-grid">
                        <div className="onboarding-copy">
                            <span className="section-tag">
                                GET STARTED
                            </span>

                            <h2>
                                Build your learning workspace.
                            </h2>

                            <p>
                                Dazy uses this information to
                                make explanations more relevant
                                to your current studies.
                            </p>

                            <div className="profile-preview">
                                <span className="profile-icon">
                                    ✦
                                </span>

                                <div>
                                    <strong>
                                        Personalized tutoring
                                    </strong>

                                    <p>
                                        Your degree, study stage
                                        and current subject become
                                        part of the tutoring
                                        context.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            className="onboarding-card"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-heading">
                                <span>
                                    NEW LEARNING PROFILE
                                </span>

                                <h3>
                                    Tell Dazy about your studies
                                </h3>
                            </div>

                            <label>
                                Name

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={updateField}
                                    placeholder="Enter your name"
                                />
                            </label>

                            <label>
                                Degree / Course

                                <input
                                    name="degree"
                                    value={form.degree}
                                    onChange={updateField}
                                    placeholder="e.g. B.Tech, B.Sc, B.Com, MBA"
                                />
                            </label>

                            <div className="form-row">
                                <label>
                                    Year / Stage

                                    <select
                                        name="year"
                                        value={form.year}
                                        onChange={updateField}
                                    >
                                        <option
                                            value=""
                                            disabled
                                        >
                                            Select your year
                                        </option>

                                        {YEARS.map((year) => (
                                            <option
                                                value={year}
                                                key={year}
                                            >
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Current subject

                                    <input
                                        name="subject"
                                        value={form.subject}
                                        onChange={updateField}
                                        placeholder="e.g. Data Structures"
                                    />
                                </label>
                            </div>

                            <label className="adult-check">
                                <input
                                    type="checkbox"
                                    name="adult_confirmed"
                                    checked={
                                        form.adult_confirmed
                                    }
                                    onChange={updateField}
                                />

                                <span>
                                    I confirm that I am 18 years
                                    of age or older.
                                </span>
                            </label>

                            {error && (
                                <div className="form-error">
                                    {error}
                                </div>
                            )}

                            <button
                                className="form-submit"
                                type="submit"
                            >
                                Launch my workspace

                                <span>→</span>
                            </button>

                            <small className="form-note">
                                Your profile is used to
                                personalize the tutoring
                                experience.
                            </small>
                        </form>
                    </div>
                </section>
            )}

            {profile && (
                <section className="return-section">
                    <div className="return-card">
                        <div>
                            <span>
                                YOUR WORKSPACE IS READY
                            </span>

                            <h2>
                                Continue where you left off.
                            </h2>

                            <p>
                                Your existing learning profile
                                and session are available.
                            </p>
                        </div>

                        <button
                            className="primary-large"
                            onClick={onContinue}
                        >
                            Open workspace →
                        </button>
                    </div>
                </section>
            )}
        </>
    );
}