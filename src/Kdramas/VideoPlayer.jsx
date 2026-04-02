import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ src }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    // ✅ INIT faqat 1 marta
    useEffect(() => {
        if (!videoRef.current) return;

        playerRef.current = videojs(videoRef.current, {
            controls: true,
            autoplay: false,
            preload: "auto",
            fluid: true,
            playbackRates: [0.5, 1, 1.25, 1.5, 2],
        });

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
            }
        };
    }, []);

    // ✅ SOURCE alohida update qilinadi
    useEffect(() => {
        if (playerRef.current && src) {
            playerRef.current.src({
                src: src,
                type: "video/mp4",
            });
        }
    }, [src]);

    return (
        <div data-vjs-player>
            <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
    );
};

export default VideoPlayer;