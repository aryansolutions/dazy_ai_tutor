import {
    useEffect,
    useRef,
    useState,
} from "react";

export function useSpeechRecognition() {

    const recognitionRef =
        useRef(null);

    const [
        supported,
        setSupported
    ] = useState(true);

    const [
        isListening,
        setIsListening
    ] = useState(false);

    const [
        transcript,
        setTranscript
    ] = useState("");

    useEffect(() => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            setSupported(false);

            return;
        }

        const recognition =
            new SpeechRecognition();

        recognition.continuous =
            false;

        recognition.interimResults =
            true;

        recognition.lang =
            "en-IN";

        recognition.onstart =
            () => {

                setIsListening(
                    true
                );

            };

        recognition.onend =
            () => {

                setIsListening(
                    false
                );

            };

        recognition.onerror =
            (event) => {

                setIsListening(
                    false
                );

                if (
                    event.error ===
                    "not-allowed" ||
                    event.error ===
                    "service-not-allowed"
                ) {
                    setSupported(
                        false
                    );
                }

            };

        recognition.onresult =
            (event) => {

                let combined =
                    "";

                for (
                    let index =
                        event.resultIndex;

                    index <
                    event.results.length;

                    index += 1
                ) {

                    combined +=
                        event.results[
                            index
                        ][0].transcript;

                }

                setTranscript(
                    combined.trim()
                );

            };

        recognitionRef.current =
            recognition;

        return () => {

            try {
                recognition.stop();
            } catch {
                // already stopped
            }

        };

    }, []);

    function startListening() {

        if (
            !recognitionRef.current ||
            isListening
        ) {
            return;
        }

        try {

            recognitionRef.current
                .start();

        } catch {
            // prevents duplicate starts
        }

    }

    function stopListening() {

        try {

            recognitionRef.current
                ?.stop();

        } catch {
            // safe no-op
        }

    }

    function resetTranscript() {
        setTranscript("");
    }

    return {
        supported,
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
    };
}