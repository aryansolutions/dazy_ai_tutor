import {
    useEffect,
    useState,
} from "react";

const PREFERRED_VOICES = [
    "Microsoft Neerja",
    "Microsoft Sonia",
    "Microsoft Aria",
    "Google UK English Female",
    "Google US English Female",
    "Samantha",
    "Victoria",
    "Karen",
    "Moira",
    "Tessa",
    "Veena",
];

function cleanTextForSpeech(text) {
    if (!text) {
        return "";
    }

    return text
        // Code fences
        .replace(/```[\s\S]*?```/g, (code) =>
            code
                .replace(/```[\w-]*\n?/g, "")
                .replace(/```/g, "")
        )

        // Inline code
        .replace(/`([^`]+)`/g, "$1")

        // Markdown headings
        .replace(/^#{1,6}\s+/gm, "")

        // Bold / italic
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/_(.*?)_/g, "$1")

        // Markdown links
        .replace(
            /\[([^\]]+)\]\([^)]+\)/g,
            "$1"
        )

        // URLs
        .replace(
            /https?:\/\/\S+/g,
            ""
        )

        // Bullet symbols
        .replace(
            /^[\s]*[-*+]\s+/gm,
            ""
        )

        // Numbered-list punctuation
        .replace(
            /^\s*(\d+)\.\s+/gm,
            "$1. "
        )

        // Blockquote symbol
        .replace(/^>\s?/gm, "")

        // Markdown separators
        .replace(
            /^[-*_]{3,}$/gm,
            ""
        )

        // Extra symbols that sound bad
        .replace(/[•◆✦]/g, "")

        // Excess whitespace
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
}


export function useSpeechSynthesis() {

    const [speaking, setSpeaking] =
        useState(false);

    const [voices, setVoices] =
        useState([]);

    useEffect(() => {

        function loadVoices() {
            setVoices(
                window.speechSynthesis
                    ?.getVoices() || []
            );
        }

        loadVoices();

        window.speechSynthesis
            ?.addEventListener(
                "voiceschanged",
                loadVoices
            );

        return () => {

            window.speechSynthesis
                ?.removeEventListener(
                    "voiceschanged",
                    loadVoices
                );

            window.speechSynthesis
                ?.cancel();
        };

    }, []);


    function selectVoice() {

        for (
            const preferred
            of PREFERRED_VOICES
        ) {

            const found =
                voices.find(
                    (voice) =>
                        voice.name
                            .toLowerCase()
                            .includes(
                                preferred
                                    .toLowerCase()
                            )
                );

            if (found) {
                return found;
            }
        }

        return (
            voices.find(
                (voice) =>
                    voice.lang === "en-IN"
            ) ||

            voices.find(
                (voice) =>
                    voice.lang
                        ?.startsWith("en")
            ) ||

            voices[0]
        );
    }


    function speak(text) {

        if (
            !window.speechSynthesis ||
            !text
        ) {
            return;
        }

        // Always stop previous speech first
        window.speechSynthesis.cancel();

        const cleanedText =
            cleanTextForSpeech(text);

        if (!cleanedText) {
            return;
        }

        const utterance =
            new SpeechSynthesisUtterance(
                cleanedText
            );

        utterance.voice =
            selectVoice();

        utterance.rate = 0.94;
        utterance.pitch = 1.08;
        utterance.volume = 1;

        utterance.onstart = () => {
            setSpeaking(true);
        };

        utterance.onend = () => {
            setSpeaking(false);
        };

        utterance.onerror = () => {
            setSpeaking(false);
        };

        window.speechSynthesis.speak(
            utterance
        );
    }


    function cancel() {

        if (
            window.speechSynthesis
        ) {
            window.speechSynthesis.cancel();
        }

        setSpeaking(false);
    }


    return {
        speak,
        cancel,
        speaking,
    };
}