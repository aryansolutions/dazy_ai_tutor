export default function ChatComposer({
    value,
    onChange,
    onSend,
    onMicrophone,
    isListening,
    isThinking,
    microphoneSupported,
}) {
    function handleKeyDown(
        event
    ) {
        if (
            event.key ===
            "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            onSend();
        }
    }

    return (
        <div
            className={`composer ${isListening
                    ? "composer-listening"
                    : ""
                }`}
        >

            <button
                className={`microphone-button ${isListening
                        ? "active"
                        : ""
                    }`}
                onClick={
                    onMicrophone
                }
                disabled={
                    !microphoneSupported ||
                    isThinking
                }
                type="button"
                aria-label={
                    isListening
                        ? "Stop listening"
                        : "Start microphone"
                }
            >

                {isListening ? (

                    <span className="stop-icon" />

                ) : (

                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >

                        <path d="M12 14.25a4.25 4.25 0 0 0 4.25-4.25V5.25a4.25 4.25 0 0 0-8.5 0V10A4.25 4.25 0 0 0 12 14.25Z" />

                        <path d="M5.75 10a6.25 6.25 0 0 0 12.5 0M12 16.25V21M9 21h6" />

                    </svg>

                )}

            </button>

            <textarea
                value={value}
                placeholder={
                    isListening
                        ? "Listening..."
                        : "Ask Dazy anything..."
                }
                disabled={
                    isThinking
                }
                maxLength={1500}
                rows={1}
                onChange={(e) =>
                    onChange(
                        e.target.value
                    )
                }
                onKeyDown={
                    handleKeyDown
                }
            />

            <button
                className="send-button"
                disabled={
                    !value.trim() ||
                    isThinking
                }
                onClick={
                    onSend
                }
                type="button"
                aria-label="Send message"
            >

                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >

                    <path d="m5 12 14-7-4.2 14-3.1-5.7L5 12Z" />

                    <path d="m11.7 13.3 3.8-3.8" />

                </svg>

            </button>

        </div>
    );
}