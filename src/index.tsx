import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx"
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Test from "./Test.tsx"
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { createRootRouteWithContext, createRouter, createRoute, Outlet, RouterProvider } from '@tanstack/react-router';
import Daily from "./Daily.tsx"
import ZweiGraphen from "./ZweiGraphen.tsx"





//Typen für den Router-Context definieren
interface MyRouterContext {
  queryClient: QueryClient;
  socket: WebSocket;
}

// Root-Route erstellen (Das Basis-Layout deiner App)
const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      {/* Hier wird die jeweilige aktive Route hineingerendert */}
      <Outlet /> 
      
      {/* Devtools (optional) */}
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});


// Routen definieren und Komponenten zuweisen
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <App socket={rootRoute.useRouteContext().socket} />, 
});

const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test',
  component: Test, // Lädt deine Test.tsx unter localhost:3000/test
});

const dailyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily',
  component: Daily, // Lädt deine Test.tsx unter localhost:3000/test
});

const zweiGraphenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/zwei',
  component: ZweiGraphen, // Lädt deine Test.tsx unter localhost:3000/test
});

// Routen-Baum manuell zusammenbauen
const routeTree = rootRoute.addChildren([indexRoute, testRoute, dailyRoute, zweiGraphenRoute]);

// Query Client & WebSocket Setup
const queryClient = new QueryClient();
const socket = new WebSocket("ws://localhost:3000/ws");

socket.addEventListener("open", event => {
    console.log("Connection aufgebaut und Cookie Counter gestartet.")
})

// Router erstellen
const router = createRouter({ 
    routeTree,
    context: {
        queryClient,
        socket,
    }
});

// Register den Router für absolute Typesafety in deiner App
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>
);

