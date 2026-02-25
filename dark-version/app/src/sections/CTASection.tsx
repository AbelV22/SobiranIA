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
    <section id="contacte" className="relative py-12 md:py-20 bg-[#08080A]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#22D3EE]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#22D3EE]/5 blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass rounded-2xl p-6 md:p-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.97]'
          }`}>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 mb-3 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}>
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              <span className="text-xs font-medium text-[#22D3EE]">Gratuit i sense compromis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7] mb-3">Comencem?</h2>
            <p className="text-sm text-[#6B6B78]">Demana una diagnosi gratuita del teu negoci. T'assessorem sense compromis.</p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-10">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 rounded-full bg-[#22D3EE]/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#22D3EE]" />
                </div>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background: ['#22D3EE', '#0EA5E9', '#F59E0B', '#8B5CF6', '#10B981'][i % 5],
                      top: '50%', left: '50%',
                      animation: `confetti-fall 1s ease-out ${i * 0.1}s forwards`,
                      transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-20px)`,
                    }}
                  />
                ))}
              </div>
              <h3 className="text-xl font-semibold text-[#F5F5F7] mb-2">Sol·licitud enviada!</h3>
              <p className="text-sm text-[#6B6B78]">Et contactarem en menys de 24 hores.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`space-y-1.5 transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="text-xs font-medium text-[#F5F5F7]">Nom de l'empresa</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B78] group-focus-within:text-[#22D3EE] transition-colors duration-300" />
                  <Input type="text" placeholder="Ex: Despatx Juridic Garcia" value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="pl-10 h-12 bg-[#111118] border-white/10 text-[#F5F5F7] text-sm placeholder:text-[#6B6B78]/50 focus:border-[#22D3EE] focus:ring-[#22D3EE]/20 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded-xl transition-all duration-300"
                    required />
                </div>
              </div>

              <div className={`space-y-1.5 transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="text-xs font-medium text-[#F5F5F7]">Correu electronic</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B78] group-focus-within:text-[#22D3EE] transition-colors duration-300" />
                  <Input type="email" placeholder="hola@exemple.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 bg-[#111118] border-white/10 text-[#F5F5F7] text-sm placeholder:text-[#6B6B78]/50 focus:border-[#22D3EE] focus:ring-[#22D3EE]/20 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded-xl transition-all duration-300"
                    required />
                </div>
              </div>

              <div className={`space-y-1.5 transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="text-xs font-medium text-[#F5F5F7]">Tipus de negoci</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B78] z-10" />
                  <Select value={formData.tipus} onValueChange={(value) => setFormData({ ...formData, tipus: value })}>
                    <SelectTrigger className="pl-10 h-12 bg-[#111118] border-white/10 text-[#F5F5F7] text-sm focus:border-[#22D3EE] focus:ring-[#22D3EE]/20 rounded-xl">
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
                  className="w-full h-12 bg-[#22D3EE] hover:bg-[#0EA5E9] text-[#0A0A0F] font-semibold text-sm rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#22D3EE]/20 flex items-center justify-center gap-2 ripple-btn">
                  Enviar sol·licitud
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-center text-[10px] text-[#6B6B78]">
                Resposta en 24h. Sense compromis. Les teves dades estan protegides.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
