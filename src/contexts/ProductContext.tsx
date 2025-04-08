
import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types";
import { products as initialProducts } from "../data/products";
import { useToast } from "@/components/ui/use-toast";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { toast } = useToast();

  const addProduct = (product: Omit<Product, "id">) => {
    // Generate a simple ID - in a real app, this would be done on the backend
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };

    setProducts([...products, newProduct]);
    
    toast({
      title: "Product added",
      description: `${product.name} has been added successfully`,
    });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
