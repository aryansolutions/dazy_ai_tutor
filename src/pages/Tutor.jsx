import {
    useEffect,
    useRef,
    useState,
} from "react";

import Header from "../components/Header";
import DazyAvatar from "../components/DazyAvatar";
import ChatWindow from "../components/ChatWindow";
import ChatComposer from "../components/ChatComposer";
import QuickPrompts from "../components/QuickPrompts";

import {
    useChat
} from "../Hooks/useChat";

import {
    useSpeechRecognition
} from "../hooks/useSpeechRecognition";

import {
    useSpeechSynthesis
} from "../hooks/useSpeechSynthesis";

export default function Tutor({
    profile,
    onResetProfile,
}) {
    const [draft, setDraft] =
        useState("");

    const [
        autoSpeak,
        setAutoSpeak
    ] = useState(true);

    const lastSpokenId =
        useRef(null);

    const {
        messages,
        sendMessage,
        clearConversation,
        isThinking,
        error,
    } = useChat(profile);

    const {
        speak,
        stopSpeaking,
        isSpeaking,
        supported: speechSupported,
    } = useSpeechSynthesis();

    const {
        supported:
        microphoneSupported,

        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition();

    useEffect(() => {

        if (transcript) {
            setDraft(transcript);
        }

    }, [transcript]);

    useEffect(() => {

        if (!autoSpeak) {
            return;
        }

        if (!speechSupported) {
            return;
        }

        if (isThinking) {
            return;
        }

        const latest =
            messages[
            messages.length - 1
            ];

        if (!latest) {
            return;
        }

        if (
            latest.role !==
            "assistant"
        ) {
            return;
        }

        if (
            lastSpokenId.current ===
            latest.id
        ) {
            return;
        }

        lastSpokenId.current =
            latest.id;

        speak(
            latest.content
        );

    }, [
        messages,
        autoSpeak,
        speechSupported,
        isThinking,
        speak,
    ]);

    let avatarState =
        "idle";

    if (isListening) {
        avatarState =
            "listening";
    } else if (isThinking) {
        avatarState =
            "thinking";
    } else if (isSpeaking) {
        avatarState =
            "speaking";
    }

    async function handleSend(
        customMessage = null
    ) {
        const message =
            (
                customMessage ??
                draft
            ).trim();

        if (!message) {
            return;
        }

        if (isThinking) {
            return;
        }

        stopSpeaking();

        stopListening();

        resetTranscript();

        setDraft("");

        await sendMessage(
            message
        );
    }

    function handleMicrophone() {

        if (
            !microphoneSupported ||
            isThinking
        ) {
            return;
        }

        if (isListening) {

            stopListening();

            return;
        }

        stopSpeaking();

        resetTranscript();

        setDraft("");

        startListening();
    }

    function handleNewConversation() {

        stopSpeaking();

        stopListening();

        clearConversation();
    }

    return (
        <main className="tutor-page">

            <div className="blob tutor-blob-one" />
            <div className="blob tutor-blob-two" />

            <Header
                profile={profile}
                autoSpeak={autoSpeak}
                setAutoSpeak={setAutoSpeak}
                onClear={
                    handleNewConversation
                }
                onResetProfile={
                    onResetProfile
                }
            />

            <section className="tutor-layout">

                <aside className="dazy-side">

                    <div className="side-intro">

                        <span className="eyebrow">
                            YOUR AI STUDY PARTNER
                        </span>

                        <h2>
                            Hi, {profile.name}!
                        </h2>

                        <p>
                            {profile.course}

                            {profile.subject
                                ? ` · ${profile.subject}`
                                : ""}
                        </p>

                    </div>

                    <div className="large-avatar-container">

                        <DazyAvatar
                            state={avatarState}
                            size="large"
                        />

                    </div>

                    <div
                        className={`dazy-status ${avatarState}`}
                    >

                        <span />

                        {avatarState ===
                            "idle" &&
                            "Ready when you are"}

                        {avatarState ===
                            "listening" &&
                            "I'm listening..."}

                        {avatarState ===
                            "thinking" &&
                            "Working it out..."}

                        {avatarState ===
                            "speaking" &&
                            "Explaining..."}

                    </div>

                    <div className="suggestion-card">

                        <span>💡</span>

                        <p>
                            Try:{" "}

                            <strong>
                                “Explain this like I
                                have an exam tomorrow.”
                            </strong>
                        </p>

                    </div>

                </aside>

                <section className="chat-card">

                    <header className="chat-header">

                        <div>

                            <span className="eyebrow">
                                DAZY TUTOR
                            </span>

                            <h3>
                                What do you want to
                                understand today?
                            </h3>

                        </div>

                        <div className="online-badge">

                            <span />

                            AI ready

                        </div>

                    </header>

                    <ChatWindow
                        messages={messages}
                        isThinking={
                            isThinking
                        }
                    />

                    {messages.length <=
                        1 && (

                            <QuickPrompts
                                onSelect={
                                    handleSend
                                }
                            />

                        )}

                    {error && (

                        <div className="chat-error">
                            {error}
                        </div>

                    )}

                    <ChatComposer
                        value={draft}
                        onChange={
                            setDraft
                        }
                        onSend={() =>
                            handleSend()
                        }
                        onMicrophone={
                            handleMicrophone
                        }
                        isListening={
                            isListening
                        }
                        isThinking={
                            isThinking
                        }
                        microphoneSupported={
                            microphoneSupported
                        }
                    />

                    {!microphoneSupported && (

                        <p className="voice-warning">

                            Voice input is unavailable
                            in this browser. Typing
                            still works; use Chrome or
                            Edge for microphone input.

                        </p>

                    )}

                </section>

            </section>

        </main>
    );
}