export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to 3D Stock
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Premium 3D Models Marketplace
        </p>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            We're building an amazing marketplace for 3D models.
            Stay tuned for the launch!
          </p>
          <a
            href="/catalog"
            className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Browse catalog
          </a>
        </div>
      </div>
    </div>
  );
}
