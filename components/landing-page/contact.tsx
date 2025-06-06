"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  const highlightedWordStyle = { color: "#F0E206" };
  const formStackOffset = "-8px";

  return (
    <div id="contato" className="w-full bg-[#24BD0A] flex items-center py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-8 md:py-12 flex flex-col lg:flex-row items-center justify-between w-full">
        <div className="w-full lg:w-[45%] flex flex-col justify-center lg:pr-8 mb-12 lg:mb-0">
          <h2 className="text-xl md:text-2xl text-gray-200 font-semibold tracking-wider text-left mb-4">
            CONTATO
          </h2>

          <p
            className="text-white text-3xl md:text-4xl lg:text-5xl text-left"
            style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
          >
            Deixe aqui
            <br />
            suas <span style={highlightedWordStyle}>dúvidas</span>,
            <br />
            <span style={highlightedWordStyle}>propostas</span> ou
            <br />
            <span style={highlightedWordStyle}>comentários</span>.
          </p>

          <p className="text-white font-heebo text-left mt-4 md:mt-6 text-base md:text-lg lg:text-xl">
            Estamos sempre disponíveis para trocar
            <br />
            ideias e fortalecer conexões.
          </p>

          <div className="mt-8 md:mt-12">
            <Image
              src="/bolinhas.png"
              alt="Imagem de bolinhas decorativas"
              width={180}
              height={36}
              className="w-[140px] md:w-[180px]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://placehold.co/180x36/cccccc/ffffff?text=Image"; // Placeholder
              }}
            />
          </div>
        </div>

        <div className="relative w-full max-w-2xl lg:w-[55%] xl:w-[50%]">
          <div
            className="absolute inset-0 bg-[#FCB201] rounded-3xl shadow-lg"
            style={{ transform: `translateY(${formStackOffset})`, zIndex: 1 }}
          ></div>

          <div
            className="bg-white rounded-3xl shadow-lg flex flex-col relative z-10 p-1"
            style={{ zIndex: 2 }}
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-gray-800 text-center pt-5 md:pt-6"
              style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
            >
              Fale com a BRASFI!
            </h3>
            <hr className="border-t-2 border-black mt-3 md:mt-4 mb-8 md:mb-10 mx-6" />

            <form className="flex flex-col space-y-5 flex-grow px-6 md:px-8 lg:px-10 py-4">
              <div>
                <input
                  type="text"
                  placeholder="Coloque seu nome e sobrenome"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  style={{ backgroundColor: "#C1DDC5" }}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Seu principal e-mail"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  style={{ backgroundColor: "#C1DDC5" }}
                />
              </div>
              <div>
                <textarea
                  placeholder="Escreva aqui sua mensagem..."
                  className="w-full min-h-[140px] md:min-h-[160px] px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  style={{ backgroundColor: "#C1DDC5" }}
                />
              </div>

              <div className="flex justify-center pt-4 pb-6 md:pt-5 md:pb-8">
                <Button
                  type="submit"
                  className="text-white font-bold bg-[#24BD0A] hover:bg-[#188805] rounded-lg hover:scale-105 transition-all duration-300"
                  style={{
                    width: "clamp(180px, 16vw, 240px)",
                    height: "clamp(44px, 3.2vw, 52px)",
                    fontSize: "clamp(16px, 1.6vw, 20px)",
                  }}
                >
                  Enviar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
