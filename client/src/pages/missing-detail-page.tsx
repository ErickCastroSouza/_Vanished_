import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Loader2, MapPin, Calendar, User, Ruler, Droplet, Shirt, FileText, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MissingPerson } from "@shared/schema";

interface MissingDetailPageProps {
  id: number;
}

export default function MissingDetailPage({ id }: MissingDetailPageProps) {
  const [, navigate] = useLocation();
  const { data: person, isLoading, error } = useQuery<MissingPerson>({
    queryKey: [`/api/missing-persons/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/missing-persons/${id}`);
      if (!res.ok) {
        throw new Error("Pessoa desaparecida não encontrada");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="container py-12 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Pessoa não encontrada</h2>
            <p className="text-gray-400 mb-6">
              O registro que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate("/search")} variant="outline">
              Voltar para a busca
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format date to display
  const formatDate = (dateStr: Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="container py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/search" className="text-orange-500 hover:text-orange-600 flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Voltar para resultados</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {person.photoUrl ? (
              <img 
                src={person.photoUrl} 
                alt={person.name} 
                className="w-full rounded-lg h-auto object-cover max-h-[500px]"
              />
            ) : (
              <div className="bg-[#182720] w-full rounded-lg h-[400px] flex items-center justify-center">
                <p className="text-gray-400">Sem foto disponível</p>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">{person.name}</h1>
              <Badge 
                className={person.status === "found" ? "bg-green-600" : "bg-red-600"}
              >
                {person.status === "found" ? "Encontrado" : "Desaparecido"}
              </Badge>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-2">Informações Pessoais</h2>
                <Card className="bg-opacity-5">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="font-medium text-gray-300 w-24">Idade:</span> 
                      <span>{person.age} anos</span>
                    </div>
                    
                    {person.height && (
                      <div className="flex items-center">
                        <Ruler className="h-5 w-5 text-orange-500 mr-2" />
                        <span className="font-medium text-gray-300 w-24">Altura:</span>
                        <span>{person.height}</span>
                      </div>
                    )}
                    
                    {person.bloodType && (
                      <div className="flex items-center">
                        <Droplet className="h-5 w-5 text-orange-500 mr-2" />
                        <span className="font-medium text-gray-300 w-24">Tipo sanguíneo:</span>
                        <span>{person.bloodType}</span>
                      </div>
                    )}
                    
                    {person.characteristics && (
                      <div className="flex items-start">
                        <Shirt className="h-5 w-5 text-orange-500 mr-2 mt-1" />
                        <span className="font-medium text-gray-300 w-24 mt-1">Características:</span>
                        <span>{person.characteristics}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-2">Detalhes do Desaparecimento</h2>
                <Card className="bg-opacity-5">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="font-medium text-gray-300 w-24">Data:</span>
                      <span>{formatDate(person.lastSeenDate)}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-orange-500 mr-2 mt-1" />
                      <span className="font-medium text-gray-300 w-24 mt-1">Local:</span>
                      <span>{person.lastLocation}</span>
                    </div>
                    
                    {person.disappearanceCircumstances && (
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-orange-500 mr-2 mt-1" />
                        <span className="font-medium text-gray-300 w-24 mt-1">Circunstâncias:</span>
                        <span>{person.disappearanceCircumstances}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-2">Contato</h2>
                <Card className="bg-opacity-5">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="font-medium text-gray-300 w-24">Responsável:</span>
                      <span>{person.contactName}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="font-medium text-gray-300 w-24">Telefone:</span>
                      <span>{person.contactPhone}</span>
                    </div>
                    
                    {person.contactEmail && (
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-orange-500 mr-2" />
                        <span className="font-medium text-gray-300 w-24">Email:</span>
                        <span>{person.contactEmail}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Compartilhar
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Tenho informações
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-12" />
        
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Ajude a encontrar {person.name}</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Compartilhe esse caso nas suas redes sociais para aumentar o alcance e as chances de encontrar {person.name}. Cada compartilhamento pode fazer a diferença.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </Button>
            <Button variant="outline" className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </Button>
            <Button variant="outline" className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </Button>
            <Button variant="outline" className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
