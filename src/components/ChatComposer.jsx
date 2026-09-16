export default function ChatComposer({
    value,
    onChange,
    onSend,
    onVoice,
    isListening,
    speechSupported,
    isLoading,
}) {
    function handleKeyDown(event) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            onSend();
        }
    }

    return (
        <div className="composer-shell">
            <textarea
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask Dazy a question..."
                disabled={isLoading}
                rows={1}
            />

            <div className="composer-actions">
                <div className="composer-hint">
                    <span>
                        Enter to send
                    </span>

                    <span>
                        Shift + Enter for new line
                    </span>
                </div>

                <div className="composer-buttons">
                    {speechSupported && (
                        <button
                            className={`voice-button ${isListening
                                    ? "voice-active"
                                    : ""
                                }`}
                            type="button"
                            onClick={onVoice}
                            title="Voice input"
                        >
                            {isListening
                                ? "■"
                                : "◉"}
                        </button>
                    )}

                    <button
                        className="send-button"
                        onClick={onSend}
                        disabled={
                            isLoading ||
                            !value.trim()
                        }
                    >
                        {isLoading ? "…" : "↑"}
                    </button>
                </div>
            </div>
        </div>
    );
}