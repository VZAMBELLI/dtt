export const metadata = { title: "Curadoria e itens proibidos" };

const proibidos = [
  "Bloqueadores de sinal (jammers) de celular, GPS ou Wi-Fi: venda e uso proibidos pela Anatel.",
  "Equipamentos para interceptar comunicações, grampos telefônicos ou captura de mensagens de terceiros.",
  "Spyware, stalkerware ou qualquer software para monitorar pessoas sem o consentimento delas.",
  "Escutas e câmeras disfarçadas oferecidas para gravar pessoas sem que elas saibam.",
  "Armas de fogo, munições, armas de choque e itens controlados pelo Exército.",
  "Malware, exploits à venda, credenciais vazadas, bases de dados pessoais ou serviços de invasão sem autorização do alvo.",
  "Produtos sem homologação da Anatel quando ela for obrigatória (rádios, rastreadores, transmissores)."
];
const regras = [
  "Todo vendedor passa por verificação de identidade (CPF ou CNPJ) antes de publicar.",
  "Todo anúncio passa por curadoria antes de ficar público. Alterações voltam para análise.",
  "Serviços de segurança privada (vigilância, escolta, segurança pessoal) exigem autorização da Polícia Federal.",
  "Serviços ofensivos (pentest, Red Team, engenharia social) só podem ser executados com autorização formal e escopo assinado pelo contratante.",
  "Vendedores emitem nota fiscal e respondem pela garantia dos produtos.",
  "Anúncios ou lojas que descumprirem estas regras são removidos e podem ser suspensos."
];

export default function Politica() {
  return (
    <div className="wrap section" style={{ maxWidth: 860 }}>
      <span className="eyebrow">Confiança</span>
      <h1 className="page-title">Curadoria e itens proibidos</h1>
      <p className="dim" style={{ fontSize: 17 }}>Um marketplace de segurança só funciona se for confiável. Por isso tudo o que é vendido aqui passa por análise, e algumas categorias não são aceitas em nenhuma hipótese.</p>
      <h2 style={{ fontSize: 22, margin: "36px 0 12px" }}>Regras para vendedores</h2>
      <ul className="dim" style={{ paddingLeft: 20, display: "grid", gap: 8 }}>{regras.map(r => <li key={r}>{r}</li>)}</ul>
      <h2 style={{ fontSize: 22, margin: "36px 0 12px" }}>Itens e serviços proibidos</h2>
      <ul className="dim" style={{ paddingLeft: 20, display: "grid", gap: 8 }}>{proibidos.map(r => <li key={r}>{r}</li>)}</ul>
      <p className="alert alert--info" style={{ marginTop: 32 }}>Encontrou algo que viola estas regras? Avise a equipe de curadoria pelo canal de contato.</p>
    </div>
  );
}
