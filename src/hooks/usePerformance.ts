"use client";

import { useState, useEffect } from "react";

export default function usePerformance() {
    const [isMobile, setIsMobile] = useState(false);
    const [dpr, setDpr] = useState([1, 2]); // Default DPR range

    useEffect(() => {
        // Simple User Agent check for mobile
        const checkMobile = () => {
            const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
            const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
            setIsMobile(mobile);

            // Cap DPR on mobile to save battery and GPU
            if (mobile) {
                setDpr([1, 1.5]);
            } else {
                setDpr([1, 2]);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return { isMobile, dpr };
}
