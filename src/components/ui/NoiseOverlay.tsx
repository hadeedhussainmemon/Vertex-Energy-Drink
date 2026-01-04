"use client";

export default function NoiseOverlay() {
    return (
        <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.05] mix-blend-overlay">
            <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
                <filter id='noiseFilter'>
                    <feTurbulence type='fractalNoise' baseFrequency='0.6' stitchTiles='stitch' />
                </filter>
                <rect width='100%' height='100%' filter='url(#noiseFilter)' />
            </svg>
        </div>
    );
}
