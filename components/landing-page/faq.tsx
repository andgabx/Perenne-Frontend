import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  return (
    <div className="w-full px-[15vw] py-16">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-lg border bg-card overflow-hidden flex items-center justify-center">
            <div className="w-16 h-16 flex flex-col items-center justify-center">
              <div className="w-3 h-3 rounded-full border border-black mb-1"></div>
              <div className="w-full h-px bg-black transform rotate-45 translate-y-2"></div>
              <div className="w-full h-px bg-black transform -rotate-45 translate-y-2"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-8">
          <h2 className="text-4xl font-bold tracking-tight pb-8">Dúvidas Frequentes</h2>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="bg-card px-4 py-3 hover:bg-card/80">
                Pergunta 1
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="bg-card px-4 py-3 hover:bg-card/80">
                Pergunta 2
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="bg-card px-4 py-3 hover:bg-card/80">
                Pergunta 3
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="bg-card px-4 py-3 hover:bg-card/80">
                Pergunta 4
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
