import {
    useEffect,
    useRef
} from "react";

import MessageBubble
    from "./MessageBubble";

export default function ChatWindow({
    messages,
    isThinking,
}) {
    const bottomRef =
        useRef(null);

    useEffect(() => {

        bottomRef.current
            ?.scrollIntoView({
                behavior:
                    "smooth",
            });

    }, [
        messages,
        isThinking,
    ]);

    return (
        <div className="chat-window">

            {messages.map(
                (message) => (

                    <MessageBubble
                        key={
                            message.id
                        }
                        message={
                            message
                        }
                    />

                )
            )}

            {isThinking && (

                <div className="message-row assistant-message">

                    <div className="message-avatar">
                        D
                    </div>

                    <div className="message-container">

                        <div className="message-author">
                            Dazy
                        </div>

                        <div className="message-bubble typing">

                            <span />

                            <span />

                            <span />

                        </div>

                    </div>

                </div>

            )}

            <div ref={bottomRef} />

        </div>
    );
}