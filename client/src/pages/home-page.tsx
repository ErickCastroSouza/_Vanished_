import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { MissingPerson, SuccessStory } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, UserPlus, Share2 } from "lucide-react";
import MissingPersonCard from "@/components/missing-person-card";
import SearchForm from "@/components/search-form";
import ProcessSteps from "@/components/process-steps";
import SuccessStoryCard from "@/components/success-story-card";

interface Statistics {
  totalMissingPersons: number;
  foundPersons: number;
  monthlyCount: number;
  yearlyCount: number;
}

export default function HomePage() {
  const { data: missingPersons, isLoading: isLoadingPersons } = useQuery<MissingPerson[]>({
    queryKey: ["/api/missing-persons"],
  });

  const { data: successStories, isLoading: isLoadingStories } = useQuery<SuccessStory[]>({
    queryKey: ["/api/success-stories"],
  });

  const { data: statistics, isLoading: isLoadingStats } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  const recentMissingPersons = missingPersons?.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Em média 217 pessoas desaparecem por dia no Brasil
            </h1>
            
            <div className="flex space-x-12 mb-8">
              <div>
                <p className="text-orange-500 text-2xl md:text-3xl font-bold">
                  {isLoadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    `${statistics?.monthlyCount || 6} mil+`
                  )}
                </p>
                <p className="text-sm text-gray-300">Por Mês</p>
              </div>
              <div>
                <p className="text-orange-500 text-2xl md:text-3xl font-bold">
                  {isLoadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    `${statistics?.yearlyCount || 82} mil+`
                  )}
                </p>
                <p className="text-sm text-gray-300">Por Ano</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-8 max-w-xl">
              Aqui, você pode registrar um desaparecimento, compartilhar informações e acessar 
              recursos de pessoas encontradas. Com a força da comunidade e o apoio de tecnologia, 
              acreditamos que cada compartilhamento pode fazer a diferença. Junte-se a nós nessa 
              missão. Quanto mais pessoas envolvidas, maiores as chances de reunir famílias e 
              trazer esperança de volta aos lares.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register-missing">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                  Registrar desaparecimento
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto">
                  Buscar pessoas
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="border-2 border-orange-500 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1673169128434-90fa9fb9b4a7?q=80&w=1035&auto=format&fit=crop" 
              alt="Pessoas reunidas em busca por desaparecidos" 
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-[#182720] py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <SearchForm />
        </div>
      </section>

      {/* Recent Missing Persons Section */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
              Pessoas recentemente desaparecidas
            </h2>
            <Link href="/search" className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
              Ver todas
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          
          {isLoadingPersons ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentMissingPersons.map((person) => (
                <MissingPersonCard key={person.id} person={person} />
              ))}
              
              {recentMissingPersons.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400">Nenhuma pessoa desaparecida registrada ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-[#182720] px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Como funciona</h2>
          <ProcessSteps />
          
          <div className="text-center mt-12">
            <Link href="/register-missing">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Registrar um desaparecimento
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-primary bg-opacity-90"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Junte-se à nossa comunidade</h2>
            <p className="text-gray-300 mb-8">
              Registre-se para ajudar na busca por pessoas desaparecidas. Juntos, podemos fazer a diferença e reunir famílias.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link href="/auth">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                  Criar conta
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto">
                  Saiba mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Success Stories */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Histórias de sucesso</h2>
          
          {isLoadingStories ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {successStories?.slice(0, 3).map((story) => (
                <SuccessStoryCard key={story.id} story={story} />
              ))}
              
              {(!successStories || successStories.length === 0) && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400">Nenhuma história de sucesso registrada ainda.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/success-stories" className="text-orange-500 hover:text-orange-600 font-medium flex items-center justify-center">
              Ver todas as histórias
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
