import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ src }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if (!playerRef.current) {
            playerRef.current = videojs(videoRef.current, {
                controls: true,
                autoplay: false,
                preload: "auto",
                fluid: true,
                playbackRates: [0.5, 1, 1.25, 1.5, 2], // ✅ speed
            });
        }

        if (src) {
            playerRef.current.src({
                src: src,
                type: "video/mp4",
            });
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [src]);

    return (
        <div data-vjs-player>
            <video
                ref={videoRef}
                className="video-js vjs-big-play-centered"
            />
        </div>
    );
};

export default VideoPlayer;