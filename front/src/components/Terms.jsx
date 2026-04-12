const sections = [
  {
    id: "definicoes",
    number: "1",
    title: "Definições",
    content: [
      {
        type: "list",
        items: [
          { term: "Eldur", definition: "O website acessível pela internet, desenvolvido para gerenciamento de bares, lanchonetes, restaurantes, pizzarias e demais segmentos do ramo de alimentação." },
          { term: "Usuário Responsável", definition: "A pessoa que cria uma conta para gerenciar seu próprio estabelecimento (o dono do negócio) na plataforma." },
          { term: "Usuário Cliente", definition: "A pessoa que acessa os estabelecimentos cadastrados para ver cardápios, fazer pedidos e usar os serviços." },
          { term: "Atualização", definition: "Novas funcionalidades ou correções no site, feitas para melhorar o funcionamento ou se adequar à legislação." },
          { term: "Plano de Assinatura", definition: "Forma de acesso pago ao site." },
          { term: "Banco de dados", definition: "Conjunto organizado de informações que armazena os dados usados no site." },
        ],
      },
    ],
  },
  {
    id: "acesso",
    number: "2",
    title: "Acesso à Plataforma",
    content: [
      {
        type: "paragraph",
        text: "Acesso de Teste: Permite ao Usuário Responsável testar todas as funcionalidades do site sem nenhum custo por 15 dias. Todas as partes do site ficam disponíveis sem limite de cadastros. O acesso de teste funciona em qualquer computador com sistema operacional e navegador de internet devidamente atualizado. Esta versão pode mostrar \"Versão de Teste\" em alguns relatórios. Ao final dos 15 dias, para continuar usando o Eldur o Usuário Responsável deve escolher um Plano de Assinatura.",
      },
      {
        type: "alert",
        label: "É proibido:",
        items: [
          "Criar mais de uma conta de teste ou de Plano de Assinatura para o mesmo estabelecimento;",
          "Cancelar pagamento após o teste (isso pode configurar estelionato);",
          "Compartilhar com outras pessoas dados pessoais de clientes, parceiros ou fornecedores que apareçam no site.",
        ],
      },
    ],
  },
  {
    id: "responsabilidades-provedor",
    number: "3",
    title: "Responsabilidades do Provedor",
    content: [
      {
        type: "numbered",
        items: [
          "Manter o site atualizado, especialmente em relação a mudanças na legislação ou melhorias necessárias para o bom funcionamento.",
          "Funcionamento do site: nenhum sistema online funciona 100% do tempo sem interrupção. O site pode ficar fora do ar por manutenção, atualizações, problemas técnicos ou situações fora do nosso controle como falhas de internet de terceiros, ataques cibernéticos etc. Não garantimos funcionamento ininterrupto.",
          "Corrigir erros do site quando eles forem causados por falha nossa na criação ou manutenção.",
          "Sugestões de melhorias enviadas pelo Usuário Responsável serão analisadas, mas não temos obrigação de implementá-las.",
          "Oferecer suporte técnico para dúvidas e problemas do site. O suporte pode ser por WhatsApp, e-mail ou telefone. Horário: das 10h às 22h, de segunda a sábado, com exceção da quinta-feira que vai de 10h até 18h. Não fazemos treinamentos pelo suporte.",
          "O Provedor não é responsável por danos diretos ou indiretos, técnicos, econômicos ou fiscais, tais como perdas e danos, lucros cessantes, interrupção de negócios, perda de informações, ou outros prejuízos decorrentes de uso ou da impossibilidade de uso do site.",
          "Manter domínio para estabelecimentos que tenham plano pago. O nome do domínio é escolhido pelo Usuário Responsável, desde que esteja disponível.",
          "Cumprir a Lei Geral de Proteção de Dados (LGPD) quanto ao sigilo, segurança e confidencialidade dos dados pessoais.",
        ],
      },
    ],
  },
  {
    id: "responsabilidades-usuario",
    number: "4",
    title: "Responsabilidades do Usuário Responsável",
    content: [
      {
        type: "numbered",
        items: [
          "O Usuário Responsável assume total responsabilidade pelos resultados obtidos com o uso do site, inclusive por vírus, falhas de operação ou uso por pessoas não autorizadas, e por decisões tomadas com base nas informações do site.",
          "Manter sua conta atualizada e usar sempre a versão mais recente do site.",
          "Manter em sigilo seu e-mail e senha de acesso.",
          "Pagar e renovar os planos de assinatura no prazo. A falta de pagamento pode bloquear o acesso ao site e aos recursos adicionais.",
          "Fazer cópias de segurança dos seus dados quando possível e guardá-las em local seguro.",
          "O Usuário Responsável é responsável por todo conteúdo que publicar, inclusive imagens enviadas. As imagens são armazenadas no Cloudinary (serviço de terceiros). O Usuário Responsável deve ter certeza de que as imagens não violam direitos de terceiros.",
          "Fornecer, quando solicitado, informações completas para o suporte resolver problemas. Sem informações suficientes, pode ser impossível corrigir o erro.",
          "Consentir que o site se conecte a serviços de terceiros (como apps de delivery) para integrar pedidos.",
          "Cumprir a Lei Geral de Proteção de Dados (LGPD) quanto ao sigilo e segurança dos dados pessoais de clientes, parceiros e fornecedores que ele cadastrar ou receber no site.",
        ],
      },
    ],
  },
  {
    id: "reajuste",
    number: "5",
    title: "Reajuste",
    content: [
      {
        type: "paragraph",
        text: "O valor dos planos de assinatura pode ser reajustado pelo Provedor a qualquer momento.",
      },
    ],
  },
  {
    id: "propriedade",
    number: "6",
    title: "Direitos de Propriedade",
    content: [
      {
        type: "numbered",
        items: [
          "O Provedor é dono de todos os direitos sobre o site Eldur.",
          "O Usuário Cliente recebe apenas o direito de usar o site após fazer o cadastro.",
          "O Usuário Responsável recebe apenas o direito de usar o site durante o plano de assinatura.",
          "É proibido copiar, alterar, vender, fazer engenharia reversa, fazer teste de penetração ou usar o site de qualquer outra forma que não seja o uso normal.",
          "Estes termos podem ser alterados pelo Provedor a qualquer momento. As mudanças valem a partir da publicação no site Eldur.",
        ],
      },
    ],
  },
  {
    id: "pedidos",
    number: "7",
    title: "Pedidos Online",
    content: [
      {
        type: "numbered",
        items: [
          "Escolha do domínio: O Usuário Responsável escolhe o nome do domínio respeitando as regras de disponibilidade. É liberado um domínio por estabelecimento.",
          "Alteração do domínio: Pode ser solicitada pelo suporte, após verificar disponibilidade.",
          "Perda do domínio: Se a assinatura paga não for renovada, o domínio e os dados são excluídos após 7 dias. O Usuário Responsável abre mão de qualquer direito sobre o domínio e não pode pedir indenização.",
          "Capacidade de armazenamento: É oferecido limite de armazenamento para cada estabelecimento. Se exceder, o Provedor pode cobrar o custo extra.",
          "Responsabilidade por conteúdo: Todo conteúdo publicado e qualquer ato ilegal feito através do domínio é de responsabilidade exclusiva do Usuário Responsável.",
        ],
      },
    ],
  },
  {
    id: "niveis-cadastro",
    number: "8",
    title: "Níveis de Cadastro na Área de Pedidos",
    content: [
      {
        type: "paragraph",
        text: "O Usuário Cliente pode criar uma conta informando apenas nome, senha e telefone.",
      },
      {
        type: "paragraph",
        text: "O cadastro do Usuário Cliente permite APENAS as seguintes ações:",
      },
      {
        type: "bullets",
        items: [
          "Criar e manter sua conta pessoal;",
          "Visualizar cardápios dos estabelecimentos;",
          "Fazer pedidos online;",
          "Acessar o histórico dos seus próprios pedidos.",
        ],
      },
      {
        type: "alert",
        label: "O Usuário Cliente NÃO pode:",
        items: [
          "Gerenciar estabelecimentos ou cadastrar produtos;",
          "Emitir notas fiscais ou alterar configurações do site;",
          "Acessar dados de outros usuários;",
          "Usar qualquer funcionalidade destinada ao Usuário Responsável ou Administradores.",
        ],
      },
    ],
  },
  {
    id: "nao-inclusos",
    number: "9",
    title: "Serviços Não Inclusos",
    content: [
      {
        type: "paragraph",
        text: "Não estão inclusos (e podem ser cobrados à parte, se solicitados):",
      },
      {
        type: "numbered",
        items: [
          "Recuperação de dados perdidos por erro do usuário, vírus ou falha de equipamento.",
          "Treinamento de funcionários ou equipe.",
          "Integração manual com apps de delivery (o Usuário Responsável deve fazer).",
          "Digitação completa de cardápio.",
        ],
      },
    ],
  },
  {
    id: "foro",
    number: "10",
    title: "Do Foro",
    content: [
      {
        type: "paragraph",
        text: "Fica eleito o Fórum da Comarca de Duque de Caxias - RJ para resolver qualquer dúvida sobre este documento, com renúncia a qualquer outro foro.",
      },
    ],
  },
];

const privacySections = [
  {
    id: "dados-coletados",
    number: "11.1",
    title: "Dados que Coletamos",
    content: [
      {
        type: "list",
        items: [
          { term: "Usuário Responsável", definition: "Nome, e-mail, telefone, dados do estabelecimento, senha, imagens enviadas e qualquer outro dado necessário para o funcionamento do sistema." },
          { term: "Usuário Cliente", definition: "Nome, telefone, e-mail, endereço para entrega, dados de pedidos e qualquer outro dado necessário para o funcionamento do sistema." },
          { term: "Dados de uso", definition: "Como você navega no site (páginas visitadas, tempo de uso)." },
        ],
      },
    ],
  },
  {
    id: "uso-dados",
    number: "11.2",
    title: "Como Usamos os Dados",
    content: [
      {
        type: "bullets",
        items: [
          "Para criar e gerenciar sua conta e o estabelecimento.",
          "Para processar pedidos, pagamentos e entregas.",
          "Para oferecer suporte e enviar atualizações importantes.",
          "Para melhorar o site e oferecer promoções (só com seu consentimento quando exigido por lei).",
        ],
      },
    ],
  },
  {
    id: "compartilhamento",
    number: "11.3",
    title: "Compartilhamento de Dados",
    content: [
      {
        type: "bullets",
        items: [
          "Imagens enviadas pelo Usuário Responsável são armazenadas no Cloudinary, um servidor de terceiros com sua própria política de privacidade.",
          "Podemos compartilhar dados com serviços de pagamento, apps de delivery integrados ou autoridades, quando exigido por lei.",
          "Não vendemos seus dados pessoais para fins de marketing.",
        ],
      },
    ],
  },
  {
    id: "seus-direitos",
    number: "11.4",
    title: "Seus Direitos (LGPD)",
    content: [
      {
        type: "paragraph",
        text: "Você pode pedir a qualquer momento: acesso aos seus dados, correção, exclusão, revogação de consentimento ou portabilidade. Basta entrar em contato pelo suporte ou e-mail oficial do site. Responderemos em até 15 dias.",
      },
    ],
  },
  {
    id: "seguranca",
    number: "11.5",
    title: "Segurança",
    content: [
      {
        type: "paragraph",
        text: "Usamos medidas técnicas e administrativas para proteger seus dados. No entanto, nenhum sistema é 100% seguro. Em caso de incidente, avisaremos conforme a lei.",
      },
    ],
  },
  {
    id: "retencao",
    number: "11.6",
    title: "Retenção de Dados",
    content: [
      {
        type: "paragraph",
        text: "Guardamos os dados apenas enquanto necessário para o serviço ou por obrigação legal. Após o fim do plano, os dados podem ser excluídos após o período de backup.",
      },
    ],
  },
  {
    id: "cookies",
    number: "11.7",
    title: "Cookies e Tecnologias Semelhantes",
    content: [
      {
        type: "paragraph",
        text: "O site pode usar cookies para manter você logado, lembrar preferências e analisar uso.",
      },
    ],
  },
  {
    id: "propriedade-intelectual",
    number: "12",
    title: "Propriedade Intelectual e Propriedade dos Dados",
    content: [
      {
        type: "bullets",
        items: [
          "Todo o software, código-fonte, design, marca, textos e demais elementos da plataforma Eldur são de propriedade exclusiva da Eldur, protegidos pela Lei de Direitos Autorais (Lei nº 9.610/1998) e pela Lei de Propriedade Industrial (Lei nº 9.279/1996).",
          "O Usuário Estabelecimento é o único titular dos dados que insere ou gera na plataforma (cardápios, preços, imagens, histórico de pedidos, relatórios etc.).",
          "A Eldur atua exclusivamente como Operadora desses dados, não podendo utilizá-los para finalidade diversa da prestação do serviço contratado.",
          "A Eldur pode utilizar dados anonimizados e agregados — sem identificação de nenhum usuário específico — para fins de melhoria da plataforma e análise estatística interna.",
        ],
      },
    ],
  },
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function renderContent(block, index) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="text-gray-600 leading-relaxed">
          {block.text}
        </p>
      );

    case "numbered":
      return (
        <ol key={index} className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      );

    case "bullets":
      return (
        <ul key={index} className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-gray-600">
              <CheckIcon />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "alert":
      return (
        <div key={index} className="bg-red-50 border border-red-100 rounded-xl p-5">
          <p className="font-semibold text-red-700 mb-3">{block.label}</p>
          <ul className="space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-700">
                <XIcon />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "list":
      return (
        <dl key={index} className="space-y-4">
          {block.items.map((item, i) => (
            <div key={i} className="border-l-2 border-red-700 pl-4">
              <dt className="font-semibold text-gray-900">{item.term}</dt>
              <dd className="text-gray-600 mt-1 leading-relaxed">{item.definition}</dd>
            </div>
          ))}
        </dl>
      );

    default:
      return null;
  }
}

function SectionCard({ section }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">{section.number}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mt-1">{section.title}</h3>
      </div>
      <div className="space-y-4 ml-14">
        {section.content.map((block, i) => renderContent(block, i))}
      </div>
    </div>
  );
}

function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Termos de Uso &{" "}
              <span className="text-red-700">Política de Privacidade</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Ao acessar ou se cadastrar no Site Eldur você estará concordando com os termos de
              uso e política de privacidade deste site. Leia com atenção antes de continuar.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Última atualização: 04/2026</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Foro: Duque de Caxias - RJ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Termos de Uso */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Termos de Uso</h2>
            <div className="w-16 h-1 bg-red-700 rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      </section>

      {/* Política de Privacidade */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Política de Privacidade</h2>
            <div className="w-16 h-1 bg-red-700 rounded-full mb-4" />
            <p className="text-gray-600 max-w-2xl">
              O Provedor respeita a sua privacidade e cumpre a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {privacySections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-3xl mx-auto">
            <div className="w-14 h-14 bg-red-700 rounded-xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Dúvidas sobre estes termos?
            </h3>
            <p className="text-gray-600 mb-6">
              Nossa equipe de suporte está disponível de segunda a sábado, das 10h às 22h
              (quinta-feira até 18h), para esclarecer qualquer questão.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/"
                className="bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar no WhatsApp
              </a>
              <a
                href="mailto:suporte@eldur.com.br"
                className="border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-red-700 hover:text-red-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                Enviar E-mail
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Acceptance Banner */}
      <div className="bg-red-700 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white text-center text-sm">
            Ao continuar usando o Site Eldur, você declara que leu, entendeu e concorda com todo este documento.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Terms;