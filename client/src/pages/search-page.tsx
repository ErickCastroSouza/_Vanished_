import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { MissingPerson, SearchMissingPersonParams } from "@shared/schema";
import SearchForm from "@/components/search-form";
import MissingPersonCard from "@/components/missing-person-card";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState<SearchMissingPersonParams>({});
  
  const { data: missingPersons, isLoading } = useQuery<MissingPerson[]>({
    queryKey: ["/api/missing-persons", searchParams],
    queryFn: async ({ queryKey }) => {
      const [_, params] = queryKey;
      const searchParams = params as SearchMissingPersonParams;
      
      const queryString = Object.entries(searchParams)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join("&");
      
      const url = `/api/missing-persons${queryString ? `?${queryString}` : ""}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch missing persons");
      }
      
      return response.json();
    },
  });
  
  const handleSearch = (params: SearchMissingPersonParams) => {
    setSearchParams(params);
  };
  
  return (
    <div className="min-h-screen py-12 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Buscar Pessoas Desaparecidas</h1>
        
        <div className="mb-12">
          <SearchForm onSearch={handleSearch} />
        </div>  
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Resultados da busca</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {missingPersons && missingPersons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {missingPersons.map((person) => (
                    <MissingPersonCard key={person.id} person={person} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#182720] rounded-lg p-8 text-center">
                  <p className="text-gray-300 mb-4">Nenhum resultado encontrado para a sua busca.</p>
                  <p className="text-gray-400">Tente ajustar os filtros ou fazer uma busca mais ampla.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
