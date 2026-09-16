import {
    useEffect,
    useState,
} from "react";

import DazyAvatar from "../components/DazyAvatar";
import ChatWindow from "../components/ChatWindow";
import ChatComposer from "../components/ChatComposer";

import {
    useChat,
} from "../hooks/useChat";

import {
    useSpeechRecognition,
} from "../hooks/useSpeechRecognition";

import {
    useSpeechSynthesis,
} from "../hooks/useSpeechSynthesis";

const STUDY_MODES = [
    {
        name: "Teach",
        icon: "01",
        description:
            "Understand concepts clearly",
    },
    {
        name: "Quiz",
        icon: "02",
        description:
            "Test your knowledge",
    },
    {
        name: "Interview",
        icon: "03",
        description:
            "Practice questions",
    },
    {
        name: "Revision",
        icon: "04",
        description:
            "Review key ideas",
    },
    {
        name: "Exam Sprint",
        icon: "05",
        description:
            "Focus on high-priority topics",
    },
];

const MODE_PROMPTS = {
    Teach: [
        "Explain this topic from the basics",
        "Give me a practical example",
        "Explain this like I am learning it for the first time",
    ],

    Quiz: [
        "Quiz me with 5 questions",
        "Ask me one question at a time",
        "Give me a difficult practice question",
    ],

    Interview: [
        "Start a mock interview",
        "Ask me technical interview questions",
        "Evaluate my answer like an interviewer",
    ],

    Revision: [
        "Give me quick revision notes",
        "Summarize the most important points",
        "Create a last-minute revision checklist",
    ],

    "Exam Sprint": [
        "What should I study first?",
        "Give me the highest-priority concepts",
        "Make a short exam preparation plan",
    ],
};

function formatTime(seconds) {
    const minutes = Math.floor(
        seconds / 60
    );

    const remaining =
        seconds % 60;

    return `${String(minutes).padStart(
        2,
        "0"
    )}:${String(remaining).padStart(
        2,
        "0"
    )}`;
}

export default function Tutor({
    profile,
    onResetProfile,
}) {
    const [studyMode, setStudyMode] =
        useState("Teach");

    const [draft, setDraft] =
        useState("");

    const [autoSpeak, setAutoSpeak] =
        useState(true);

    const [timerSeconds, setTimerSeconds] =
        useState(25 * 60);

    const [timerRunning, setTimerRunning] =
        useState(false);

    const {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
    } = useChat(profile);

    const {
        speak,
        cancel,
        speaking,
    } = useSpeechSynthesis();

    const {
        supported,
        isListening,
        startListening,
        stopListening,
    } = useSpeechRecognition(
        (text) => setDraft(text)
    );

    useEffect(() => {
        if (!timerRunning) {
            return;
        }

        const interval =
            setInterval(() => {
                setTimerSeconds(
                    (current) => {
                        if (current <= 1) {
                            clearInterval(
                                interval
                            );

                            setTimerRunning(
                                false
                            );

                            return 0;
                        }

                        return current - 1;
                    }
                );
            }, 1000);

        return () =>
            clearInterval(interval);
    }, [timerRunning]);

    async function handleSend(
        customText
    ) {
        const text =
            (
                customText ??
                draft
            ).trim();

        if (!text) {
            return;
        }

        setDraft("");

        if (speaking) {
            cancel();
        }

        const response =
            await sendMessage(
                text,
                studyMode
            );

        if (
            response &&
            autoSpeak
        ) {
            speak(response);
        }
    }

    function toggleVoice() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    function resetTimer() {
        setTimerRunning(false);
        setTimerSeconds(25 * 60);
    }

    let avatarState = "idle";

    if (isListening) {
        avatarState = "listening";
    } else if (isLoading) {
        avatarState = "thinking";
    } else if (speaking) {
        avatarState = "speaking";
    }

    return (
        <section className="workspace-page">
            <div className="workspace-topbar">
                <div>
                    <span className="workspace-label">
                        LEARNING WORKSPACE
                    </span>

                    <h1>
                        {profile.subject
                            ? profile.subject
                            : "Study session"}
                    </h1>
                </div>

                <div className="workspace-top-actions">
                    <div className="workspace-course">
                        <span>
                            {profile.course}
                        </span>

                        <small>
                            {profile.year}
                        </small>
                    </div>

                    <button
                        className="outline-danger"
                        onClick={onResetProfile}
                    >
                        Change profile
                    </button>
                </div>
            </div>

            <div className="workspace-layout">
                <aside className="study-sidebar">
                    <div className="sidebar-section">
                        <span className="sidebar-title">
                            STUDY MODE
                        </span>

                        <div className="study-mode-list">
                            {STUDY_MODES.map(
                                (mode) => (
                                    <button
                                        key={mode.name}
                                        className={`study-mode-button ${studyMode ===
                                                mode.name
                                                ? "mode-selected"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            setStudyMode(
                                                mode.name
                                            )
                                        }
                                    >
                                        <span className="mode-index">
                                            {mode.icon}
                                        </span>

                                        <div>
                                            <strong>
                                                {mode.name}
                                            </strong>

                                            <small>
                                                {
                                                    mode.description
                                                }
                                            </small>
                                        </div>
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div className="focus-card">
                        <div className="focus-heading">
                            <div>
                                <span>
                                    FOCUS TIMER
                                </span>

                                <strong>
                                    Deep work
                                </strong>
                            </div>

                            <div className="timer-dot" />
                        </div>

                        <div className="focus-time">
                            {formatTime(
                                timerSeconds
                            )}
                        </div>

                        <div className="timer-track">
                            <div
                                style={{
                                    width: `${(timerSeconds /
                                            (25 * 60)) *
                                        100
                                        }%`,
                                }}
                            />
                        </div>

                        <div className="focus-actions">
                            <button
                                onClick={() =>
                                    setTimerRunning(
                                        (current) =>
                                            !current
                                    )
                                }
                            >
                                {timerRunning
                                    ? "Pause"
                                    : "Start"}
                            </button>

                            <button
                                onClick={resetTimer}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="session-card">
                        <span className="sidebar-title">
                            SESSION
                        </span>

                        <div>
                            <span>
                                Messages
                            </span>

                            <strong>
                                {messages.length}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Mode
                            </span>

                            <strong>
                                {studyMode}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Voice
                            </span>

                            <strong>
                                {supported
                                    ? "Ready"
                                    : "Unavailable"}
                            </strong>
                        </div>

                        <button
                            onClick={clearMessages}
                        >
                            Clear conversation
                        </button>
                    </div>
                </aside>

                <main className="tutor-panel">
                    <div className="tutor-header">
                        <div className="tutor-identity">
                            <div className="mini-dazy">
                                <DazyAvatar
                                    state={avatarState}
                                    size="small"
                                />
                            </div>

                            <div>
                                <div className="assistant-name-row">
                                    <h2>Dazy</h2>

                                    <span className="verified-badge">
                                        AI
                                    </span>
                                </div>

                                <p>
                                    {isListening
                                        ? "Listening to you..."
                                        : isLoading
                                            ? "Thinking..."
                                            : speaking
                                                ? "Speaking..."
                                                : `${studyMode} mode • Ready`}
                                </p>
                            </div>
                        </div>

                        <div className="tutor-controls">
                            <label className="speak-toggle">
                                <input
                                    type="checkbox"
                                    checked={autoSpeak}
                                    onChange={(event) =>
                                        setAutoSpeak(
                                            event.target
                                                .checked
                                        )
                                    }
                                />

                                <span />
                                Voice replies
                            </label>
                        </div>
                    </div>

                    <div className="active-mode-banner">
                        <div>
                            <span>
                                ACTIVE MODE
                            </span>

                            <strong>
                                {studyMode}
                            </strong>
                        </div>

                        <p>
                            {
                                STUDY_MODES.find(
                                    (mode) =>
                                        mode.name ===
                                        studyMode
                                )?.description
                            }
                        </p>
                    </div>

                    <ChatWindow
                        messages={messages}
                        isLoading={isLoading}
                    />

                    {error && (
                        <div className="chat-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    <div className="quick-prompts">
                        {MODE_PROMPTS[
                            studyMode
                        ].map((prompt) => (
                            <button
                                key={prompt}
                                onClick={() =>
                                    handleSend(prompt)
                                }
                                disabled={isLoading}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <ChatComposer
                        value={draft}
                        onChange={setDraft}
                        onSend={() =>
                            handleSend()
                        }
                        onVoice={toggleVoice}
                        isListening={
                            isListening
                        }
                        speechSupported={
                            supported
                        }
                        isLoading={isLoading}
                    />

                    <div className="ai-disclaimer">
                        Dazy can make mistakes. Verify
                        important academic, medical,
                        legal or financial information
                        independently.
                    </div>
                </main>

                <aside className="context-sidebar">
                    <div className="context-card">
                        <span className="sidebar-title">
                            LEARNING PROFILE
                        </span>

                        <div className="profile-avatar">
                            {profile.student_name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <h3>
                            {profile.student_name}
                        </h3>

                        <p>
                            {profile.course}
                        </p>

                        <div className="context-details">
                            <div>
                                <span>
                                    Stage
                                </span>

                                <strong>
                                    {profile.year}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Subject
                                </span>

                                <strong>
                                    {profile.subject ||
                                        "General"}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="learning-status-card">
                        <span className="sidebar-title">
                            SESSION STATUS
                        </span>

                        <div className="status-ring">
                            <div>
                                <strong>
                                    {messages.length}
                                </strong>

                                <span>
                                    messages
                                </span>
                            </div>
                        </div>

                        <p>
                            Continue asking follow-up
                            questions. Dazy keeps recent
                            context during your session.
                        </p>
                    </div>

                    <div className="tips-card">
                        <span className="sidebar-title">
                            BETTER QUESTIONS
                        </span>

                        <p>
                            Try adding context like:
                        </p>

                        <span>
                            “Explain with an example”
                        </span>

                        <span>
                            “Compare these two concepts”
                        </span>

                        <span>
                            “Ask me questions afterward”
                        </span>
                    </div>
                </aside>
            </div>
        </section>
    );
}