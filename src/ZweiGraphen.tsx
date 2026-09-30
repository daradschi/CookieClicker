"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceLine, Label, } from "recharts"
import { useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"

import { Link } from "@tanstack/react-router"

import CometDial from '@/components/ui/progress';

export const description = "A multiple line chart"

const chartData = [
    {  day: "1. ", September: 12, August: 14 },
    {  day: "2. ", September: 14, August: 15 },
    {  day: "3. ", September: 15, August: 16 },
    {  day: "4. ", September: 11, August: 15 },
    {  day: "5. ", September: 12, August: 15 },
    {  day: "6. ", September: 12, August: 14 },
    {  day: "7. ", September: 12, August: 13 },
    {  day: "8. ", September: 16, August: 13 },
    {  day: "9. ", September: 13, August: 13 },
    { day: "10. ", September: 14, August: 13 },
    { day: "11. ", September: 15, August: 12 },
    { day: "12. ", September: 14, August: 13 },
    { day: "13. ", September: 14, August: 13 },
    { day: "14. ", September: 13, August: 12 },
    { day: "15. ", September: 14, August: 11 },
    { day: "16. ", September: 13, August: 11 },
    { day: "17. ", September: 13, August: 12 },
    { day: "18. ", September: 12, August: 12 },
    { day: "19. ", September: 12, August: 13 },
    { day: "20. ", September: 12, August: 14 },
    { day: "21. ", September: 11, August: 15 },
    { day: "22. ", September: 11, August: 13 },
    { day: "23. ", September: 12, August: 12 },
    { day: "24. ", September: 13, August: 12 },
    { day: "25. ", September: 14, August: 12 },
    { day: "26. ", September: 15, August: 11 },
    { day: "27. ", September: 14, August: 13 },
    { day: "28. ", September: 15, August: 14 },
    { day: "29. ", September: 15, August: 13 },
    { day: "30. ", September: 14, August: 16 },
]
let sumSep = 0
let sumAug = 0
chartData.forEach(element => {
    sumSep += element.September
    sumAug += element.August
})


const chartConfig = {
    September: {
        label: "September",
        color: "var(--chart-1)",
    },
    August: {
        label: "August",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig


// const [progress, setProgress] = useState(0);


export default function ChartLineMultiple() {
    const prodZiel = 12

    const [progress, setProgress] = useState(0);
    const [produziert, setProduziert] = useState(0);
    function progressBerechnen() {
        const neueProd = produziert + 1
        const neuerProgress = (neueProd / prodZiel) * 100
        setProduziert(neueProd)
        setProgress(neuerProgress)
        console.log(`produziert: ${neueProd} progress: ${neuerProgress}`)
    }

    return (
        <div className="relative w-full min-h-screen bg-[#8EFFA2] p-6 text-slate-900 overflow-hidden">


            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                    backgroundSize: '24px 24px', // Bestimmt den Abstand der Punkte zueinander
                }}
            />

            <h2 className="flex justify-center font-bold">Heutiges Ziel: {produziert}/{prodZiel}</h2>
            <div className="flex justify-center">
                <CometDial
                    value={progress}
                    min={0}
                    max={100}
                    step={1}
                    unit="%"
                    label="Level"
                    accent="#f8f22a"
                    ink="#898ff0"
                    size={250}
                    sweep={320}
                    thickness={6.5}
                    speed={1}
                    tapBounce={0.2}
                    flickBounce={0.1}
                    momentum={1}
                    cometReach={180}
                    cometWidth={12}
                    onChange={value => console.log(value)}
                    onChangeEnd={(value, { velocity, bounce }) => console.log('settling toward', value, velocity, bounce)}

                />
            </div>
            <Card >
                <CardHeader>
                    <CardTitle>Produktionszahlen für einen Monat</CardTitle>
                    <CardDescription>1. bis 30. eines Monats</CardDescription>
                    <div className="flex justify-center gap-5">
                        <p className="border-2 rounded-lg p-2 font-medium"
                            style={{ borderColor: "green" }}>August Gesamt: {sumAug}</p>
                        <p className="border-2 rounded-lg p-2 font-medium"
                            style={{ borderColor: "blue" }}>September Gesamt: {sumSep}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <YAxis
                                domain={[10, 17]} // Setzt den festen Start- und Endpunkt der Achse
                                ticks={[10, 11, 12, 13, 14, 15, 16, 17]} // Zwingt Recharts, jeden dieser Einer-Schritte auszudrucken
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line
                                dataKey="September"
                                type="monotone"
                                stroke="blue"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                dataKey="August"
                                type="monotone"
                                stroke="green"
                                strokeWidth={2}
                                dot={false}
                            />
                            <ReferenceLine
                                y={12}
                                stroke="green"
                                strokeDasharray="4 4" // Macht die Linie gestrichelt (optional)
                                strokeWidth={2}
                            >
                                <Label
                                    value="Tagesziel: 12"
                                    position="insideTopLeft"
                                    fill="hsl(var(--muted-foreground))"
                                    className="text-xs font-medium"
                                />
                            </ReferenceLine>
                            <ChartLegend content={<ChartLegendContent />} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 leading-none font-medium">
                                Produktion hat sich um +5.2% verändert im Vergleich zu letztem Monat <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                1. bis 30. Tag des Monats
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <Link to="/daily" className="bg-blue-500 rounded-lg p-2 cursor-pointer">Zurück zu aktuellem Monat</Link>
            <div className="flex justify-center items-center  mx-auto mt-6">
                <button
                    className="flex items-center justify-center border-4 border-slate-700 rounded-2xl w-44 h-42 bg-white/50 active:scale-95 transition-transform"
                    onClick={() => progressBerechnen()}
                >
                    {/* Hier erzwingen wir die Größe direkt, unabhängig von Tailwind */}
                    <span style={{ fontSize: '100px', display: 'block' }}> 🚲 </span>
                </button>
            </div>
        </div>
    )
}
