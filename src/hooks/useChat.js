import {
    useEffect,
    useState,
} from "react";

import {
    sendChatMessage,
} from "../services/api";

function uuid() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(/[xy]/g, (character) => {
            const random =
                (crypto.getRandomValues(
                    new Uint8Array(1)
                )[0] %
                    16);

            const value =
                character === "x"
                    ? random
                    : (random & 0x3) | 0x8;

            return value.toString(16);
        });
}

function getSessionId() {
    let sessionId =
        localStorage.getItem(
            "dazy_session_id"
        );

    if (!sessionId) {
        sessionId = uuid();

        localStorage.setItem(
            "dazy_session_id",
            sessionId
        );
    }

    return sessionId;
}

function loadMessages() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(
                "dazy_messages"
            )
        );

        if (Array.isArray(saved)) {
            return saved;
        }
    } catch {
        // Ignore invalid local data
    }

    return [];
}

export function useChat(profile) {
    const [messages, setMessages] =
        useState(loadMessages);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        localStorage.setItem(
            "dazy_messages",
            JSON.stringify(messages)
        );
    }, [messages]);

    async function sendMessage(
        text,
        studyMode = "Teach"
    ) {
        const cleanText = text.trim();

        if (!cleanText || isLoading) {
            return null;
        }

        const userMessage = {
            id: uuid(),
            role: "user",
            content: cleanText,
            createdAt: Date.now(),
        };

        setMessages((current) => [
            ...current,
            userMessage,
        ]);

        setError("");
        setIsLoading(true);

        try {
            const response =
                await sendChatMessage({
                    student_name:
                        profile.student_name,

                    course:
                        profile.course,

                    year:
                        profile.year,

                    subject:
                        profile.subject || "",

                    message:
                        `Study mode: ${studyMode}. ${cleanText}`,

                    session_id:
                        getSessionId(),

                    adult_confirmed: true,
                });

            const assistantMessage = {
                id: uuid(),
                role: "assistant",
                content:
                    response.response,

                emotion:
                    response.emotion ||
                    "explaining",

                createdAt: Date.now(),
            };

            setMessages((current) => [
                ...current,
                assistantMessage,
            ]);

            return response.response;
        } catch (requestError) {
            setError(
                requestError.message ||
                "Dazy could not respond."
            );

            return null;
        } finally {
            setIsLoading(false);
        }
    }

    function clearMessages() {
        localStorage.removeItem(
            "dazy_messages"
        );

        localStorage.removeItem(
            "dazy_session_id"
        );

        setMessages([]);
        setError("");
    }

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
    };
}