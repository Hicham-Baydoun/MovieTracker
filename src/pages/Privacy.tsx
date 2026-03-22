export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground">
          This project stores mock app data locally in your browser to simulate backend behavior.
        </p>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">What Is Stored</h2>
          <p className="text-muted-foreground">
            Movie and TV content, registered mock users, login session state, and watchlist data
            are saved in browser local storage.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">How to Clear Data</h2>
          <p className="text-muted-foreground">
            Clearing site storage in the browser removes all mock data and resets the app.
          </p>
        </section>
      </div>
    </div>
  );
}
