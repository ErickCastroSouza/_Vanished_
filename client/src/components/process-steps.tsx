import { UserPlus, File, Share2 } from "lucide-react";

export default function ProcessSteps() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center">
        <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserPlus className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Registre-se</h3>
        <p className="text-gray-300">
          Crie uma conta para poder registrar casos de desaparecimento e acompanhar atualizações.
        </p>
      </div>
      
      <div className="text-center">
        <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <File className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Reporte um caso</h3>
        <p className="text-gray-300">
          Forneça detalhes e uma foto da pessoa desaparecida para criar um registro em nosso banco de dados.
        </p>
      </div>
      
      <div className="text-center">
        <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Share2 className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Compartilhe</h3>
        <p className="text-gray-300">
          Compartilhe o caso em suas redes sociais para aumentar a visibilidade e as chances de encontrar a pessoa.
        </p>
      </div>
    </div>
  );
}
