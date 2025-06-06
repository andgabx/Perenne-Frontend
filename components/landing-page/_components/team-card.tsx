// components/landing-page/_components/team-card.tsx
import { Card, CardContent } from "@/components/ui/card";

interface TeamCardProps {
  name: string;
  description: string;
  FotoUrl: string;
}

// const vectorImageUrl = "/Membros.png"; // Esta constante não está a ser usada no seu último código.
// Se "/Membros.png" for uma imagem estática, pode defini-la aqui.

export function TeamCard({ name, description, FotoUrl }: TeamCardProps) {
  const membrosDecoracaoUrl = "/Membros.png"; // Defina o caminho para sua imagem de decoração

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col h-full">
      {/*
        O CardContent agora usa o atributo 'style' para a imagem de fundo principal (FotoUrl),
        pois classes dinâmicas do Tailwind com `bg-[url(${variavel})]` não funcionam como esperado.
      */}
      <CardContent
        className="relative p-0 bg-cover bg-center bg-no-repeat flex-grow flex flex-col justify-end min-h-[200px] sm:min-h-[220px] md:min-h-[250px]"
        style={{ backgroundImage: `url(${FotoUrl})` }}
      >
        {/* Overlay escuro para melhorar a legibilidade do texto sobre a imagem de fundo principal */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/*
          Este div interno agora contém o texto e terá '/Membros.png' como sua própria imagem de fundo,
          também aplicada via 'style' para consistência e para garantir que funcione.
          Ele está posicionado acima do overlay.
        */}
        <div
          className="relative z-10 w-full p-4 text-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${membrosDecoracaoUrl})`,
            backgroundSize: "contain", // Ou "cover", ou um tamanho específico. Ajuste conforme a imagem '/Membros.png'.
            backgroundPosition: "center",
            // Se Membros.png for uma textura/padrão pequeno, você pode querer 'background-repeat: repeat;'
          }}
        >
          <h3 className="font-semibold text-lg md:text-xl text-white mb-1">
            {name}
          </h3>
          <p className="text-sm text-gray-200">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
