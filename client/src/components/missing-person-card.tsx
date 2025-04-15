import { useState } from "react";
import { useLocation } from "wouter";
import { MissingPerson } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MissingPersonDetailModal from "./missing-person-detail-modal";

interface MissingPersonCardProps {
  person: MissingPerson;
}

export default function MissingPersonCard({ person }: MissingPersonCardProps) {
  const [, navigate] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Format date to display
  const formatDate = (dateStr: Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const statusLabel = person.status === "found" ? "Encontrado" : "Desaparecido";
  const statusVariant = person.status === "found" ? "success" : "error";

  return (
    <>
      <Card className="bg-[#182720] rounded-lg overflow-hidden shadow-lg transition duration-200 hover:translate-y-[-3px] hover:shadow-xl">
        <div className="relative">
          {person.photoUrl ? (
            <img 
              src={person.photoUrl} 
              alt={person.name} 
              className="w-full h-60 object-cover"
            />
          ) : (
            <div className="w-full h-60 bg-gray-700 flex items-center justify-center">
              <User className="h-16 w-16 text-gray-500" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant={statusVariant}>
              {statusLabel}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-white">{person.name}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-300 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-orange-500" />
              {person.lastLocation}
            </p>
            <p className="text-sm text-gray-300 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-orange-500" />
              {person.status === "found" 
                ? `Encontrado em ${formatDate(person.updatedAt)}` 
                : `Desaparecido desde ${formatDate(person.lastSeenDate)}`
              }
            </p>
            <p className="text-sm text-gray-300 flex items-center">
              <User className="h-4 w-4 mr-2 text-orange-500" />
              {person.age} anos
            </p>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="secondary"
              className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white"
              onClick={() => navigate(`/missing/${person.id}`)}
            >
              Ver detalhes
            </Button>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <MissingPersonDetailModal 
          person={person} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}
