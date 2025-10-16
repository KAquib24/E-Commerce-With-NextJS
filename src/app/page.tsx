import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <section className="container mx-auto py-10 text-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Welcome to ShopSmart 🛍️</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Your one-stop destination for premium products.
          </p>
          <Button>Explore Now</Button>
        </CardContent>
      </Card>
    </section>
  );
}
