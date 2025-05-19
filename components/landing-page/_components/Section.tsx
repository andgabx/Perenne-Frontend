"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    color: string;
    index: number;
}

export function Section({
    children,
    color,
    index,
}: SectionProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const scale = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [0.95, 1, 1, 0.95]
    );

    return (
        <section
            ref={ref}
            className={`h-screen w-full ${color} snap-start flex flex-col items-center justify-center p-8`}
            style={{ scrollSnapAlign: "start" }}
            id={`section-${index}`}
        >
            <motion.div
                style={{ scale }}
                className="max-w-7xl mx-auto w-full flex flex-col items-center"
            >
                
                {children}
            </motion.div>
        </section>
    );
}
