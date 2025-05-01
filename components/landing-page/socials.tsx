import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export function Socials() {
  return (
    <div className="w-full border-t py-8 px-[15vw]">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="font-bold mb-4 md:mb-0">LOGO</div>

        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <Link href="/" className="mb-2 hover:text-gray-600 transition-colors">
            Início
          </Link>
          <Link href="/sobre" className="mb-2 hover:text-gray-600 transition-colors">
            Sobre nós
          </Link>
          <Link href="/missao" className="hover:text-gray-600 transition-colors">
            Missão
          </Link>
        </div>
        

        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-medium mb-4 mx-auto">Social</h3>
          <div className="flex space-x-3">
            <Link href="#" className=" p-2 rounded-full hover:bg-gray-700 transition-colors">
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className=" p-2 rounded-full hover:bg-gray-700 transition-colors">
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className=" p-2 rounded-full hover:bg-gray-700 transition-colors">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className=" p-2 rounded-full hover:bg-gray-700 transition-colors">
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
