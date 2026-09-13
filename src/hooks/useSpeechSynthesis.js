import {
    useCallback,
    useEffect,
    useState,
} from "react";

export function useSpeechSynthesis() {
    const supported =
        typeof window !== "undefined" &&
        "speechSynthesis" in window;

    const [voices, setVoices] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (!supported) return;

        function loadVoices() {
            const availableVoices =
                window.speechSynthesis.getVoices();

            setVoices(availableVoices);

            console.log(
                "Available voices:",
                availableVoices.map((voice) => ({
                    name: voice.name,
                    lang: voice.lang,
                }))
            );
        }

        loadVoices();

        window.speechSynthesis.addEventListener(
            "voiceschanged",
            loadVoices
        );

        return () => {
            window.speechSynthesis.removeEventListener(
                "voiceschanged",
                loadVoices
            );

            window.speechSynthesis.cancel();
        };
    }, [supported]);

    function findDazyVoice() {
        if (!voices.length) return null;

        /*
          Prefer soft/natural feminine voices.
    
          Different browsers/operating systems expose
          different voice names, so we check several.
        */

        const preferredNames = [
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

        for (const preferred of preferredNames) {
            const voice = voices.find((voice) =>
                voice.name
                    .toLowerCase()
                    .includes(preferred.toLowerCase())
            );

            if (voice) {
                return voice;
            }
        }

        /*
          Second preference:
          English voices whose names often indicate
          a feminine voice.
        */

        const feminineEnglishVoice = voices.find(
            (voice) =>
                voice.lang
                    .toLowerCase()
                    .startsWith("en") &&
                /female|neerja|sonia|aria|samantha|victoria|karen|moira|tessa|veena/i.test(
                    voice.name
                )
        );

        if (feminineEnglishVoice) {
            return feminineEnglishVoice;
        }

        /*
          Third preference:
          any Indian-English voice.
        */

        const indianEnglish = voices.find(
            (voice) =>
                voice.lang.toLowerCase() === "en-in"
        );

        if (indianEnglish) {
            return indianEnglish;
        }

        /*
          Final fallback:
          any English voice.
        */

        return (
            voices.find((voice) =>
                voice.lang
                    .toLowerCase()
                    .startsWith("en")
            ) || voices[0]
        );
    }

    const speak = useCallback(
        (text) => {
            if (!supported || !text) return;

            window.speechSynthesis.cancel();

            const utterance =
                new SpeechSynthesisUtterance(text);

            const dazyVoice =
                findDazyVoice();

            if (dazyVoice) {
                utterance.voice = dazyVoice;
                utterance.lang = dazyVoice.lang;

                console.log(
                    "Dazy voice:",
                    dazyVoice.name
                );
            }

            /*
              Dazy personality:
              slightly slower,
              slightly higher,
              soft conversational delivery.
            */

            utterance.rate = 0.92;
            utterance.pitch = 1.18;
            utterance.volume = 1;

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = () => {
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(
                utterance
            );
        },
        [supported, voices]
    );

    const stopSpeaking =
        useCallback(() => {
            if (!supported) return;

            window.speechSynthesis.cancel();

            setIsSpeaking(false);
        }, [supported]);

    return {
        supported,
        speak,
        stopSpeaking,
        isSpeaking,
    };
}