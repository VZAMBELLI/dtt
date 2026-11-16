// Dados de EXEMPLO para desenvolvimento e demonstração.
// Lojas, produtos e avaliações abaixo são fictícios (exceto a loja Secure Privacy).
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();

const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  await db.review.deleteMany(); await db.quoteRequest.deleteMany(); await db.orderItem.deleteMany();
  await db.order.deleteMany(); await db.listing.deleteMany(); await db.category.deleteMany();
  await db.store.deleteMany(); await db.user.deleteMany();

  const pass = await bcrypt.hash("senha123", 10);

  const cats = [
    ["CFTV e Câmeras", "PHYSICAL", "camera"], ["Controle de Acesso", "PHYSICAL", "lock"],
    ["Rastreamento", "PHYSICAL", "pin"], ["Cofres e Proteção Física", "PHYSICAL", "safe"],
    ["Contravigilância", "PHYSICAL", "scan"], ["Alarmes e Pânico", "PHYSICAL", "alert"],
    ["Red Team e Pentest", "SERVICE", "target"], ["Proteção Executiva", "SERVICE", "shield"],
    ["Consultoria e Conformidade", "SERVICE", "doc"], ["Investigação Corporativa", "SERVICE", "search"],
    ["Software e Licenças", "DIGITAL", "code"], ["Cursos e Treinamentos", "DIGITAL", "book"],
    ["Pentesters", "PROFESSIONAL", "terminal"], ["Consultores", "PROFESSIONAL", "user"],
    ["Segurança Pessoal", "PROFESSIONAL", "shield"]
  ];
  const C = {};
  for (const [name, type, icon] of cats) C[name] = await db.category.create({ data: { name, slug: slug(name), type, icon } });

  await db.user.create({ data: { name: "Administrador", email: "admin@exemplo.com", passwordHash: pass, role: "ADMIN" } });
  const buyer = await db.user.create({ data: { name: "Comprador Exemplo", email: "cliente@exemplo.com", passwordHash: pass } });
  const reviewer2 = await db.user.create({ data: { name: "Marina R.", email: "marina@exemplo.com", passwordHash: pass } });

  async function store(email, data) {
    const u = await db.user.create({ data: { name: data.owner, email, passwordHash: pass } });
    const { owner, ...rest } = data;
    return db.store.create({ data: { ...rest, userId: u.id, slug: slug(data.name), status: rest.status ?? "APPROVED" } });
  }

  const sp = await store("vendedor@exemplo.com", { owner: "Secure Privacy", name: "Secure Privacy", kind: "EMPRESA", document: "00.000.000/0001-00", city: "São Paulo, SP", bio: "Segurança ofensiva e proteção executiva. Simulamos adversários reais para que sua organização decida com base em evidência.", credentials: "OSCP · CRTO · Proteção executiva", verified: true, commissionRate: 0 });
  const vt = await store("vertice@exemplo.com", { owner: "Vértice", name: "Vértice Equipamentos", kind: "EMPRESA", document: "11.111.111/0001-11", city: "Curitiba, PR", bio: "Distribuidor de CFTV, controle de acesso e alarmes profissionais com garantia nacional.", credentials: "Revenda autorizada · NF-e", verified: true });
  const cd = await store("cofre@exemplo.com", { owner: "Cofre Digital", name: "Cofre Digital", kind: "EMPRESA", document: "22.222.222/0001-22", city: "Belo Horizonte, MG", bio: "Licenças de software de segurança e treinamentos para equipes técnicas e executivos.", credentials: "Parceiro oficial dos fabricantes", verified: true });
  const lf = await store("lucas@exemplo.com", { owner: "Lucas F.", name: "Lucas Ferraz", kind: "PROFISSIONAL", document: "000.000.000-00", city: "Remoto · Brasil", bio: "Pentester independente com foco em aplicações web e APIs. 8 anos de experiência.", credentials: "OSWE · OSCP · eWPTX", verified: true });
  const ac = await store("ana@exemplo.com", { owner: "Ana C.", name: "Ana Costa", kind: "PROFISSIONAL", document: "000.000.000-01", city: "Rio de Janeiro, RJ", bio: "Consultora em LGPD e ISO/IEC 27001. Implementação e preparação para auditoria.", credentials: "ISO 27001 Lead Implementer · DPO", verified: true });
  await store("novo@exemplo.com", { owner: "Nova Loja", name: "Guardião Tech", kind: "EMPRESA", document: "33.333.333/0001-33", city: "Recife, PE", bio: "Loja aguardando aprovação.", status: "PENDING" });

  const L = [
    // Secure Privacy — serviços
    [sp, "Red Team e Pentest", "SERVICE", "Operação Red Team completa", "Simulação de adversário real com vetores lógicos, físicos e sociais, orientada a objetivo.", null, "projeto", true, null, true, [["Duração", "4 a 8 semanas"], ["Vetores", "Lógico · Físico · Social"], ["Framework", "MITRE ATT&CK"], ["Entrega", "Relatório executivo + técnico + reteste"]]],
    [sp, "Proteção Executiva", "SERVICE", "Pessoa Sombra — proteção discreta", "Operador de proteção executiva integrado ao ambiente, sem ser identificado como parte da equipe.", 380000, "dia", true, null, true, [["Equipe", "1 operador + base remota"], ["Comunicação", "Criptografada"], ["Contratação", "Diária ou pacote"], ["Sigilo", "NDA"]]],
    [sp, "Red Team e Pentest", "SERVICE", "Pentest de aplicação web", "Teste de intrusão em aplicação web seguindo OWASP, com relatório e reteste incluso.", 1450000, "projeto", false, null, false, [["Escopo", "1 aplicação até 40 endpoints"], ["Metodologia", "OWASP WSTG"], ["Prazo", "10 dias úteis"], ["Reteste", "Incluso"]]],
    [sp, "Investigação Corporativa", "SERVICE", "Diagnóstico de exposição digital (OSINT)", "Mapeamento do que está público sobre a empresa e seus executivos, com plano de redução.", 690000, "projeto", false, null, false, [["Alvos", "Empresa + até 5 executivos"], ["Prazo", "7 dias úteis"], ["Entrega", "Relatório confidencial"]]],
    // Vértice — físicos
    [vt, "CFTV e Câmeras", "PHYSICAL", "Câmera IP 4K com IA de detecção", "Detecção de pessoas e veículos, visão noturna colorida e gravação criptografada.", 129900, "un", false, 42, true, [["Resolução", "8 MP (4K)"], ["Visão noturna", "30 m colorida"], ["Proteção", "IP67"], ["Garantia", "2 anos"]]],
    [vt, "Controle de Acesso", "PHYSICAL", "Fechadura biométrica com credencial criptografada", "Digital, senha e cartão com criptografia anti-clonagem. Registro de acessos.", 189000, "un", false, 18, false, [["Métodos", "Digital · Senha · Cartão"], ["Cartão", "MIFARE DESFire EV3"], ["Registros", "100.000 eventos"]]],
    [vt, "Alarmes e Pânico", "PHYSICAL", "Botão de pânico portátil com GPS", "Acionamento discreto com envio de localização para até 5 contatos e central.", 59900, "un", false, 60, false, [["Bateria", "7 dias"], ["Conectividade", "4G + GPS"], ["Tamanho", "4 cm"]]],
    [vt, "Rastreamento", "PHYSICAL", "Rastreador veicular com bloqueio remoto", "Rastreamento em tempo real e bloqueio pelo aplicativo. Instalação inclusa nas capitais.", 74900, "un", false, 35, false, [["Atualização", "10 s"], ["Bloqueio", "Remoto"], ["Plano", "Mensalidade à parte"]]],
    [vt, "Cofres e Proteção Física", "PHYSICAL", "Cofre eletrônico corta-fogo 60 min", "Proteção contra fogo e arrombamento, fechadura eletrônica com auditoria.", 349000, "un", false, 6, false, [["Resistência ao fogo", "60 min"], ["Capacidade", "45 L"], ["Peso", "62 kg"]]],
    [vt, "Contravigilância", "PHYSICAL", "Detector profissional de RF e lentes", "Varredura de radiofrequência e detecção óptica de câmeras ocultas em salas de reunião.", 289000, "un", false, 9, true, [["Faixa", "1 MHz – 12 GHz"], ["Detecção óptica", "Sim"], ["Uso", "Varredura de ambientes"]]],
    // Cofre Digital — digitais
    [cd, "Software e Licenças", "DIGITAL", "Gerenciador de senhas corporativo — 25 usuários", "Cofre de senhas com SSO, auditoria e compartilhamento seguro entre equipes.", 189000, "ano", false, null, false, [["Usuários", "25"], ["SSO", "SAML / OIDC"], ["Entrega", "Licença por e-mail"]]],
    [cd, "Cursos e Treinamentos", "DIGITAL", "Treinamento antiphishing para equipes", "Trilha de conscientização com simulações e relatórios de evolução por departamento.", 9900, "usuário", false, null, true, [["Formato", "Online"], ["Duração", "6 módulos"], ["Certificado", "Sim"]]],
    [cd, "Cursos e Treinamentos", "DIGITAL", "Segurança pessoal para executivos", "Curso reservado sobre exposição digital, viagens e engenharia social direcionada.", 149000, "licença", false, null, false, [["Formato", "Online + 1 sessão ao vivo"], ["Duração", "8 h"]]],
    // Profissionais
    [lf, "Pentesters", "PROFESSIONAL", "Pentest de API (hora técnica)", "Avaliação de APIs REST e GraphQL: autenticação, autorização e lógica de negócio.", 32000, "hora", false, null, true, [["Experiência", "8 anos"], ["Foco", "Web · API"], ["Disponibilidade", "Imediata"]]],
    [ac, "Consultores", "PROFESSIONAL", "Adequação à LGPD para PMEs", "Mapeamento de dados, políticas, ROPA e treinamento da equipe.", null, "projeto", true, null, false, [["Prazo médio", "6 semanas"], ["Entrega", "Documentação + treinamento"]]],
    [ac, "Consultores", "PROFESSIONAL", "Preparação para ISO/IEC 27001", "Gap analysis, SGSI e acompanhamento até a auditoria de certificação.", 28000, "hora", false, null, false, [["Certificação", "Lead Implementer"], ["Formato", "Remoto ou presencial"]]]
  ];

  const made = [];
  for (const [st, cat, type, title, summary, priceCents, priceUnit, requiresQuote, stock, featured, specs] of L) {
    made.push(await db.listing.create({ data: {
      storeId: st.id, categoryId: C[cat].id, type, title, slug: slug(title), summary,
      description: summary + "\n\nTodos os anúncios passam por curadoria antes da publicação. O vendedor é verificado e responde por emissão de nota fiscal e garantia.",
      specs: JSON.stringify(specs), priceCents, priceUnit, requiresQuote, stock, featured, status: "ACTIVE"
    } }));
  }
  await db.listing.create({ data: { storeId: vt.id, categoryId: C["CFTV e Câmeras"].id, type: "PHYSICAL", title: "Kit 4 câmeras + gravador NVR", slug: "kit-4-cameras-nvr", summary: "Kit completo para pequenas empresas.", description: "Aguardando curadoria.", priceCents: 359000, stock: 10, status: "PENDING" } });

  const reviews = [[made[4], buyer, 5, "Imagem excelente à noite e o app é estável."], [made[4], reviewer2, 4, "Ótima câmera, instalação simples."], [made[2], buyer, 5, "Relatório muito claro, o reteste fez diferença."], [made[13], reviewer2, 5, "Encontrou falhas de autorização que nosso time não via."]];
  for (const [l, u, rating, comment] of reviews) await db.review.create({ data: { listingId: l.id, userId: u.id, rating, comment } });

  console.log("Seed concluído. Contas (senha: senha123): admin@exemplo.com · vendedor@exemplo.com · cliente@exemplo.com");
}
main().finally(() => db.$disconnect());
