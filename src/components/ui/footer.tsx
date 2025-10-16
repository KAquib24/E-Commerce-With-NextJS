export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center p-4 border-t mt-6">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} ShopSmart. All rights reserved.
      </p>
    </footer>
  );
}
