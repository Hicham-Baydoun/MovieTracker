export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground">
          This is a mock educational project for CSC443. By using this application, you agree to
          use it for learning and demonstration purposes only.
        </p>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Use of the App</h2>
          <p className="text-muted-foreground">
            You may browse content, create a mock account, and manage mock watchlist data in this
            frontend prototype.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">No Production Guarantees</h2>
          <p className="text-muted-foreground">
            Data is stored locally in the browser and can be lost when storage is cleared.
          </p>
        </section>
      </div>
    </div>
  );
}
