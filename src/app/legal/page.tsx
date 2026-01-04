export default function LegalPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 px-6">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-4xl font-black mb-8">LEGAL PROTOCOLS</h1>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-neon-blue mb-4">PRIVACY POLICY</h2>
                    <p className="text-gray-400 mb-4">
                        VERTEX collects minimal data to process your energy acquisitions. We do not sell your neural patterns to third-party advertisers.
                        Your location data is used solely for delivery logistics.
                    </p>
                    <p className="text-gray-400">
                        Cookie Usage: We use cookies solely to maintain your session state (Cart/Auth).
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-neon-red mb-4">TERMS OF SERVICE</h2>
                    <p className="text-gray-400 mb-4">
                        By consuming VERTEX, you agree to waive all liability for broken personal records,
                        sudden realization of simulation theory, or excessive productivity.
                    </p>
                    <p className="text-gray-400">
                        Consumption limit recommended: 1 can per 4 hours.
                    </p>
                </section>

                <p className="text-xs text-gray-600 border-t border-white/10 pt-8 mt-16">
                    Last Updated: 2026.1.1 // SYSTEM_VERSION_3.0
                </p>
            </div>
        </div>
    );
}
