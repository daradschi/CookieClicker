import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors"
import mongoose, { Schema, model } from "mongoose";
import index from "../public/index.html"
import { UserSave } from "./game.model";
import { clickOnCookie, saveAllStats, setCounter, autoCookieClicker, stopCookieCounter, getOrCreateSpielstand } from "./services/cookie-calculator";
import type { ElysiaWS } from "elysia/ws";


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cookieclicker';


try {
  await mongoose.connect(MONGO_URI);
  console.log('--- 🍃 Erfolgreich mit MongoDB Atlas verbunden! ---');
} catch (error) {
  console.error('Fehler bei der MongoDB-Verbindung:', error);
}

export const app = new Elysia({
  serve: {
    development: {
      hmr: false // Das deaktiviert das fehlerhafte Modul-Injektions-HMR im Browser!
    }
  }
}).use(cors())



  .get('/api/gamestate/:userId', async ({ params }) => {
    const idAlsZahl = Number(params.userId);
    const spielstand = await getOrCreateSpielstand(idAlsZahl);

    if (!spielstand) {
      return { error: "Spielstand konnte nicht geladen werden" }
    }

    const reinesObjekt = spielstand.toObject();

    (reinesObjekt as any)._id = reinesObjekt._id.toString();

    return reinesObjekt;
  })

  .post('/api/save/:userId', async ({ params, body }) => {
    const idAlsZahl = Number(params.userId)

    return await saveAllStats(idAlsZahl, body as any)
  })

  .get("/", index)

  .get("/*", index) 

  // WebSocket Endpunkt
  .ws("/ws", {
    open(ws) {
      autoCookieClicker(ws);
    },
    close() {
      stopCookieCounter();
    },
    message(ws, message: { method: string; }) {
      if (message.method === "cookie-click") {
        clickOnCookie(ws);
      }
    }
  })
  .listen(3000)


console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;



