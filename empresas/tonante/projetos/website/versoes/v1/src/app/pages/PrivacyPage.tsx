import { LegalPageLayout } from "./LegalPageLayout";

const sections = [
  {
    id: "coleta",
    heading: "Dados que coletamos",
    body: [
      "Coletamos os dados que você nos fornece diretamente ao criar uma conta, finalizar uma compra ou entrar em contato com a gente, como nome, CPF, e-mail e endereço de entrega. Essas informações são essenciais para identificar você e concluir os serviços solicitados.",
      "Também coletamos dados de navegação de forma automática enquanto você usa o site, como endereço IP, tipo de dispositivo, navegador utilizado e as páginas visitadas. Esses dados nos ajudam a entender como a loja é usada e a manter tudo funcionando com segurança.",
    ],
  },
  {
    id: "uso",
    heading: "Como usamos seus dados",
    body: [
      "Usamos seus dados para criar e gerenciar o seu cadastro, processar pedidos e pagamentos e manter você informado sobre o andamento das suas compras. Sem essas informações, não conseguiríamos entregar os produtos até você.",
      "Os dados de navegação também são utilizados para melhorar a experiência do site, personalizar o que você vê e reforçar a segurança da plataforma, identificando comportamentos suspeitos e prevenindo fraudes.",
    ],
  },
  {
    id: "compartilhamento",
    heading: "Compartilhamento de dados",
    body: [
      "Seus dados são compartilhados apenas com parceiros essenciais para concluir o seu pedido: processadores de pagamento, transportadoras responsáveis pela entrega e serviços de hospedagem em nuvem que mantêm a loja no ar.",
      "Todos esses parceiros tratam os dados com responsabilidade e dentro do necessário para prestar o serviço. A PCYES não vende nem comercializa seus dados pessoais em nenhuma hipótese.",
    ],
  },
  {
    id: "seguranca",
    heading: "Segurança",
    body: [
      "A PCYES adota medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito e controles de acesso restritos às informações.",
      "Nenhum sistema é totalmente imune a riscos, mas trabalhamos continuamente para revisar e fortalecer nossas práticas de segurança e proteger as informações que você confia à gente.",
    ],
  },
  {
    id: "direitos",
    heading: "Seus direitos",
    body: [
      "Você tem o direito de solicitar acesso, correção, exclusão ou portabilidade dos seus dados pessoais a qualquer momento. Também pode pedir esclarecimentos sobre como suas informações são tratadas.",
      "Para exercer qualquer um desses direitos, basta entrar em contato com o nosso suporte pelos canais indicados ao final desta página.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies",
    body: [
      "O site utiliza cookies para garantir o funcionamento correto das páginas e personalizar a sua experiência de navegação, lembrando preferências e mantendo o seu carrinho ativo.",
      "Os cookies essenciais não podem ser desativados, pois são necessários para o site operar. Os demais cookies podem ser gerenciados a qualquer momento nas configurações do seu navegador.",
    ],
  },
  {
    id: "contato",
    heading: "Fale com a gente",
    body: [
      "Ficou com alguma dúvida sobre privacidade ou sobre o tratamento dos seus dados? Nossa equipe está pronta para ajudar pelos canais abaixo:",
      "- E-mail: sac@pcyes.com.br",
      "- WhatsApp: (44) 2101-1414",
    ],
  },
];

export function PrivacyPage() {
  return (
    <LegalPageLayout
      badge="PRIVACIDADE"
      title="Política de Privacidade"
      updatedAt="06 de outubro de 2025"
      intro="Na PCYES, a transparência é um valor inegociável. Esta política explica de forma clara como os seus dados pessoais são coletados, utilizados e protegidos quando você navega pela nossa loja."
      sections={sections}
    />
  );
}
