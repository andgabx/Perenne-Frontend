import { Card, CardContent } from "@/components/ui/card";

export function OurTeam() {
  return (
    <div className="w-full py-12 md:py-24 px-[15vw]">
      <h2
        className="text-4xl font-bold tracking-tight text-center mb-12"
        style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
      >
        Quem idealizou a BRASFI
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden rounded-xl">
          <CardContent className="relative p-0 bg-cover bg-center bg-no-repeat bg-[url('/viviane_torinelli.png')] aspect-[3/4] ">
            <div className="absolute bottom-0 inset-x-0 h-[35%] bg-[url('/Membros.png')] bg-no-repeat bg-bottom bg-contain" />
            <div className="absolute bottom-0 inset-x-0 h-[35%] justify-end flex flex-col py-6 px-8">
              <h3
                className="font-black text-4xl text-white mb-1 text-left"
                style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
              >
                Viviane Torinelli
              </h3>
              <p className="text-xl text-gray-200 text-left">
                Fundadora da BRASFI
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-xl">
          <CardContent className="relative p-0 bg-cover bg-center bg-no-repeat bg-[url('/leonardo_lima.png')] aspect-[3/4]  rounded-xl">
            <div className="absolute bottom-0 inset-x-0 h-[35%] bg-[url('/Membros.png')] bg-no-repeat bg-bottom bg-contain" />
            <div className="absolute bottom-0 inset-x-0 h-[35%] justify-end flex flex-col py-6 px-8">
              <h3
                className="font-black text-4xl text-white mb-1 text-left"
                style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
              >
                Leonardo Lima
              </h3>
              <p className="text-xl text-gray-200 text-left">
                Diretor Executivo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-xl">
          <CardContent className="relative p-0 bg-cover bg-center bg-no-repeat bg-[url('/vitor_duarte.png')] aspect-[3/4]  rounded-xl">
            <div className="absolute bottom-0 inset-x-0 h-[35%] bg-[url('/Membros.png')] bg-no-repeat bg-bottom bg-contain" />
            <div className="absolute bottom-0 inset-x-0 h-[35%] justify-end flex flex-col py-6 px-8">
              <h3
                className="font-black text-4xl text-white mb-1 text-left"
                style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
              >
                Vitor Duarte
              </h3>
              <p className="text-xl text-gray-200 text-left">
                Vice‐diretor Executivo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
