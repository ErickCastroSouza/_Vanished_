import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { insertMissingPersonSchema } from "@shared/schema";

// Create a form schema based on the database schema
const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  age: z.string().transform((val) => parseInt(val)),
  gender: z.string().min(1, "Selecione o gênero"),
  height: z.string().optional(),
  bloodType: z.string().optional(),
  characteristics: z.string().optional(),
  lastLocation: z.string().min(3, "Local de desaparecimento é obrigatório"),
  lastSeenDate: z.string().min(1, "Data é obrigatória"),
  disappearanceCircumstances: z.string().optional(),
  status: z.string().default("missing"),
  contactName: z.string().min(3, "Nome de contato é obrigatório"),
  contactPhone: z.string().min(8, "Telefone de contato é obrigatório"),
  contactEmail: z.string().email("Email inválido").optional(),
  photoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterMissingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      height: "",
      bloodType: "",
      characteristics: "",
      lastLocation: "",
      lastSeenDate: new Date().toISOString().split("T")[0],
      disappearanceCircumstances: "",
      status: "missing",
      contactName: user?.name || "",
      contactPhone: "",
      contactEmail: user?.email || "",
      photoUrl: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Convert the form data to match the database schema
      const missingPersonData = {
        ...data,
        reportedBy: user!.id,
        // In a real application, we would handle file uploads here
        // For now, we'll just use the photoUrl field directly
      };
      
      const res = await apiRequest("POST", "/api/missing-persons", missingPersonData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registro bem-sucedido",
        description: "O desaparecimento foi registrado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/missing-persons"] });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar",
        description: error.message || "Ocorreu um erro ao registrar o desaparecimento.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    registerMutation.mutate(values);
  };

  // Handle file input change for photo upload preview
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server or storage service
      // For this demo, we'll just create a local preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue("photoUrl", url);
    }
  };

  return (
    <div className="container py-12 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Registrar Pessoa Desaparecida</CardTitle>
          <CardDescription>
            Preencha o formulário com todas as informações possíveis para ajudar na busca.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Pessoais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da pessoa desaparecida" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Idade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gênero</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Feminino</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1,75m" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bloodType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo Sanguíneo</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="characteristics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Características Físicas</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva características físicas como: cor do cabelo, olhos, marcas distintivas, etc." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1">Foto</label>
                  <div className="flex items-center space-x-4">
                    <div className="border border-input rounded-md overflow-hidden w-32 h-32 flex items-center justify-center bg-[#182720]">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm text-gray-400">Sem foto</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Carregue uma foto clara e recente da pessoa desaparecida.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Detalhes do Desaparecimento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lastSeenDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Desaparecimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local do Desaparecimento</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade, Estado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="disappearanceCircumstances"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Circunstâncias do Desaparecimento</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva como ocorreu o desaparecimento, o que a pessoa vestia, etc." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Informações de Contato</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Responsável</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone de Contato</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Contato</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Registrando..." : "Registrar Desaparecimento"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground text-center">
            Ao registrar um desaparecimento, você autoriza o uso dessas informações para fins de busca e divulgação.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
