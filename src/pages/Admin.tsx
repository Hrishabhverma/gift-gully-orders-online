
import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { useOrders } from "@/contexts/OrderContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Trash2, Upload, AlertCircle } from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const { products, addProduct, deleteProduct } = useProducts();
  const { orders } = useOrders();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [localQrCode, setLocalQrCode] = useState<string | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use local images if they were uploaded, otherwise use URL
      const finalImageUrl = localImage || imageUrl;
      const finalQrCodeUrl = localQrCode || qrCodeUrl;
      
      addProduct({
        name,
        description,
        price: parseFloat(price),
        imageUrl: finalImageUrl,
        qrCodeUrl: finalQrCodeUrl
      });
      
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setQrCodeUrl("");
      setLocalImage(null);
      setLocalQrCode(null);
      
      // Reset file inputs
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (qrInputRef.current) qrInputRef.current.value = "";
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImage: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProductDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Product Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (INR)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imageInput">Product Image</Label>
                      <div className="flex flex-col space-y-2">
                        <Input
                          id="imageInput"
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setLocalImage)}
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">OR</span>
                        </div>
                        <Input
                          id="imageUrl"
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                        {localImage && (
                          <div className="mt-2 relative w-40 h-40 border rounded">
                            <img 
                              src={localImage} 
                              alt="Uploaded product" 
                              className="w-full h-full object-cover rounded"
                            />
                            <button 
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                              onClick={() => setLocalImage(null)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="qrInput">QR Code Image</Label>
                      <div className="flex flex-col space-y-2">
                        <Input
                          id="qrInput"
                          ref={qrInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setLocalQrCode)}
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">OR</span>
                        </div>
                        <Input
                          id="qrCodeUrl"
                          type="url"
                          value={qrCodeUrl}
                          onChange={(e) => setQrCodeUrl(e.target.value)}
                          placeholder="https://example.com/qrcode.png"
                        />
                        {localQrCode && (
                          <div className="mt-2 relative w-40 h-40 border rounded">
                            <img 
                              src={localQrCode} 
                              alt="Uploaded QR code" 
                              className="w-full h-full object-cover rounded"
                            />
                            <button 
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                              onClick={() => setLocalQrCode(null)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Note</AlertTitle>
                      <AlertDescription>
                        Please provide either an image upload or URL for both the product image and QR code.
                      </AlertDescription>
                    </Alert>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Adding Product..." : "Add Product"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Product List */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">No products available</TableCell>
                          </TableRow>
                        ) : (
                          products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name} 
                                  className="w-12 h-12 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{formatPrice(product.price)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleProductDelete(product.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Customer Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No orders yet</AlertTitle>
                    <AlertDescription>
                      Customer orders will appear here once they are placed.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Hostel</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Feedback</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium">{order.name}</TableCell>
                            <TableCell>{order.productName}</TableCell>
                            <TableCell>{order.hostelName}</TableCell>
                            <TableCell>{order.contactNumber}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {order.feedback || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
