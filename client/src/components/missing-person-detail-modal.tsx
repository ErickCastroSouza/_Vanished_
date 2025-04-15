import { MissingPerson } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Ruler, Droplet, FileText } from "lucide-react";

interface MissingPersonDetailModalProps {
  person: MissingPerson;
  isOpen: boolean;
  onClose: () => void;
}

export default function MissingPersonDetailModal({ 
  person, 
  isOpen, 
  onClose 
}: MissingPersonDetailModalProps) {
  // Format date to display
  const formatDate = (dateStr: Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-[#182720]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{person.name}</DialogTitle>
            <Badge 
              variant={person.status === "found" ? "success" : "error"}
            >
              {person.status === "found" ? "Encontrado" : "Desaparecido"}
            </Badge>
          </div>
          <DialogDescription>
            Veja detalhes completos sobre esta pessoa desaparecida
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            {person.photoUrl ? (
              <img 
                src={person.photoUrl} 
                alt={person.name} 
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="bg-gray-700 w-full rounded-lg h-[300px] flex items-center justify-center">
                <User className="h-20 w-20 text-gray-500" />
                <span className="sr-only">Sem foto disponível</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Informações pessoais</h4>
              <div className="bg-white bg-opacity-5 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-300 flex items-center">
                  <User className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="font-medium text-gray-200 w-24">Idade:</span> {person.age} anos
                </p>
                
                {person.height && (
                  <p className="text-sm text-gray-300 flex items-center">
                    <Ruler className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="font-medium text-gray-200 w-24">Altura:</span> {person.height}
                  </p>
                )}
                
                {person.bloodType && (
                  <p className="text-sm text-gray-300 flex items-center">
                    <Droplet className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="font-medium text-gray-200 w-24">Tipo sanguíneo:</span> {person.bloodType}
                  </p>
                )}
                
                {person.characteristics && (
                  <p className="text-sm text-gray-300 flex items-start">
                    <FileText className="h-4 w-4 mr-2 mt-1 text-orange-500" />
                    <span className="font-medium text-gray-200 w-24 mt-0.5">Características:</span> {person.characteristics}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Detalhes do desaparecimento</h4>
              <div className="bg-white bg-opacity-5 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-300 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="font-medium text-gray-200 w-24">Data:</span> {formatDate(person.lastSeenDate)}
                </p>
                
                <p className="text-sm text-gray-300 flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-orange-500" />
                  <span className="font-medium text-gray-200 w-24 mt-0.5">Local:</span> {person.lastLocation}
                </p>
                
                {person.disappearanceCircumstances && (
                  <p className="text-sm text-gray-300 flex items-start">
                    <FileText className="h-4 w-4 mr-2 mt-1 text-orange-500" />
                    <span className="font-medium text-gray-200 w-24 mt-0.5">Circunstâncias:</span> {person.disappearanceCircumstances}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Contato</h4>
              <div className="bg-white bg-opacity-5 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-300 flex items-center">
                  <User className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="font-medium text-gray-200 w-24">Responsável:</span> {person.contactName}
                </p>
                
                <p className="text-sm text-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span className="font-medium text-gray-200 w-24">Telefone:</span> {person.contactPhone}
                </p>
                
                {person.contactEmail && (
                  <p className="text-sm text-gray-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span className="font-medium text-gray-200 w-24">Email:</span> {person.contactEmail}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Compartilhar
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Tenho informações
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
