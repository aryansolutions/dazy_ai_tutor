const API_URL = (
    import.meta.env
        .VITE_API_URL ||
    "http://127.0.0.1:8000"
).replace(/\/$/, "");

const REQUEST_TIMEOUT =
    45000;

export async function sendChatMessage(
    payload
) {
    const controller =
        new AbortController();

    const timeoutId =
        setTimeout(() => {

            controller.abort();

        }, REQUEST_TIMEOUT);

    try {

        const response =
            await fetch(
                `${API_URL}/chat`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify(
                            payload
                        ),

                    signal:
                        controller.signal,
                }
            );

        let data =
            null;

        try {

            data =
                await response.json();

        } catch {
            // non JSON response
        }

        if (!response.ok) {

            const detail =
                data?.detail ||
                data?.message ||
                `Dazy API returned ${response.status}.`;

            throw new Error(
                detail
            );
        }

        if (!data?.response) {

            throw new Error(
                "Dazy returned an empty response."
            );

        }

        return data;

    } catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            throw new Error(
                "Dazy took too long to respond. Please try again."
            );

        }

        if (
            error instanceof
            TypeError
        ) {

            throw new Error(
                "Couldn't connect to Dazy's server. Check the backend URL or deployment."
            );

        }

        throw error;

    } finally {

        clearTimeout(
            timeoutId
        );

    }
}