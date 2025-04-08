
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "../types";
import { products as initialProducts } from "../data/products";
import { useToast } from "@/components/ui/use-toast";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { toast } = useToast();

  // Load products from localStorage on mount (fallback to initialProducts)
  useEffect(() => {
    const savedProducts = localStorage.getItem('giftGullyProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save products to localStorage when they change
  useEffect(() => {
    localStorage.setItem('giftGullyProducts', JSON.stringify(products));
  }, [products]);

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

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;

    setProducts(products.filter(product => product.id !== id));
    
    toast({
      title: "Product deleted",
      description: `${productToDelete.name} has been removed`,
      variant: "destructive",
    });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
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
