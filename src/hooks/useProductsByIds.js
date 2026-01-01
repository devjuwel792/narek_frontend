import { useGetProductsByIdsQuery } from "@/Redux/services/productApi";


export const useProductsByIds = (ids = []) => {
  const { data, isLoading, isError } = useGetProductsByIdsQuery(ids, { skip: !ids || ids.length === 0 });

  return {
    data: data || [],
    isLoading,
    isError,
  };
};
