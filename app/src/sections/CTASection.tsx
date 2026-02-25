import { useState } from 'react';
import { Send, Building2, Mail, User, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function CTASection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    tipus: '',
  });
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.15 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const businessTypes = [
    { value: 'advocacia', label: 'Advocacia' },
    { value: 'dental', label: 'Clinica Dental' },
    { value: 'finances', label: 'Finances' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'immobiliaria', label: 'Immobiliaria' },
    { value: 'altres', label: 'Altres' },
  ];

  return (
    <section id="contacte" className="relative py-24 md:py-32 bg-[#0A0A0F]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#22D3EE]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#22D3EE]/5 blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass rounded-3xl p-8 md:p-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.97]'
        }`}>
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 mb-4 transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              <span className="text-sm font-medium text-[#22D3EE]">Gratuit i sense compromis</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F7] mb-4">Comencem?</h2>
            <p className="text-[#6B6B78]">Demana una diagnosi gratuita del teu negoci. T'assessorem sense compromis.</p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="w-20 h-20 rounded-full bg-[#22D3EE]/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-[#22D3EE]" />
                </div>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#22D3EE', '#0EA5E9', '#F59E0B', '#8B5CF6', '#10B981'][i % 5],
                      top: '50%', left: '50%',
                      animation: `confetti-fall 1s ease-out ${i * 0.1}s forwards`,
                      transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-30px)`,
                    }}
                  />
                ))}
              </div>
              <h3 className="text-2xl font-semibold text-[#F5F5F7] mb-3">Sol·licitud enviada!</h3>
              <p className="text-[#6B6B78]">Et contactarem en menys de 24 hores.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`space-y-2 transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="text-sm font-medium text-[#F5F5F7]">Nom de l'empresa</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B78] group-focus-within:text-[#22D3EE] transition-colors duration-300" />
                  <Input type="text" placeholder="Ex: Despatx Juridic Garcia" value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="pl-12 h-14 bg-[#111118] border-white/10 text-[#F5F5F7] placeholder:text-[#6B6B78]/50 focus:border-[#22D3EE] focus:ring-[#22D3EE]/20 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded-xl transition-all duration-300"
                    required />
                </div>
              </div>

              <div className={`space-y-2 transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="text-sm font-medium text-[#F5F5F7]">Correu electronic</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B78] group-focus-within:text-[#22D3EE] transition-colors duration-300" />
                  <Input type="email" placeholder="hola@exemple.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-12 h-14 bg-[#111118] border-white/10 text-[#F5F5F7] placeholder:text-[#6B6B78]/50 focus:border-[#22D3EE] focus:ring-[#22D3EE]/20 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded-xl transition-all duration-300"
                    required />
                </div>
              </div>

              <div className={`space-y-2 transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="text-sm font-medium text-[#F5F5F7]">Tipus de negoci</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B78] z-10" />
                  <Select value={formData.tipus} onValueChange={(value) => setFormData({ ...formData, tipus: value })}>
                    <SelectTrigger className="pl-12 h-14 bg-[#111118] border-white/10 text-[#F5F5F7] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20 rounded-xl">
                      <SelectValue placeholder="Selecciona el teu sector" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111118] border-white/10">
                      {businessTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}
                          className="text-[#F5F5F7] focus:bg-[#22D3EE]/10 focus:text-[#F5F5F7]">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className={`transition-all duration-500 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Button type="submit"
                  className="w-full h-14 bg-[#22D3EE] hover:bg-[#0EA5E9] text-[#0A0A0F] font-semibold text-base rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#22D3EE]/20 flex items-center justify-center gap-2 ripple-btn">
                  Enviar sol·licitud
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-center text-xs text-[#6B6B78]">
                Resposta en 24h. Sense compromis. Les teves dades estan protegides.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
