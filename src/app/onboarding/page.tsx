"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ChevronLeft, ChevronRight, Zap, Circle, Dumbbell, TrendingUp, Calendar } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 5

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    goal: '',
    experience: '',
    frequency: '',
    focus: [] as string[],
  })

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setLoading(true)

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        console.error('Erro ao criar conta:', authError)
        alert('Erro ao criar conta. Tente novamente.')
        return
      }

      // 2. Criar perfil no banco
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            goal: formData.goal,
            experience: formData.experience,
            frequency: formData.frequency,
            focus: formData.focus,
            created_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
        }
      }

      // 3. Redirecionar para o checkout
      window.location.href = 'https://checkout.keoto.com/385bd806-1e1c-4e14-aa27-f2da6f7482e9'
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao processar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.length > 0
      case 2:
        return formData.email.length > 0 && formData.password.length >= 6
      case 3:
        return formData.goal.length > 0
      case 4:
        return formData.experience.length > 0
      case 5:
        return formData.frequency.length > 0 && formData.focus.length > 0
      default:
        return false
    }
  }

  const toggleFocus = (focus: string) => {
    setFormData(prev => ({
      ...prev,
      focus: prev.focus.includes(focus)
        ? prev.focus.filter(f => f !== focus)
        : [...prev.focus, focus]
    }))
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Zap className="w-10 h-10 text-[#39FF14]" fill="#39FF14" />
              <div className="absolute inset-0 blur-xl bg-[#39FF14]/30"></div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              FIT<span className="text-[#39FF14]">PULSE</span>
            </h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/60">Passo {step} de {totalSteps}</span>
            <span className="text-sm text-[#39FF14]">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#39FF14] to-[#2dd10f] transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-6">
          {/* Step 1: Nome */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Bem-vindo! 👋</h2>
                <p className="text-white/60">Vamos começar com o básico</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Como você se chama?</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* Step 2: Email e Senha */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Crie sua conta 🔐</h2>
                <p className="text-white/60">Vamos proteger seus dados</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Senha</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* Step 3: Objetivo */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Circle className="w-12 h-12 text-[#39FF14] mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Qual seu objetivo? 🎯</h2>
                <p className="text-white/60">Escolha o que mais combina com você</p>
              </div>
              <div className="grid gap-4">
                {['Perder peso', 'Ganhar massa muscular', 'Melhorar condicionamento', 'Manter a forma'].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setFormData({ ...formData, goal })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      formData.goal === goal
                        ? 'border-[#39FF14] bg-[#39FF14]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="font-semibold">{goal}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Experiência */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Dumbbell className="w-12 h-12 text-[#39FF14] mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Qual sua experiência? 💪</h2>
                <p className="text-white/60">Vamos ajustar o treino para você</p>
              </div>
              <div className="grid gap-4">
                {['Iniciante', 'Intermediário', 'Avançado'].map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setFormData({ ...formData, experience: exp })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      formData.experience === exp
                        ? 'border-[#39FF14] bg-[#39FF14]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="font-semibold">{exp}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Frequência e Foco */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Calendar className="w-12 h-12 text-[#39FF14] mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Planejamento 📅</h2>
                <p className="text-white/60">Quantas vezes por semana você treina?</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['2-3x', '4-5x', '6-7x'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFormData({ ...formData, frequency: freq })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.frequency === freq
                        ? 'border-[#39FF14] bg-[#39FF14]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="font-semibold">{freq}</span>
                  </button>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-3 text-white/80">Áreas de foco (selecione múltiplas):</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Peito', 'Costas', 'Pernas', 'Braços', 'Ombros', 'Core'].map((focus) => (
                    <button
                      key={focus}
                      onClick={() => toggleFocus(focus)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        formData.focus.includes(focus)
                          ? 'border-[#39FF14] bg-[#39FF14]/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="font-semibold text-sm">{focus}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
          )}
          {step < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 rounded-2xl py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                canProceed()
                  ? 'bg-[#39FF14] text-black hover:bg-[#2dd10f] hover:scale-105 shadow-lg shadow-[#39FF14]/20'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              Próximo
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || loading || isSubmitting}
              className={`flex-1 rounded-2xl py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                canProceed() && !loading && !isSubmitting
                  ? 'bg-[#39FF14] text-black hover:bg-[#2dd10f] hover:scale-105 shadow-lg shadow-[#39FF14]/20'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar e Continuar'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
