"use client";

import { Section } from "@/components/landing-page/_components/Section";
import type React from "react";

import { useRef, useState, useEffect } from "react";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState(0);
    const sections = ["hero", "features", "projects", "contact"];

    useEffect(() => {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        };

        setVh();
        window.addEventListener("resize", setVh);
        return () => window.removeEventListener("resize", setVh);
    }, []);

    const navigateToSection = (index: number) => {
        const container = containerRef.current;
        if (!container) return;

        const sectionElements = Array.from(container.children).filter(
            (child) => child.tagName === "SECTION"
        );

        if (sectionElements[index]) {
            sectionElements[index].scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            const sectionElements = Array.from(container.children).filter(
                (child) => child.tagName === "SECTION"
            );

            const viewportHeight = window.innerHeight;
            const scrollTop = container.scrollTop;

            let maxVisibleSection = 0;
            let maxVisibleArea = 0;

            sectionElements.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const visibleHeight =
                    Math.min(rect.bottom, viewportHeight) -
                    Math.max(rect.top, 0);

                if (visibleHeight > maxVisibleArea) {
                    maxVisibleArea = visibleHeight;
                    maxVisibleSection = index;
                }
            });

            setActiveSection(maxVisibleSection);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            handleScroll();
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="h-[calc(var(--vh,1vh)*100)] w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory relative scrollbar-none"
            style={{
                scrollSnapType: "y mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}
        >
            <Section
                title="Bem-vindo ao Futuro"
                subtitle=""
                color="bg-gradient-to-br from-violet-500 to-purple-700"
                index={0}
            >
                <h1 className="text-4xl font-bold text-white">
                    TESTE SNAP SCROLL
                </h1>
            </Section>

            <Section
                title="Recursos Incríveis"
                subtitle="Tudo que você precisa"
                color="bg-gradient-to-br from-cyan-500 to-blue-700"
                index={1}
            >
                <h1 className="text-4xl font-bold text-white">
                    TESTE SNAP SCROLL
                </h1>
            </Section>

            <Section
                title="Nosso Trabalho"
                subtitle="Projetos recentes"
                color="bg-gradient-to-br from-amber-500 to-orange-700"
                index={2}
            >
                <h1 className="text-4xl font-bold text-white">
                    TESTE SNAP SCROLL
                </h1>
            </Section>

            <Section
                title="Entre em Contato"
                subtitle="Vamos conversar"
                color="bg-gradient-to-br from-emerald-500 to-green-700"
                index={3}
            >
                <h1 className="text-4xl font-bold text-white">
                    TESTE SNAP SCROLL
                </h1>
            </Section>

            {/* Navegação por bolinhas, TODO: mudar por icones talvez */}
            <div className="fixed right-24 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center gap-4">
                {sections.map((section, index) => (
                    <button
                        key={index}
                        onClick={() => navigateToSection(index)}
                        className="group flex items-center justify-end w-full"
                        aria-label={`Navegar para a seção ${section}`}
                    >
                        <div
                            className={`h-3 w-3 rounded-full transition-all duration-200 ${
                                activeSection === index
                                    ? "bg-white scale-150"
                                    : "bg-white/50 hover:bg-white/80"
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
