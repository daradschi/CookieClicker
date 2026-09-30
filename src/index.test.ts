import { describe, expect, test } from "bun:test";
import {app} from './index.ts';

describe("Elysia API - Routing Tests", () => {

    test("GET /pfad-der-nicht-existiert - Sollte dank Catch-All mit Status 200 antworten", async () => {
      const request = new Request("http://localhost/pfad-der-nicht-existiert");

      const response = await app.handle(request);

      expect(response.status).toBe(200);
    });
});

test("Mathematik funktioniert", () => {
  expect(1 + 1).toBe(2);
});

test("Button testen", () => {
    
})