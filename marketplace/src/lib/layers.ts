export type Level = "essencial" | "reforcado" | "critico";

export const LEVELS: { id: Level; name: string; who: string; text: string }[] = [
  { id: "essencial", name: "Essencial", who: "Pessoa física · pequeno negócio",
    text: "Higiene de credenciais, criptografia em repouso e em trânsito, atualização contínua. Cobre a maior parte dos vetores oportunistas: phishing, reuso de senha, perda de dispositivo." },
  { id: "reforcado", name: "Reforçado", who: "Empresa · profissional exposto",
    text: "Autenticação resistente a phishing, gestão centralizada de endpoints, autenticação de domínio e controles físicos auditáveis. Inclui validação periódica por pentest." },
  { id: "critico", name: "Crítico", who: "Executivos · ativos críticos",
    text: "Modelo de ameaça com adversário direcionado. Privilégio segregado, contravigilância, simulação de ataque completa (TTPs mapeadas no MITRE ATT&CK) e proteção executiva." }
];

export const LAYERS: {
  n: string; name: string; idea: string; tech: { t: string; d: string; level: Level }[]; q: string;
}[] = [
  { n: "L1", name: "Identidade e acesso", q: "senha",
    idea: "Credenciais comprometidas seguem como o vetor inicial mais comum. O controle começa em quem pode se autenticar e como.",
    tech: [
      { t: "Gerenciador de senhas com cofre cifrado", d: "Senhas únicas de alta entropia; cofre cifrado localmente (AES-256) com arquitetura zero-knowledge.", level: "essencial" },
      { t: "MFA resistente a phishing (FIDO2/WebAuthn)", d: "Chaves de hardware e passkeys vinculadas à origem: não funcionam em domínio falso. Substituem SMS e OTP.", level: "reforcado" },
      { t: "Privilégio mínimo e contas segregadas", d: "Contas administrativas separadas, acesso just-in-time e revisão periódica de permissões.", level: "critico" }
    ] },
  { n: "L2", name: "Endpoints", q: "software",
    idea: "Notebooks e celulares concentram credenciais, sessões e dados. A premissa é que serão perdidos, furtados ou atacados.",
    tech: [
      { t: "Criptografia de disco completa", d: "BitLocker, FileVault ou LUKS (AES-XTS) com chave protegida por TPM ou Secure Enclave.", level: "essencial" },
      { t: "Patch management automatizado", d: "Correção contínua de SO e aplicações; a maioria das explorações usa CVEs com correção já publicada.", level: "essencial" },
      { t: "EDR + MDM", d: "Detecção comportamental, isolamento remoto, políticas de configuração e wipe em caso de perda.", level: "reforcado" }
    ] },
  { n: "L3", name: "Comunicação e rede", q: "treinamento",
    idea: "O que trafega deve permanecer confidencial e autêntico, independentemente da rede por onde passa.",
    tech: [
      { t: "Criptografia de ponta a ponta", d: "Mensageria com protocolo Signal (Double Ratchet, forward secrecy). O servidor não tem acesso ao conteúdo.", level: "essencial" },
      { t: "Autenticação de domínio: SPF, DKIM, DMARC", d: "DMARC em p=reject impede spoofing do seu domínio em campanhas de phishing.", level: "reforcado" },
      { t: "Segmentação e contravigilância", d: "VLANs isolando CFTV e IoT, 802.1X na rede interna e varredura de RF e óptica em salas sensíveis.", level: "critico" }
    ] },
  { n: "L4", name: "Perímetro físico", q: "câmera",
    idea: "Controles lógicos dependem de controles físicos. Acesso físico a um ativo frequentemente anula as demais camadas.",
    tech: [
      { t: "Alarme monitorado e pânico silencioso", d: "Sensores com supervisão de linha, comunicação redundante (IP + 4G) e acionamento discreto com geolocalização.", level: "essencial" },
      { t: "Controle de acesso com credencial cifrada", d: "MIFARE DESFire EV3 (AES-128) em vez de 125 kHz ou MIFARE Classic, que são clonáveis em segundos.", level: "reforcado" },
      { t: "CFTV com gravação local cifrada", d: "NVR em rede segregada, streams via TLS, sem portas expostas à internet e com retenção definida.", level: "reforcado" }
    ] },
  { n: "L5", name: "Pessoas e processos", q: "proteção",
    idea: "Engenharia social contorna controles técnicos. Exposição pública alimenta ataques direcionados. Processos definem a resposta.",
    tech: [
      { t: "Conscientização com simulação de phishing", d: "Treinamento contínuo com métricas de clique e reporte por área.", level: "essencial" },
      { t: "Diagnóstico de exposição (OSINT)", d: "Levantamento de dados públicos, vazamentos e pegada digital de empresa e executivos, com plano de redução.", level: "reforcado" },
      { t: "Red Team e proteção executiva", d: "Simulação de adversário com escopo e RoE assinados, e operador de proteção em agendas de risco.", level: "critico" }
    ] }
];

export const RANK: Record<Level, number> = { essencial: 0, reforcado: 1, critico: 2 };
