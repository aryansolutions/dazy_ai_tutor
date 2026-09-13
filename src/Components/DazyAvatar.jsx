export default function DazyAvatar({
    state = "idle",
    size = "normal",
}) {
    return (
        <div
            className={`
        dazy-avatar
        dazy-${state}
        avatar-${size}
      `}
        >

            <div className="orbit orbit-one" />

            <div className="orbit orbit-two" />

            <div className="spark spark-one">
                ✦
            </div>

            <div className="spark spark-two">
                ✧
            </div>

            <div className="dazy-body">

                <div className="dazy-ear ear-left" />

                <div className="dazy-ear ear-right" />

                <div className="dazy-face">

                    <div className="brow brow-left" />

                    <div className="brow brow-right" />

                    <div className="dazy-eyes">

                        <span className="eye" />

                        <span className="eye" />

                    </div>

                    <div className="cheek cheek-left" />

                    <div className="cheek cheek-right" />

                    <div className="dazy-mouth" />

                </div>

                <div className="dazy-neck" />

                <div className="dazy-chest">

                    <span>
                        ♥
                    </span>

                </div>

            </div>

            {state ===
                "listening" && (

                    <div className="sound-wave">

                        <span />

                        <span />

                        <span />

                        <span />

                    </div>

                )}

            {state ===
                "thinking" && (

                    <div className="thinking-indicator">

                        <span />

                        <span />

                        <span />

                    </div>

                )}

        </div>
    );
}