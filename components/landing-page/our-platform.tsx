// components/landing-page/platform.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const platformImageUrl = "/Plataforma.png";
const platformImagePlaceholder =
  "https://placehold.co/1280x720/e0e0e0/a0a0a0?text=Platform+Preview";

export function PlatformSection() {
  return (
    <div className="w-full py-12 md:py-24 px-[5vw] bg-[url(/Plataforma-backgroundpng.png)] bg-contain bg-center bg-no-repeat">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl text-gray-400 font-semibold tracking-wider text-center mb-1">
          NOSSA PLATAFORMA
        </h2>
        <p
          className="text-4xl text-[#3C6C0C] text-center font-black max-w-3xl"
          style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
        >
          Entre para o ecossistema da BRASFI
        </p>

        <div className="w-full max-w-[100vw] max-h-[90vh] aspect-[16/9] rounded-md mb-10 flex items-center justify-center overflow-hidden">
          <img
            src={platformImageUrl}
            alt="Plataforma BRASFI"
            className="w-full h-full object-contain"
          />
        </div>

        <Button
          asChild
          // variant="outline" // Removido para evitar conflito com o hover personalizado
          size="lg"
          // Adicionada a classe hover:bg-[#188805] para o fundo verde escuro no hover
          className="bg-[#24bd0a] hover:bg-[#188805] font-bold text-white text-xl px-25 py-8 hover:scale-105 transition-all duration-300"
        >
          <Link href="#">VENHA FAZER PARTE!</Link>
        </Button>
      </div>
    </div>
  );
}
