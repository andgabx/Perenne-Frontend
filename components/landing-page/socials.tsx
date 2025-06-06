import Link from "next/link";

const logoImageUrl = "/LOGOTIPO.png";
const zapImageUrl = "/zap.png";
const linkedinImageUrl = "/linkedin.png";
const igImageUrl = "/ig.png";
const spotifyImageUrl = "/spotify.png";

export function Socials() {
  return (
    <div className="grid grid-cols-3 w-full bg-[#11240e] py-20 px-20 text-white">
      {/* Coluna 1: Logo */}
      <div className="w-20 md:w-40 z-10">
        <img
          src={logoImageUrl}
          alt="Plataforma BRASFI"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Coluna 2 e 3: Navegação + Redes Sociais */}
        {/* Navegação */}
        <div className="flex flex-col items-center md:items-start w-full md:w-auto mb-8 md:mb-0" style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}>
          <Link
            href="/"
            className="mb-3 font-bold text-xl sm:text-2xl text-[#F0E206] hover:text-yellow-300 transition-colors"
          >
            Início
          </Link>
          <Link
            href="/sobre"
            className="mb-3 font-bold text-xl sm:text-2xl text-[#F0E206] hover:text-yellow-300 transition-colors"
          >
            Sobre nós
          </Link>
          <Link
            href="/missao"
            className="mb-3 font-bold text-xl sm:text-2xl text-[#F0E206] hover:text-yellow-300 transition-colors"
          >
            Missão
          </Link>
          <Link
            href="/plataforma"
            className="mb-3 font-bold text-xl sm:text-2xl text-[#F0E206] hover:text-yellow-300 transition-colors"
          >
            Plataforma
          </Link>
        </div>

        {/* Redes Sociais */}
        <div className="flex flex-col items-center text-[#F0E206] w-full md:w-auto" style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}>
          <h3 className="font-semibold text-2xl sm:text-3xl mb-4 text-center md:text-left">
            Social
          </h3>
          <div className="flex space-x-2">
            <Link
              href="#"
              aria-label="WhatsApp da BRASFI"
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <img
                src={zapImageUrl}
                alt="WhatsApp"
                className="w-15 h-15 object-contain"
              />
            </Link>
            <Link
              href="#"
              aria-label="LinkedIn da BRASFI"
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <img
                src={linkedinImageUrl}
                alt="LinkedIn"
                className="w-15 h-15 object-contain"
              />
            </Link>
            <Link
              href="#"
              aria-label="Instagram da BRASFI"
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <img
                src={igImageUrl}
                alt="Instagram"
                className="w-15 h-15 object-contain"
              />
            </Link>
            <Link
              href="#"
              aria-label="Spotify da BRASFI"
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <img
                src={spotifyImageUrl}
                alt="Spotify"
                className="w-15 h-15 object-contain"
              />
            </Link>
          </div>
        </div>
      </div>
  );
}
