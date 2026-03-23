export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  keywords: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ia-local-vs-nuvol',
    title: 'IA local vs núvol: per què les empreses de Barcelona estan canviant',
    description: "Descobreix per què cada vegada més empreses barcelonines aposten per servidors d'IA locals en lloc de dependre del núvol. Privacitat, control i estalvi.",
    date: '2026-03-20',
    readTime: '6 min',
    category: 'Estratègia',
    keywords: ['IA local', 'IA núvol', 'empreses Barcelona', 'privacitat dades'],
  },
  {
    slug: 'gdpr-ia-empreses',
    title: "Com complir el GDPR amb intel·ligència artificial al teu despatx",
    description: "Guia pràctica per a empreses que volen usar IA sense arriscar multes de fins al 4% de la facturació. Xifratge, dades locals i compliment automàtic.",
    date: '2026-03-18',
    readTime: '8 min',
    category: 'Legal',
    keywords: ['GDPR', 'IA empreses', 'protecció dades', 'compliment legal'],
  },
  {
    slug: 'chatgpt-vs-ia-privada',
    title: 'ChatGPT vs IA privada: quina és millor per al teu negoci?',
    description: "Comparem costos, privacitat, precisió i control entre eines d'IA al núvol com ChatGPT i solucions d'IA local instal·lades al teu servidor.",
    date: '2026-03-15',
    readTime: '7 min',
    category: 'Comparativa',
    keywords: ['ChatGPT', 'IA privada', 'comparativa IA', 'IA negoci'],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function formatDate(dateStr: string): string {
  const months = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
  const d = new Date(dateStr);
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}
