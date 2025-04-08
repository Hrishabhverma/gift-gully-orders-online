
import { useProducts } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

export default function Index() {
  const { products } = useProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <section className="hero-gradient py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Gift Gully</h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              Thoughtful gifts delivered to your campus doorstep
            </p>
          </div>
        </div>
      </section>
      
      {/* Products section */}
      <section className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Gift Gully. All rights reserved.
          </p>
          <p className="text-center text-gray-600 mt-2">
            For Queries Contact: +91 8269679726
          </p>
        </div>
      </footer>
    </div>
  );
}
