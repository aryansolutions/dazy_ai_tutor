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
        };
    }, []);

    function selectVoice() {
        for (
            const preferredName
            of PREFERRED_VOICES
        ) {
            const found = voices.find(
                (voice) =>
                    voice.name
                        .toLowerCase()
                        .includes(
                            preferredName.toLowerCase()
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
                    voice.lang?.startsWith("en")
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

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(
                text
            );

        utterance.voice = selectVoice();
        utterance.rate = 0.93;
        utterance.pitch = 1.12;
        utterance.volume = 1;

        utterance.onstart = () =>
            setSpeaking(true);

        utterance.onend = () =>
            setSpeaking(false);

        utterance.onerror = () =>
            setSpeaking(false);

        window.speechSynthesis.speak(
            utterance
        );
    }

    function cancel() {
        window.speechSynthesis?.cancel();
        setSpeaking(false);
    }

    return {
        speak,
        cancel,
        speaking,
    };
}