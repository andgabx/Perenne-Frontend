export default function MissionSection() {
    const missionItems = [
        {
            number: "1",
            title: "Inspirar uma nova geração de líderes conscientes",
            description:
                "Formamos lideranças com visão sistêmica e compromisso com o futuro. Por meio de capacitações, experiências práticas e espaços de troca, preparamos pessoas para atuar com ética, propósito e impacto.",
        },
        {
            number: "2",
            title: "Fortalecer soluções que conectam lucro e propósito",
            description:
                "Promovemos o desenvolvimento de estratégias financeiras sustentáveis, apoiando práticas que conciliam desempenho econômico com responsabilidade social e ambiental.",
        },
        {
            number: "3",
            title: "Construir comunidades que geram impacto coletivo",
            description:
                "Mais do que uma rede, criamos um ecossistema vivo de colaboração. Conectamos pessoas e propósitos para promover ações conjuntas, fomentar debates e impulsionar mudanças estruturais.",
        },
    ];

    return (
        <section id="missao" className="bg-green-100 py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-6 md:px-12 lg:px-20" >
                <div className="text-center mb-16">
                    <p className="text-gray-400 text-xl md:text-2xl font-medium tracking-wider uppercase mb-6">
                        NOSSA MISSÃO
                    </p>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heebo text-green-700 leading-tight max-w-4xl mx-auto" style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}>
                        Conheça os eixos que norteiam nossa atuação
                    </h2>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="space-y-8 md:space-y-12">
                        {missionItems.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-white/50 flex flex-col md:flex-row items-start gap-6">
                                    <div className="flex-shrink-0 w-24 h-24 bg-green-600 rounded-xl bg-[url('/numberbg.png')] bg-cover bg-center flex items-center justify-center relative z-10 m-auto">
                                        <span className="text-white text-5xl font-extrabold" >
                                            {item.number}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-bold text-green-700 mb-4 leading-tight" style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}>
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
