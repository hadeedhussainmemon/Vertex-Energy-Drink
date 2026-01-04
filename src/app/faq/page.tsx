"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
    {
        question: "Is VERTEX safe for daily use?",
        answer: "VERTEX is engineered for peak performance. We recommend a limit of 400mg of caffeine per day (2 cans). Consult your doctor if you are pregnant, nursing, or sensitive to caffeine."
    },
    {
        question: "Where do you ship?",
        answer: "We currently ship to all sectors in the United States and Canada. Global shipping protocols are initiating soon."
    },
    {
        question: "What makes VERTEX different?",
        answer: "Unlike standard energy drinks, VERTEX uses a proprietary blend of Nootropics for cognitive enhancement, not just physical energy. Zero crash, pure focus."
    },
    {
        question: "How do I track my order?",
        answer: "Once your order is dispatched, you will receive a quantum-encrypted tracking link via email."
    },
    {
        question: "Do you offer sponsorships?",
        answer: "YES. We are looking for elite operatives. Scrims, streams, or street - if you dominate your field, contact us."
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black mb-12 text-center italic text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white"
                >
                    F.A.Q.
                </motion.h1>

                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer, index }: { question: string, answer: string, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/50"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-xl font-bold">{question}</span>
                <span className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45 text-neon-red' : 'text-neon-blue'}`}>
                    +
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48' : 'max-h-0'}`}
            >
                <p className="p-6 pt-0 text-gray-400 leading-relaxed">
                    {answer}
                </p>
            </div>
        </motion.div>
    );
}
