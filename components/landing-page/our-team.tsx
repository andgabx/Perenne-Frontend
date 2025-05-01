import { TeamCard } from "./_components/team-card"

export function OurTeam() {
  return (
    <div className="w-full py-12 md:py-24 px-[15vw]">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-12">Nossa equipe</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TeamCard name="Raimundo Nonato" description="Coordenador" />
          <TeamCard name="Lorena Nonato" description="Coordenadora" />
          <TeamCard name="João Nonato" description="Coordenador" />
          <TeamCard name="Maria Nonato" description="Coordenadora" />
        </div>

    </div>
  )
}
