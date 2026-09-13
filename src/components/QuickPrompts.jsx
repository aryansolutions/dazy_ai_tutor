const prompts = [
    "Explain this topic like I have an exam tomorrow",

    "Quiz me with 5 interview questions",

    "Teach me a difficult concept step by step",

    "Give me concise revision notes",
];

export default function QuickPrompts({
    onSelect,
}) {
    return (
        <div className="quick-prompts">

            {prompts.map(
                (prompt) => (

                    <button
                        key={prompt}
                        onClick={() =>
                            onSelect(
                                prompt
                            )
                        }
                        type="button"
                    >

                        <span>
                            ✨
                        </span>

                        {prompt}

                    </button>

                )
            )}

        </div>
    );
}