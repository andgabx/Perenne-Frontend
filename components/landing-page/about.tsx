import Image from "next/image";

const brasilImageUrl = "/Brasilsil.png";

export function AboutSection() {
    return (
        <div
            id="sobre"
            className="flex flex-col sm:flex-row justify-between items-center ml-[10vw] mr-0 max-w-[90vw] py-24 sm:space-x-8"
        >
            <div className="sm:w-1/2 lg:w-1/2 mb-8 sm:mb-0">
                <p className="text-gray-400 text-xl md:text-2xl font-medium tracking-wider uppercase mb-6">
                    SOBRE NÓS
                </p>

                <h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3C6C0C] leading-tight mb-8"
                    style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
                >
                    A aliança por trás da transformação
                </h2>

                <h3 className="text-xl md:text-2xl font-semibold text-[#24BD0A] mb-6">
                    Somos a BRASFI – Aliança Brasileira para Finanças e
                    Investimentos Sustentáveis
                </h3>

                <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl">
                    Atuamos como uma rede nacional que conecta profissionais,
                    acadêmicos e organizações comprometidas com a construção de
                    um Brasil mais justo, ético e ambientalmente responsável.
                    Promovemos a formação de lideranças e o desenvolvimento de
                    soluções inovadoras que usam as finanças como ferramenta de
                    transformação positiva.
                </p>
            </div>

            <div className="sm:w-1/2 lg:w-1/2 flex justify-center items-center">
                <Image
                    src={brasilImageUrl}
                    alt="Mapa estilizado do Brasil representando a BRASFI"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                />
            </div>
        </div>
    );
}
