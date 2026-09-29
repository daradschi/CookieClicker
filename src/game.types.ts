export interface GameState {
    userId: number;
    counter: number;
    countPerClick: number;
    preisVerdoppler: number;
    anzahlAutoClicker: number;
    autoClickMultiplier: number;
    anzahlAutoClicksproSekunde: number;
    autoClickerSpeed: number;
    preisAutoClicker: number;
    preisAutoClickerMultiplier: number;
    preisAutoClickerSpeed: number;
}

export const INITIAL_GAME_STATE: Omit<GameState, 'userId'> = {
    counter: 0,
    countPerClick: 1,
    preisVerdoppler: 80,
    anzahlAutoClicker: 0,
    autoClickMultiplier: 1,
    anzahlAutoClicksproSekunde: 0,
    autoClickerSpeed: 1000,
    preisAutoClicker: 30,
    preisAutoClickerMultiplier: 150,
    preisAutoClickerSpeed: 1000
};
