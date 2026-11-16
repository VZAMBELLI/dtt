export type Level = "essencial" | "reforcado" | "critico";

export const LEVELS: { id: Level; name: string; who: string; text: string }[] = [
  { id: "essencial", name: "Essencial", who: "Para a vida e o trabalho de todo dia",
    text: "A maior parte dos riscos se resolve com hábitos simples e ferramentas bem escolhidas. Não é preciso muito. É preciso começar." },
  { id: "reforcado", name: "Reforçado", who: "Para quem tem mais a proteger",
    text: "Empresas, profissionais expostos, famílias com patrimônio. Aqui as camadas físicas entram, e vale a pena testar o que já existe." },
  { id: "critico", name: "Crítico", who: "Para quando um erro custa caro demais",
    text: "Negociações sensíveis, executivos, dados que não podem vazar. Cada camada é reforçada e verificada por quem pensa como um adversário." }
];

export const LAYERS: {
  n: string; name: string; idea: string; tech: { t: string; d: string; level: Level }[]; q: string;
}[] = [
  { n: "01", name: "Identidade", q: "senha",
    idea: "Quase todo acesso indevido começa com alguém se passando por você. Proteger quem você é vem antes de proteger o que você tem.",
    tech: [
      { t: "Gerenciador de senhas", d: "Uma senha longa e diferente para cada lugar, sem precisar decorar nenhuma.", level: "essencial" },
      { t: "Chaves de segurança FIDO2 e passkeys", d: "Autenticação que não pode ser copiada nem enganada por um site falso.", level: "reforcado" },
      { t: "Contas separadas por função", d: "O que é administrativo não se mistura com o uso diário.", level: "critico" }
    ] },
  { n: "02", name: "Dispositivos", q: "software",
    idea: "Seu celular e seu computador carregam a sua vida inteira. Se um deles se perde, o que está dentro deve continuar seu.",
    tech: [
      { t: "Criptografia de disco completa", d: "Sem a sua chave, os dados são apenas ruído.", level: "essencial" },
      { t: "Atualizações automáticas", d: "A maior parte das falhas exploradas já tinha correção disponível.", level: "essencial" },
      { t: "EDR e gestão de dispositivos", d: "Detecção de comportamento anômalo e resposta em equipamentos da empresa.", level: "reforcado" }
    ] },
  { n: "03", name: "Comunicação", q: "treinamento",
    idea: "Uma conversa privada deveria continuar privada. Isso não depende de confiança. Depende de matemática.",
    tech: [
      { t: "Criptografia de ponta a ponta", d: "Mensagens e chamadas que só quem participa consegue ler.", level: "essencial" },
      { t: "Proteção de domínio e e-mail", d: "SPF, DKIM e DMARC impedem que alguém envie mensagens em seu nome.", level: "reforcado" },
      { t: "Varredura de ambientes", d: "Verificação de RF e óptica antes de reuniões que não podem ser ouvidas.", level: "critico" }
    ] },
  { n: "04", name: "Ambiente físico", q: "câmera",
    idea: "Toda proteção digital termina numa porta, numa sala, num cofre. O mundo físico ainda é onde muita coisa acontece.",
    tech: [
      { t: "Controle de acesso com credencial criptografada", d: "Cartões que não podem ser clonados com um leitor barato.", level: "reforcado" },
      { t: "CFTV com gravação criptografada", d: "Imagens guardadas sob o seu controle, não expostas na internet.", level: "reforcado" },
      { t: "Cofres e alarmes com pânico silencioso", d: "Proteção que funciona mesmo quando você não pode pedir ajuda em voz alta.", level: "essencial" }
    ] },
  { n: "05", name: "Pessoas e rotina", q: "proteção",
    idea: "A camada mais importante é também a mais humana. Saber o que está exposto sobre você já muda a forma como você se move.",
    tech: [
      { t: "Diagnóstico de exposição (OSINT)", d: "Descobrir o que qualquer pessoa já consegue saber sobre você ou sua empresa.", level: "reforcado" },
      { t: "Treinamento contra engenharia social", d: "Pessoas preparadas reconhecem o golpe antes que ele funcione.", level: "essencial" },
      { t: "Red Team e proteção executiva", d: "Testar tudo sob pressão real e ter alguém atento quando a situação pede.", level: "critico" }
    ] }
];

export const RANK: Record<Level, number> = { essencial: 0, reforcado: 1, critico: 2 };
