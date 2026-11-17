export type Level = "essencial" | "reforcado" | "critico";

export const LEVELS: { id: Level; name: string; who: string; text: string }[] = [
  { id: "essencial", name: "Essencial", who: "Pessoa · pequeno negócio", text: "Senhas, criptografia e atualizações. Barra a maioria dos ataques comuns." },
  { id: "reforcado", name: "Reforçado", who: "Empresa", text: "Chave física, EDR, controle de acesso cifrado e pentest." },
  { id: "critico", name: "Crítico", who: "Executivos · dados críticos", text: "Red Team, contravigilância e proteção executiva." }
];

const t = (title: string, d: string, level: Level) => ({ t: title, d, level });
export const LAYERS: { n: string; name: string; idea: string; q: string; tech: { t: string; d: string; level: Level }[] }[] = [
  { n: "L1", name: "Identidade", q: "senha", idea: "Quem pode entrar e como.", tech: [
    t("Gerenciador de senhas", "AES-256, senha única por serviço.", "essencial"),
    t("Chave FIDO2 / passkey", "MFA que phishing não engana.", "reforcado"),
    t("Privilégio mínimo", "Admin separado do uso diário.", "critico")] },
  { n: "L2", name: "Dispositivos", q: "software", idea: "Perdeu o aparelho, os dados continuam seus.", tech: [
    t("Criptografia de disco", "BitLocker, FileVault, LUKS.", "essencial"),
    t("Atualização automática", "Fecha falhas já conhecidas.", "essencial"),
    t("EDR + MDM", "Detecção, bloqueio e apagamento remoto.", "reforcado")] },
  { n: "L3", name: "Comunicação", q: "treinamento", idea: "Só quem conversa lê.", tech: [
    t("Criptografia ponta a ponta", "Protocolo Signal.", "essencial"),
    t("SPF, DKIM, DMARC", "Ninguém envia e-mail em seu nome.", "reforcado"),
    t("Rede segmentada + varredura de RF", "VLANs, 802.1X, salas limpas.", "critico")] },
  { n: "L4", name: "Físico", q: "câmera", idea: "Quem entra no prédio passa por cima do resto.", tech: [
    t("Alarme + pânico silencioso", "IP + 4G, com localização.", "essencial"),
    t("Acesso com cartão cifrado", "DESFire EV3. Não clona.", "reforcado"),
    t("CFTV com gravação cifrada", "Rede isolada, sem porta aberta.", "reforcado")] },
  { n: "L5", name: "Pessoas", q: "proteção", idea: "O golpe mira quem opera.", tech: [
    t("Treinamento antiphishing", "Simulações com métrica.", "essencial"),
    t("Diagnóstico OSINT", "O que já está público sobre você.", "reforcado"),
    t("Red Team + proteção executiva", "Teste real e operador em campo.", "critico")] }
];

export const RANK: Record<Level, number> = { essencial: 0, reforcado: 1, critico: 2 };
