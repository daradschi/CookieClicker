import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  // Über Route.useRouteContext() könntest du hier z.B. auf das socket zugreifen!
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-600">Startseite</h1>
      <p className="mt-2 text-slate-600">Der TanStack Router läuft erfolgreich!</p>
    </div>
  );
}
