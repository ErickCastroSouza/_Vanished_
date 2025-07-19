export function cleanParams(params: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in params) {
    const value = params[key];

    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === "string" && value.trim() === "")
    ) {
      result[key] = String(value);
    }
  }

  return result;
}

export async function fetchMissingPersons(rawParams: Record<string, any>) {
  const query = new URLSearchParams(cleanParams(rawParams)).toString();

  const res = await fetch(`/api/missing-persons?${query}`);
  if (!res.ok) throw new Error("Erro ao buscar pessoas desaparecidas");

  return res.json();
}