export default function MessageBubble({
    message,
}) {
    const isUser =
        message.role === "user";

    return (
        <div
            className={
                isUser
                    ? "message-row user-row"
                    : "message-row assistant-row"
            }
        >
            {!isUser && (
                <div className="message-avatar">
                    D
                </div>
            )}

            <div
                className={
                    isUser
                        ? "message-bubble user-message"
                        : "message-bubble assistant-message"
                }
            >
                {!isUser && (
                    <div className="message-meta">
                        <strong>Dazy</strong>

                        <span>
                            AI Tutor
                        </span>
                    </div>
                )}

                <div className="message-content">
                    {message.content}
                </div>

                <div className="message-time">
                    {new Date(
                        message.createdAt ||
                        Date.now()
                    ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            </div>
        </div>
    );
}