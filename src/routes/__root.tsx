import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { QueryClient } from '@tanstack/react-query';

interface MyRouterContext {
  queryClient: QueryClient;
  socket: WebSocket;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <nav className="p-4 flex gap-4 bg-slate-100 border-b">
        <span className="font-bold">Mein Elysia + Bun Projekt</span>
      </nav>
      
      {/* Hier werden deine Unterseiten (index.tsx, test.tsx) gerendert */}
      <Outlet /> 
      
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});
