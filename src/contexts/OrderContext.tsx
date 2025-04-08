
import { createContext, useContext, useState, ReactNode } from "react";
import { Order } from "../types";
import { useToast } from "@/components/ui/use-toast";

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const addOrder = (order: Order) => {
    // In a real app, this would call an API
    setOrders([...orders, order]);
    
    toast({
      title: "Order placed",
      description: "Your order has been submitted successfully!",
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
