
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Order, Product } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { useProducts } from "./ProductContext";

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "productName">) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  const { products } = useProducts();

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('giftGullyOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage when they change
  useEffect(() => {
    localStorage.setItem('giftGullyOrders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, "id" | "createdAt" | "productName">) => {
    // Find product name for the order
    const product = products.find(p => p.id === orderData.productId);
    const productName = product ? product.name : "Unknown Product";
    
    // Create new order with ID, timestamp and product name
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      productName
    };
    
    setOrders([...orders, newOrder]);
    
    // Notification for customer
    toast({
      title: "Order placed",
      description: "Your order has been submitted successfully!",
    });

    // Admin notification (will only show if admin is logged in)
    toast({
      title: "New Order Received!",
      description: `${newOrder.name} ordered ${productName}`,
      variant: "default",
    });
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
