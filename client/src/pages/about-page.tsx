import { Helmet } from "react-helmet";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Sobre Nós | Vanished</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="text-center">
            <h1 className="text-4xl font-bold mb-6">Sobre o Vanished</h1>
            <p className="text-xl text-gray-300">
              Ajudando a reunir famílias e encontrar pessoas desaparecidas no Brasil.
            </p>
          </section>
          
          <section className="bg-[#1a2718] p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
            <p className="mb-4">
              O Vanished foi criado com uma missão clara: ajudar a encontrar pessoas desaparecidas 
              e reunir famílias. Acreditamos no poder da comunidade e da tecnologia para resolver 
              um dos problemas mais angustiantes que uma família pode enfrentar.
            </p>
            <p>
              Através de nossa plataforma, buscamos criar um ambiente centralizado onde informações 
              sobre pessoas desaparecidas possam ser registradas, compartilhadas e acessadas facilmente,
              aumentando as chances de um reencontro.
            </p>
          </section>
          
          <section className="bg-[#1a2718] p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Como Funcionamos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-orange-500">Para Quem Busca</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Registre casos de pessoas desaparecidas com detalhes e fotos</li>
                  <li>Atualize informações à medida que surgem novos detalhes</li>
                  <li>Receba notificações sobre possíveis correspondências</li>
                  <li>Compartilhe os casos em redes sociais para ampliar o alcance</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-orange-500">Para Quem Quer Ajudar</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Pesquise o banco de dados de pessoas desaparecidas</li>
                  <li>Forneça informações úteis sobre casos específicos</li>
                  <li>Compartilhe casos em suas redes para aumentar a visibilidade</li>
                  <li>Voluntarie-se para ajudar a moderar e verificar informações</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="bg-[#1a2718] p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Nossa Equipe</h2>
            <p className="mb-6">
              Somos uma equipe de profissionais comprometidos com a causa de pessoas desaparecidas, 
              incluindo desenvolvedores, designers, especialistas em segurança e voluntários 
              da comunidade.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👩‍💻</span>
                </div>
                <h3 className="font-bold">Desenvolvimento</h3>
                <p className="text-sm text-gray-400">Criando e mantendo a plataforma</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="font-bold">Pesquisa</h3>
                <p className="text-sm text-gray-400">Investigação e verificação de dados</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">❤️</span>
                </div>
                <h3 className="font-bold">Suporte</h3>
                <p className="text-sm text-gray-400">Ajudando famílias durante o processo</p>
              </div>
            </div>
          </section>
          
          <section className="bg-[#1a2718] p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Nossos Valores</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-orange-500">Privacidade</h3>
                <p>
                  Protegemos os dados sensíveis e respeitamos a privacidade de todos os envolvidos, 
                  seguindo rigorosas políticas de proteção de dados.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-orange-500">Transparência</h3>
                <p>
                  Operamos com total transparência sobre nossos processos, financiamento e 
                  resultados obtidos.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-orange-500">Colaboração</h3>
                <p>
                  Trabalhamos em parceria com autoridades, organizações e comunidades para 
                  maximizar nosso impacto positivo.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-orange-500">Esperança</h3>
                <p>
                  Acreditamos que cada caso tem solução e mantemos a esperança viva para 
                  famílias em momentos difíceis.
                </p>
              </div>
            </div>
          </section>
          
          <section className="bg-[#1a2718] p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Entre em Contato</h2>
            <p className="mb-6">
              Estamos sempre abertos para sugestões, parcerias e qualquer forma de colaboração 
              que possa nos ajudar a cumprir nossa missão.
            </p>
            <a 
              href="mailto:contato@vanished.com.br" 
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition duration-200"
            >
              Enviar Email
            </a>
          </section>
        </div>
      </div>
    </>
  );
}