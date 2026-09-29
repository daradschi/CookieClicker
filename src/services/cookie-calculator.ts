import type { ElysiaWS } from "elysia/ws";
import { UserSave } from "@/game.model";
import mongoose, { Schema, model } from "mongoose";
import type { GameState } from "../game.types.ts";
import { INITIAL_GAME_STATE } from "@/game.types";



export async function getOrCreateSpielstand(userId: number) {
    const daten = await UserSave.findOne({ userId })
    if (daten) {
        return daten
    }
    else {
        return await UserSave.create({
            userId: userId,
            ...INITIAL_GAME_STATE

        })
    }
}

export async function readCounter() {
    const daten = await UserSave.findOne({ userId: 1 })
    if (daten) {
        return daten.counter
    }
    else {
        await UserSave.create({ userId: 1, counter: 0 })
        return 0;
    }
}

export async function setCounter(neuerCount: number) {
    const aktualisierterCounter = await UserSave.findOneAndUpdate({ userId : 1 }, { $set: { counter: neuerCount } }, { returnDocument: 'after', upsert: true });
    return aktualisierterCounter;
}


export async function readAnzahlAutoClicker() {
    const daten = await UserSave.findOne({ userId: 1 })
    if (daten) {
        return daten.anzahlAutoClicker
    }
}

export async function readAutoClicksProSekunde() {
    const daten = await UserSave.findOne({ userId: 1 })
    if (daten) {
        return daten.anzahlAutoClicksproSekunde
    }
    else {
        return 0;
    }
}

export async function readCountPerClick() {
    const daten = await UserSave.findOne({ userId: 1 })
    if(daten) {
        return daten.countPerClick
    }
    else {
        return 1;
    }
}

async function readAutoClickMultiplier() {
    const daten = await UserSave.findOne({ userId: 1 })
    if (daten) {
        return daten.autoClickMultiplier
    }
    else {
        return 1
    }
}

async function readAutoClickerSpeed() {
    const daten = await UserSave.findOne({ userId : 1})
    if( daten ) {
        return daten.autoClickerSpeed
    }
    else {
        return 1000
    }
}

export async function saveAllStats(userId: number, neueDaten: Partial<GameState>) {
    const aktualisiert = await UserSave.findOneAndUpdate(
        { userId: userId },
        { $set: neueDaten },
        { returnDocument: 'after', upsert: true }
    );
    return aktualisiert;
}



let intervalId: NodeJS.Timeout | null = null;

async function autoCookieClicker(ws: ElysiaWS) {
    const autoClickerSpeed = await readAutoClickerSpeed()

    intervalId = setInterval(async () => {
        const anzahlAutoClicker = await readAnzahlAutoClicker()
        const autoClickMultiplier = await readAutoClickMultiplier() 
        if (anzahlAutoClicker === 0) return;
        let cookieCount = await readCounter();
        let AutoClicksProSekunde = anzahlAutoClicker * autoClickMultiplier
        let newCookieCount = cookieCount + AutoClicksProSekunde
        await setCounter(newCookieCount);
        cookieCount = await readCounter();

        console.log("auto", cookieCount);

        ws.send(cookieCount);
    }, autoClickerSpeed);
}

function stopCookieCounter() {
    if (!intervalId) return;
    clearInterval(intervalId);
}

export async function clickOnCookie(ws: ElysiaWS) {
    let cookieCount = await readCounter();
    let countPerClick = await readCountPerClick();
    cookieCount += countPerClick
    await setCounter(cookieCount);
    cookieCount = await readCounter();
    console.log("click",cookieCount)
    ws.send(cookieCount)

}


export { autoCookieClicker, stopCookieCounter };

