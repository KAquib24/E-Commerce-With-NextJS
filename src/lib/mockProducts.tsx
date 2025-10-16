export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 59.99,
    image: "/images/headphones.jpg",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 129.99,
    image: "/images/smartwatch.jpg",
    rating: 4.0,
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 39.99,
    image: "/images/speaker.jpg",
    rating: 4.2,
  },
  // Add more mock products as needed
];
