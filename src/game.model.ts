import mongoose, { Schema, model } from "mongoose";
import type { GameState } from "./game.types";


const SaveSchema = new Schema<GameState>(
    {
        userId: {type: Number, required: true, unique: true},
        counter: {type: Number, required: true, default: 0},
        countPerClick: {type: Number, required: true, default: 1},
        preisVerdoppler: {type: Number, required: true, default: 80},
        preisAutoClicker: {type: Number, required: true, default: 30},
        preisAutoClickerMultiplier: { type: Number, required: true, default: 150},
        anzahlAutoClicker: {type: Number, required: true, default: 0},
        autoClickMultiplier: {type: Number, required: true, default: 1},
        anzahlAutoClicksproSekunde: {type: Number, required: true, default: 0},
        autoClickerSpeed: {type: Number, required: true, default: 1000},
        preisAutoClickerSpeed: {type: Number, required: true, default: 10000}
    }, {timestamps: true}
)


export const UserSave = model('UserSave', SaveSchema);

