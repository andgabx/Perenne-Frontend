"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import StepOne from "./components/first-section"
import StepTwo from "./components/second-section"

export default function Home() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    aceitaTermos: false,
  })

  const handleContinue = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = (data: Partial<typeof formData>) => {
    const finalData = { ...formData, ...data }
    console.log("Formulário enviado:", finalData)
    
    alert("Conta criada com sucesso!")
  }

  return (
    <main className="min-h-screen bg-[#f0f5f0] flex flex-col">
      

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="text-center py-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-[#2e7d32]">CRIAR CONTA</h1>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StepOne initialData={formData} onContinue={handleContinue} />
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* <StepTwo initialData={formData} onBack={handleBack} onSubmit={handleSubmit} /> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="h-1 bg-[#ffd700] rounded-b-lg"></div>
        </div>
      </div>
    </main>
  )
}
