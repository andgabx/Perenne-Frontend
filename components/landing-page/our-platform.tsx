import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PlatformSection() {
  return (
    <div className="w-full py-12 md:py-24 px-[5vw]">
      <div className="flex flex-col items-center">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-4">Nossa Plataforma</h2>
        <p className="text-lg text-gray-500 text-center max-w-3xl mb-10">
          lorem do caralho
        </p>

        <div className="w-full max-w-[70vw] max-h-[60vh] aspect-[16/9] border bg-card rounded-md mb-10 flex items-center justify-center">
          <div className="w-16 h-16 flex flex-col items-center justify-center">
                {/* colocar o cotneudo aq */}
          </div>
        </div>

        <Button asChild variant="outline" size="lg" className="text-lg">
          <Link href="#">Acesse nossa plataforma</Link>
        </Button>
      </div>
    </div>
  )
}
