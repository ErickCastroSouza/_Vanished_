import { SuccessStory, MissingPerson } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface SuccessStoryCardProps {
  story: SuccessStory;
}

export default function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  const { data: person, isLoading } = useQuery<MissingPerson>({
    queryKey: [`/api/missing-persons/${story.missingPersonId}`],
    queryFn: async () => {
      const res = await fetch(`/api/missing-persons/${story.missingPersonId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch missing person");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-[#182720] rounded-lg overflow-hidden shadow-lg">
        <div className="h-48 bg-gray-700 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#182720] rounded-lg overflow-hidden shadow-lg">
      {story.photoUrl ? (
        <img 
          src={story.photoUrl} 
          alt={story.title} 
          className="w-full h-48 object-cover"
        />
      ) : person?.photoUrl ? (
        <img 
          src={person.photoUrl} 
          alt={person.name} 
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500">Sem imagem disponível</span>
        </div>
      )}
      
      <CardContent className="p-6">
        <Badge variant="success">Encontrado</Badge>
        <h3 className="text-xl font-semibold text-white mt-4">{story.title}</h3>
        <p className="text-gray-300 mt-3">
          {story.description}
        </p>
        <a href="#" className="text-orange-500 hover:text-orange-600 font-medium flex items-center mt-4">
          Ler história completa
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </CardContent>
    </Card>
  );
}
