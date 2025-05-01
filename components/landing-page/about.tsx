export function AboutSection() {
    return (
      <section className="w-full py-12 md:py-24 border-y">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-[15vw]">
          <div className="flex flex-col space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Sobre Nós</h2>
            <p className="text-xl text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </div>
  
          <div className="flex justify-center">
            <div className="relative w-full max-h-[50vh] aspect-square rounded-lg border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 flex flex-col items-center justify-center">
                  <div className="w-4 h-4 rounded-full border border-black mb-2"></div>
                  <div className="w-full h-px bg-black transform rotate-45 translate-y-4"></div>
                  <div className="w-full h-px bg-black transform -rotate-45 translate-y-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  