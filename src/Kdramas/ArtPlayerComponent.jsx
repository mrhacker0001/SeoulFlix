import React, { useEffect, useRef } from "react";
import Artplayer from "artplayer";

const ArtPlayerComponent = ({ url }) => {
    const artRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if (!artRef.current) return;

        playerRef.current = new Artplayer({
            container: artRef.current,
            url: url,
            autoplay: false,
            volume: 0.7,
            setting: true,
            playbackRate: true,
            aspectRatio: true,
            fullscreen: true,
            hotkey: true,
            pip: true,
            theme: "#00bcd4",
        });

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [url]);

    return (
        <div
            ref={artRef}
            style={{
                width: "100%",
                height: "500px",
                borderRadius: "16px",
                overflow: "hidden",
            }}
        />
    );
};

export default ArtPlayerComponent;