import {
    useCallback,
    useEffect,
    useState,
} from "react";

export function useSpeechSynthesis() {

    const supported =
        typeof window !==
        "undefined" &&
        "speechSynthesis" in
        window;

    const [
        voices,
        setVoices
    ] = useState([]);

    const [
        isSpeaking,
        setIsSpeaking
    ] = useState(false);

    useEffect(() => {

        if (!supported) {
            return;
        }

        function loadVoices() {

            setVoices(
                window
                    .speechSynthesis
                    .getVoices()
            );

        }

        loadVoices();

        window
            .speechSynthesis
            .addEventListener(
                "voiceschanged",
                loadVoices
            );

        return () => {

            window
                .speechSynthesis
                .removeEventListener(
                    "voiceschanged",
                    loadVoices
                );

            window
                .speechSynthesis
                .cancel();

        };

    }, [supported]);

    const speak =
        useCallback(
            (text) => {

                if (
                    !supported ||
                    !text
                ) {
                    return;
                }

                window
                    .speechSynthesis
                    .cancel();

                const utterance =
                    new SpeechSynthesisUtterance(
                        text
                    );

                const preferredVoice =
                    voices.find(
                        (voice) =>
                            /en-IN/i.test(
                                voice.lang
                            )
                    ) ||

                    voices.find(
                        (voice) =>
                            /en-GB/i.test(
                                voice.lang
                            )
                    ) ||

                    voices.find(
                        (voice) =>
                            /en-US/i.test(
                                voice.lang
                            )
                    );

                if (
                    preferredVoice
                ) {
                    utterance.voice =
                        preferredVoice;
                }

                utterance.rate =
                    0.96;

                utterance.pitch =
                    1.04;

                utterance.volume =
                    1;

                utterance.onstart =
                    () => {

                        setIsSpeaking(
                            true
                        );

                    };

                utterance.onend =
                    () => {

                        setIsSpeaking(
                            false
                        );

                    };

                utterance.onerror =
                    () => {

                        setIsSpeaking(
                            false
                        );

                    };

                window
                    .speechSynthesis
                    .speak(
                        utterance
                    );

            },
            [
                supported,
                voices,
            ]
        );

    const stopSpeaking =
        useCallback(() => {

            if (!supported) {
                return;
            }

            window
                .speechSynthesis
                .cancel();

            setIsSpeaking(false);

        }, [supported]);

    return {
        supported,
        speak,
        stopSpeaking,
        isSpeaking,
    };
}