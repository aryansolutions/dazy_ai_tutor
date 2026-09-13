import {
    useCallback,
    useRef,
    useState,
} from "react";

import {
    sendChatMessage
} from "../services/api";

const MESSAGE_KEY =
    "dazy_messages";

const SESSION_KEY =
    "dazy_session_id";

function createId() {
    return (
        globalThis.crypto
            ?.randomUUID?.() ||
        `${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`
    );
}

function loadOrCreateSession() {

    const existing =
        localStorage.getItem(
            SESSION_KEY
        );

    if (existing) {
        return existing;
    }

    const session =
        createId();

    localStorage.setItem(
        SESSION_KEY,
        session
    );

    return session;
}

function loadMessages(
    name,
    subject
) {
    try {

        const stored =
            JSON.parse(
                localStorage.getItem(
                    MESSAGE_KEY
                )
            );

        if (
            Array.isArray(
                stored
            ) &&
            stored.length
        ) {
            return stored;
        }

    } catch {
        // Invalid local cache.
    }

    const subjectLine =
        subject
            ? ` I can help you with ${subject} or anything else you're studying.`
            : "";

    return [
        {
            id: createId(),

            role:
                "assistant",

            content:
                `Hi ${name}! I'm Dazy. 🎓${subjectLine} What do you want to understand today?`,
        },
    ];
}

export function useChat(
    profile
) {
    const sessionRef =
        useRef(
            loadOrCreateSession()
        );

    const [
        messages,
        setMessages
    ] = useState(() =>
        loadMessages(
            profile.name,
            profile.subject
        )
    );

    const [
        isThinking,
        setIsThinking
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    function persist(
        nextMessages
    ) {
        localStorage.setItem(
            MESSAGE_KEY,

            JSON.stringify(
                nextMessages.slice(
                    -50
                )
            )
        );
    }

    const sendMessage =
        useCallback(
            async (text) => {

                const clean =
                    text.trim();

                if (
                    !clean ||
                    isThinking
                ) {
                    return;
                }

                setError("");

                const userMessage = {
                    id: createId(),

                    role: "user",

                    content: clean,
                };

                setMessages(
                    (current) => {

                        const next = [
                            ...current,
                            userMessage,
                        ];

                        persist(next);

                        return next;
                    }
                );

                setIsThinking(true);

                try {

                    const result =
                        await sendChatMessage({
                            student_name:
                                profile.name,

                            course:
                                profile.course,

                            year:
                                profile.year,

                            subject:
                                profile.subject ||
                                "",

                            message:
                                clean,

                            session_id:
                                sessionRef.current,

                            adult_confirmed:
                                true,
                        });

                    const assistantMessage = {
                        id:
                            createId(),

                        role:
                            "assistant",

                        content:
                            result.response,

                        emotion:
                            result.emotion ||
                            "explaining",
                    };

                    setMessages(
                        (current) => {

                            const next = [
                                ...current,
                                assistantMessage,
                            ];

                            persist(next);

                            return next;
                        }
                    );

                    return assistantMessage;

                } catch (err) {

                    setError(
                        err.message ||
                        "Dazy couldn't respond right now. Please try again."
                    );

                } finally {

                    setIsThinking(
                        false
                    );

                }

            },
            [
                profile,
                isThinking,
            ]
        );

    const clearConversation =
        useCallback(() => {

            const nextSession =
                createId();

            sessionRef.current =
                nextSession;

            localStorage.setItem(
                SESSION_KEY,
                nextSession
            );

            const next = [
                {
                    id:
                        createId(),

                    role:
                        "assistant",

                    content:
                        `Fresh start, ${profile.name}! What should we study now? ✨`,
                },
            ];

            localStorage.setItem(
                MESSAGE_KEY,
                JSON.stringify(next)
            );

            setMessages(next);

            setError("");

        }, [profile.name]);

    return {
        messages,
        sendMessage,
        clearConversation,
        isThinking,
        error,
    };
}