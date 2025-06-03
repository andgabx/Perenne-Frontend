import { Button } from "../ui/button";

export function HeroSection() {
    return (
        <div className="px-10">
            <section id="inicio" className="h-[60vh] bg-amber-400 w-full rounded-[38px]">
                <section className="h-[59vh] bg-[url('/bglandingpage.png')] overflow-hidden bg-cover bg-center bg-no-repeat w-full rounded-[38px] mt-8">
                    <div className="flex flex-col bg-gray-200/93 aspect-square translate-y-[7%] overflow-hidden h-[70vh] w-[60vw] ml-[5%] rounded-[44px] text-black items-center justify-center">
                        <div className="flex flex-col px-12 translate-y-[-20%] space-y-6">
                            <h1 className="sm:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl	 text-[#24bd0a] font-bold">
                                Unindo líderes para transformar o Brasil com
                                finanças sustentáveis
                            </h1>
                            <h1 className="md:text-xl font-heebo">
                                A BRASFI é uma aliança nacional que conecta
                                profissionais e acadêmicos comprometidos com o
                                futuro do país. Promovemos a formação de
                                lideranças e soluções em finanças e
                                investimentos sustentáveis para impulsionar
                                mudanças reais — econômicas, sociais e
                                ambientais.
                            </h1>

                            <Button className="bg-[#24bd0a] md:inline-flex sm:text-sm h-12 w-[55vw] md:w-[35vw] lg:w-[25vw] xl:w-[20vw] 2xl:w-[15vw]">
                                CONHEÇA A NOSSA COMUNIDADE
                            </Button>
                        </div>
                    </div>
                </section>
            </section>
        </div>
    );
}
