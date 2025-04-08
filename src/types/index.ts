
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  qrCodeUrl: string;
}

export interface Order {
  id: string;
  productId: string;
  name: string;
  hostelName: string;
  contactNumber: string;
  feedback: string;
  createdAt: string;
  productName: string;
}

export interface User {
  email: string;
  isAdmin: boolean;
}
