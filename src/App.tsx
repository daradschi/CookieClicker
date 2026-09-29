import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge"
import { CheckCircle2Icon, InfoIcon } from "lucide-react"
import cookieImg from "@/assets/cookie.png";
import { UserSave } from "./game.model";
import { readCounter } from "./services/cookie-calculator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { edenTreaty } from '@elysiajs/eden';
import type { App as BackendApp } from './index.ts';
import { INITIAL_GAME_STATE } from './game.types.ts';



const api = edenTreaty<BackendApp>('http://localhost:3000')

export default function App(props: { socket: WebSocket }) {

    const queryClient = useQueryClient();
    const aktuelleUserId = 1;

    const [liveCounter, setLiveCounter] = useState(0);

    const { data: gameData, isLoading, error } = useQuery({
        queryKey: ['gameState', aktuelleUserId],
        queryFn: async () => {
            const response = await (api.api.gamestate as any)[aktuelleUserId].get();


            return response.data;
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (gameData && gameData.counter !== undefined) {
            setLiveCounter(gameData.counter);
        }
    }, [gameData]);

     useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            setLiveCounter(Number(event.data));
        };
        props.socket.addEventListener("message", handleMessage);
        return () => props.socket.removeEventListener("message", handleMessage);
    }, [props.socket]);



    const saveMutation = useMutation({
        mutationFn: async (neuerSpielstand: any) => {
            const { data, error } = await (api.api.save as any)[aktuelleUserId].post(neuerSpielstand);
            if (error) throw new Error("Fehler beim Speichern");
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gameState", aktuelleUserId] })
        }
    });

    // HIER KOMMT SCHRITT 3 HIN (Lade- und Fehlerzustände abfangen)
    if (isLoading) return <div>Lade Spielstand aus der MongoDB...</div>;
    if (error || !gameData) return <div>Fehler beim Laden des Spiels.</div>;



    function handleClick() {
        props.socket.send(JSON.stringify({ method: "cookie-click" }));
        // return setCounter(counter + countPerClick)
    }


    function buyVerdoppler() {
        if (liveCounter >= gameData.preisVerdoppler) {
            console.log("Klick Verdoppler gekauft")
            const neuerPreis = Math.round(gameData.preisVerdoppler * 2.3)
            const neuerCount = liveCounter - gameData.preisVerdoppler
            const neuerClickCount = gameData.countPerClick * 2

            saveMutation.mutate({
                counter: neuerCount,
                preisVerdoppler: neuerPreis,
                countPerClick: neuerClickCount
            });
        }
        else return null
    }

    function buyAutoClicker() {


        if (liveCounter >= gameData.preisAutoClicker) {
            const neueAnzahl = gameData.anzahlAutoClicker + 1
            const neueClicksProSekunde = neueAnzahl * gameData.autoClickMultiplier * (1000 / gameData.autoClickerSpeed);
            const neuerPreis = Math.round(gameData.preisAutoClicker * 1.5)
            const neuerCount = liveCounter - gameData.preisAutoClicker


            saveMutation.mutate({
                counter: neuerCount,
                anzahlAutoClicker: neueAnzahl,
                anzahlAutoClicksproSekunde: neueClicksProSekunde,
                preisAutoClicker: neuerPreis

            });

        }
        else return;

    }

    function buyAutoClickMultiplier() {

        if (liveCounter >= gameData.preisAutoClickerMultiplier && gameData.anzahlAutoClicksproSekunde > 0) {
            const neuerMultiplier = gameData.autoClickMultiplier + 1
            const neueClicksProSekunde = gameData.anzahlAutoClicker * neuerMultiplier * (1000 / gameData.autoClickerSpeed)
            const neuerPreis = Math.round(gameData.preisAutoClickerMultiplier * 1.6)
            const neuerCount = liveCounter - gameData.preisAutoClickerMultiplier

            console.log("Auto Clicks Multiplier erhöht")
            saveMutation.mutate({
                counter: neuerCount,
                preisAutoClickerMultiplier: neuerPreis,
                autoClickMultiplier: neuerMultiplier,
                anzahlAutoClicksproSekunde: neueClicksProSekunde

            });

        }
        else return console.log("Du besitzt noch keinen Auto Clicker");
    }

    function buyAutoClickerSpeed() {

        if (liveCounter >= gameData.preisAutoClickerSpeed && gameData.anzahlAutoClicksproSekunde > 0) {
            const neuerSpeed = gameData.autoClickerSpeed / 2
            const neueClicksProSekunde = gameData.anzahlAutoClicker * gameData.autoClickMultiplier * (1000 / neuerSpeed)
            const neuerPreis = Math.round(gameData.preisAutoClickerSpeed * 10)
            const neuerCount = liveCounter - gameData.preisAutoClickerSpeed


            saveMutation.mutate({
                counter: neuerCount,
                preisAutoClickerSpeed: neuerPreis,
                autoClickerSpeed: neuerSpeed,
                anzahlAutoClicksproSekunde: neueClicksProSekunde

            });
        }

    }


    function resetGame() {
        if (!confirm("Möchtest du wirklich neustarten? Dein ganzer Spielstand geht verloren")) return;


        saveMutation.mutate(INITIAL_GAME_STATE);
    }


    // useEffect(() => {
    //     if (anzahlAutoClicksproSekunde === 0) return;

    //     const timerId = setInterval(() => {
    //         setCounter(prev => prev + anzahlAutoClicksproSekunde)
    //     }, 1000);

    //     return () => {
    //         clearInterval(timerId);
    //     };



    // }, [anzahlAutoClicksproSekunde])




    return (
        <>
            <h1><button onClick={() => resetGame()}>Spielstand zurücksetzen</button></h1>
            <div className="flex flex-col items-center mt-[50px]">
                <Button className="p-0 bg-transparent hover:bg-transparent shadow-none border-none size-35 active:scale-95 transition-transform" onClick={handleClick}>
                    <img src={cookieImg} alt="Klick mich" className="w-full h-full object-contain" />
                </Button>
                <p className="counter">{Number(liveCounter).toLocaleString('de-DE')}</p>
            </div>

            <div className="flex flex-col w-full flex-wrap justify-center gap-1 text">
                <Badge className="bg-sky-200 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold text-[17px]">Punkte pro Klick: {gameData.countPerClick}</Badge>
                <Badge className="bg-sky-200 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold text-[17px]">AutoClicker: {gameData.anzahlAutoClicker}</Badge>
                <Badge className="bg-sky-200 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold text-[17px]">Current AutoClick Multiplier: {gameData.autoClickMultiplier}</Badge>
                <Badge className="bg-sky-200 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold text-[17px]">AutoClick punkte pro Sekunde: {gameData.anzahlAutoClicksproSekunde} </Badge>
            </div>
            {/* <button onClick={() => buyAutoClickerSpeed}>asdsfs</button> */}

            <div className="flex flex-col items-end w-49 ml-auto">
                <h2 className="flex mr-22 font-bold text-xl ">Shop</h2>
                <div className="border-b-blue-950">
                    <Shop titel={"2x Klick"} preis={Number(gameData.preisVerdoppler).toLocaleString('de-DE')} onShopClick={() => buyVerdoppler()}></Shop>
                    <Shop titel={"+1 AutoClicker"} preis={Number(gameData.preisAutoClicker).toLocaleString('de-DE')} onShopClick={() => buyAutoClicker()}></Shop>
                    <Shop titel={"+1 Autoclicker Multiplier"} preis={Number(gameData.preisAutoClickerMultiplier).toLocaleString('de-DE')} onShopClick={() => buyAutoClickMultiplier()}></Shop>
                    <Shop titel={"Halbiere Zeit für AutoClick"} preis={Number(gameData.preisAutoClickerSpeed).toLocaleString('de-DE')} onShopClick={() => buyAutoClickerSpeed()}></Shop>
                </div>
            </div>



        </>
    )
}


export function Shop({ titel, preis, onShopClick }) {


    return (
        <div className="flex flex-col items-center gap-2 p-3 w-55 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 shadow-sm transition-all hover:shadow-md">
            <p className= "font-bold">{titel}</p>
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                Preis: {preis}
            </Badge>
            <Button onClick={onShopClick}>kaufen</Button>
        </div>
    )
}




interface BuyAlertProps {
    titel: string;
    beschreibung: string;
}


function BuyAlert({ titel, beschreibung }: BuyAlertProps) {
    const [isVisible, setIsVisible] = useState(true);


    useEffect(() => {
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 4000);

        return () => clearTimeout(timer)
    }, [titel, beschreibung])

    if (!isVisible) return null;

    return (
        <>
            <Alert className=" bg-emerald-200 transition-all duration-300">
                <CheckCircle2Icon className="h-4 w-4" />
                <AlertTitle>{titel}</AlertTitle>
                <AlertDescription >
                    {beschreibung}
                </AlertDescription>
            </Alert>
        </>
    )
}

