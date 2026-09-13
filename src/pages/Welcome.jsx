import { useState } from "react";

import DazyAvatar from "../components/DazyAvatar";

const years = [
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
    onStart,
}) {
    const [form, setForm] =
        useState({
            name: "",
            course: "",
            year: "1st Year",
            subject: "",
            adult_confirmed: false,
        });

    const [error, setError] =
        useState("");

    function updateField(
        field,
        value
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setError("");
    }

    function handleSubmit(event) {
        event.preventDefault();

        const name =
            form.name.trim();

        const course =
            form.course.trim();

        const subject =
            form.subject.trim();

        if (name.length < 2) {
            setError(
                "Tell Dazy your name first."
            );

            return;
        }

        if (course.length < 2) {
            setError(
                "Add your degree, course, or learning program."
            );

            return;
        }

        if (!form.adult_confirmed) {
            setError(
                "Dazy is currently available only for users aged 18 or older."
            );

            return;
        }

        onStart({
            name,
            course,
            year: form.year,
            subject,
            adult_confirmed: true,
        });
    }

    return (
        <main className="welcome-page">

            <div className="blob blob-one" />
            <div className="blob blob-two" />

            <section className="welcome-card">

                <div className="brand-pill">

                    <div className="brand-dot" />

                    DAZY

                </div>

                <div className="welcome-grid">

                    <section className="welcome-copy">

                        <span className="eyebrow">
                            AI VOICE TUTOR · 18+
                        </span>

                        <h1>
                            Learn smarter.

                            <span>
                                {" "}
                                Talk it through with Dazy.
                            </span>
                        </h1>

                        <p className="hero-description">

                            A voice-first AI tutor for
                            college students and adult
                            learners. Ask questions,
                            revise concepts, prepare for
                            exams, practise interviews,
                            or learn difficult topics
                            conversationally.

                        </p>

                        <form
                            className="welcome-form"
                            onSubmit={handleSubmit}
                        >

                            <label>

                                Your name

                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        updateField(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Name"
                                    maxLength={40}
                                    autoComplete="given-name"
                                    autoFocus
                                />

                            </label>

                            <label>

                                Year / stage

                                <select
                                    value={form.year}
                                    onChange={(e) =>
                                        updateField(
                                            "year",
                                            e.target.value
                                        )
                                    }
                                >

                                    {years.map((year) => (

                                        <option
                                            key={year}
                                            value={year}
                                        >
                                            {year}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            <label className="full-field">

                                Degree / course

                                <input
                                    value={form.course}
                                    onChange={(e) =>
                                        updateField(
                                            "course",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Degree & Branch"
                                    maxLength={100}
                                />

                            </label>

                            <label className="full-field">

                                Current subject or goal

                                <input
                                    value={form.subject}
                                    onChange={(e) =>
                                        updateField(
                                            "subject",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. SQL, React, Machine Learning, Interview Prep"
                                    maxLength={100}
                                />

                            </label>

                            <label className="adult-check full-field">

                                <input
                                    type="checkbox"
                                    checked={
                                        form.adult_confirmed
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "adult_confirmed",
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    I confirm that I am{" "}
                                    <strong>
                                        18 years or older
                                    </strong>.
                                </span>

                            </label>

                            {error && (

                                <div className="form-error full-field">
                                    {error}
                                </div>

                            )}

                            <button
                                className="start-button"
                                type="submit"
                            >

                                <span>
                                    Start learning with Dazy
                                </span>

                                <span>→</span>

                            </button>

                        </form>

                    </section>

                    <section className="welcome-visual">

                        <div className="avatar-stage">

                            <DazyAvatar
                                state="idle"
                                size="large"
                            />

                            <div className="floating-card card-one">
                                🎤 Ask naturally
                            </div>

                            <div className="floating-card card-two">
                                🧠 Explain deeply
                            </div>

                            <div className="floating-card card-three">
                                ✨ Revise faster
                            </div>

                        </div>

                        <div className="feature-row">

                            <div className="feature-mini">

                                <span>🎓</span>

                                <div>

                                    <strong>
                                        College-aware
                                    </strong>

                                    <p>
                                        Uses your course and
                                        subject context.
                                    </p>

                                </div>

                            </div>

                            <div className="feature-mini">

                                <span>🎤</span>

                                <div>

                                    <strong>
                                        Voice-first
                                    </strong>

                                    <p>
                                        Speak questions instead
                                        of typing.
                                    </p>

                                </div>

                            </div>

                            <div className="feature-mini">

                                <span>💬</span>

                                <div>

                                    <strong>
                                        Conversational
                                    </strong>

                                    <p>
                                        Follow-ups stay in
                                        context.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>

            </section>

            <p className="browser-note">

                Dazy is for users 18+.
                Voice input works best in
                Chrome or Edge.

            </p>

        </main>
    );
}