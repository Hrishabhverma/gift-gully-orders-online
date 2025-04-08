
import { useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOrders } from "@/contexts/OrderContext";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addOrder } = useOrders();
  const [name, setName] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Submit the order
    addOrder({
      productId: product.id,
      name,
      hostelName,
      contactNumber,
      feedback
    });
    
    // Reset the form
    setName("");
    setHostelName("");
    setContactNumber("");
    setFeedback("");
    setIsSubmitting(false);
    
    // Close the dialog
    setOrderDialogOpen(false);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col gift-card-gradient">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="text-lg font-bold text-primary">{formatPrice(product.price)}</div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-muted-foreground text-sm">{product.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 p-4 pt-0">
        {/* QR Code Dialog */}
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">View Payment QR</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Payment QR Code for {product.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center p-4">
              <img src={product.qrCodeUrl} alt="Payment QR Code" className="w-64 h-64" />
              <p className="mt-4 text-center">
                Scan this QR code to make payment of {formatPrice(product.price)}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Order Dialog */}
        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Place Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Order {product.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hostelName">Hostel Name</Label>
                <Input 
                  id="hostelName" 
                  value={hostelName} 
                  onChange={(e) => setHostelName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input 
                  id="contactNumber" 
                  type="tel"
                  value={contactNumber} 
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback/Special Request</Label>
                <Textarea 
                  id="feedback" 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Any special requests?"
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setOrderDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Submit Order"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
