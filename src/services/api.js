const API_URL =
    "https://dazy-ai-tutor.onrender.com";

const REQUEST_TIMEOUT = 45000;

export async function sendChatMessage(payload) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, REQUEST_TIMEOUT);

    try {
        const response = await fetch(
            `${API_URL}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(payload),

                signal: controller.signal,
            }
        );

        let data = null;

        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if (!response.ok) {
            throw new Error(
                data?.detail ||
                data?.message ||
                `Dazy API returned status ${response.status}.`
            );
        }

        if (!data?.response) {
            throw new Error(
                "Dazy returned an empty response."
            );
        }

        return data;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(
                "Dazy took too long to respond. Please try again."
            );
        }

        if (error instanceof TypeError) {
            throw new Error(
                "Couldn't connect to Dazy's backend."
            );
        }

        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}