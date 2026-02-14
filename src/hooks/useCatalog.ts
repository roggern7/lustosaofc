import { useQuery } from "@tanstack/react-query";
import { fetchProducts as apiFetchProducts, type ProductItem } from "@/lib/cfApi";

export type Product = ProductItem;

interface UseCatalogOptions {
  categoria?: string | null;
  numeracao?: string | null;
  page?: number;
  pageSize?: number;
}

interface CatalogResult {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
}

// Check if a product has a specific size in its variacoes field
function hasSize(sizes: string | null, size: string): boolean {
  if (!sizes) return false;
  const normalized = sizes.replace(/[-/]/g, ",");
  return normalized.split(",").map((s) => s.trim()).includes(size);
}

async function fetchProducts(
  categoria: string | null,
  numeracao: string | null,
  page: number,
  pageSize: number
): Promise<CatalogResult> {
  const { items } = await apiFetchProducts({
    category: categoria,
    size: numeracao,
  });

  let products: Product[] = items;

  // Client-side size filtering fallback
  if (numeracao) {
    products = products.filter((p) => hasSize(p.sizes, numeracao));
  }

  const totalCount = products.length;
  const offset = (page - 1) * pageSize;
  const paginated = products.slice(offset, offset + pageSize);

  return {
    products: paginated,
    totalCount,
    hasMore: totalCount > offset + pageSize,
  };
}

export const useCatalog = (options: UseCatalogOptions = {}) => {
  const { categoria = null, numeracao = null, page = 1, pageSize = 20 } = options;

  return useQuery({
    queryKey: ["catalog", categoria, numeracao, page, pageSize],
    queryFn: () => fetchProducts(categoria, numeracao, page, pageSize),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
