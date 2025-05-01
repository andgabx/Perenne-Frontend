import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function HeroSection() {
  return (
    <div className="w-full py-12 md:py-24 px-[15vw]">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">Hero</h1>
          <p className="text-xl text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
          <div>
            <Button className="bg-gray-200 hover:bg-gray-300 text-black">Faça parte da nossa comunidade</Button>
          </div>
        </div>

        <div className="relative aspect-video bg-card rounded-md flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-black">
              <Play className="h-8 w-8 text-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
