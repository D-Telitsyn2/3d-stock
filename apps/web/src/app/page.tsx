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
          <p className="text-muted-foreground">
            We're building an amazing marketplace for 3D models.
            Stay tuned for the launch!
          </p>
        </div>
      </div>
    </div>
  );
}
