import ReactMarkdown
    from "react-markdown";


export default function MessageBubble({
    message,
}) {

    const isUser =
        message.role === "user";


    function formatTime(
        timestamp
    ) {

        return new Date(
            timestamp ||
            Date.now()
        ).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    }


    return (

        <div
            className={
                isUser
                    ? "message-row user-row"
                    : "message-row assistant-row"
            }
        >

            {/* ================================
          DAZY AVATAR
      ================================= */}

            {
                !isUser && (

                    <div className="message-avatar">
                        D
                    </div>

                )
            }


            {/* ================================
          MESSAGE
      ================================= */}

            <div
                className={
                    isUser
                        ? "message-bubble user-message"
                        : "message-bubble assistant-message"
                }
            >

                {
                    !isUser && (

                        <div className="message-meta">

                            <strong>
                                Dazy
                            </strong>

                            <span>
                                AI Tutor
                            </span>

                        </div>

                    )
                }


                <div className="message-content">

                    {
                        isUser
                            ? (
                                message.content
                            )
                            : (

                                <ReactMarkdown>

                                    {
                                        message.content
                                    }

                                </ReactMarkdown>

                            )
                    }

                </div>


                <div className="message-time">

                    {
                        formatTime(
                            message.createdAt
                        )
                    }

                </div>

            </div>

        </div>

    );
}