export default function MessageBubble({
    message,
}) {
    const assistant =
        message.role ===
        "assistant";

    return (
        <div
            className={`message-row ${assistant
                    ? "assistant-message"
                    : "user-message"
                }`}
        >

            {assistant && (

                <div className="message-avatar">
                    D
                </div>

            )}

            <div className="message-container">

                <div className="message-author">

                    {assistant
                        ? "Dazy"
                        : "You"}

                </div>

                <div className="message-bubble">

                    {message.content}

                </div>

            </div>

        </div>
    );
}