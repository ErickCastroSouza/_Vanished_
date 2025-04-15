import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SearchMissingPersonParams } from "@shared/schema";
import { Search } from "lucide-react";

const searchFormSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  lastSeenDate: z.string().optional(),
  status: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  onSearch?: (params: SearchMissingPersonParams) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps = {}) {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      name: "",
      location: "",
      age: "",
      gender: "",
      lastSeenDate: "",
      status: "",
    },
  });

  const handleSearch = (values: SearchFormValues) => {
    // Convert empty strings to undefined
    const cleanedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === "" ? undefined : value,
      ])
    );

    // Convert age to number if present
    const searchParams: SearchMissingPersonParams = {
      ...cleanedValues,
      age: cleanedValues.age ? parseInt(cleanedValues.age as string) : undefined,
    };

    if (onSearch) {
      onSearch(searchParams);
    }
  };

  return (
    <Card className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Buscar pessoas desaparecidas</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome da pessoa" 
                        className="bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Localização</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Cidade, Estado" 
                        className="bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Idade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Idade" 
                        className="bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
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
                    <FormLabel className="text-white">Gênero</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white bg-opacity-10 border border-gray-600 text-white focus:ring-orange-500">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastSeenDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Data de desaparecimento</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-white bg-opacity-10 border border-gray-600 text-white focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white bg-opacity-10 border border-gray-600 text-white focus:ring-orange-500">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="missing">Desaparecido</SelectItem>
                        <SelectItem value="found">Encontrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
