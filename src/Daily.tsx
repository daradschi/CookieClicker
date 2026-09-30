"use client"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine, Label } from "recharts"
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
    type ChartConfig,
} from "@/components/ui/chart"
import { Link } from "@tanstack/react-router"
export const description = "A simple area chart"

const dataMap = new Map<string, number>()

export const DailyChartData = [
    {  day: "1. September", mulisProduziert: 12 },
    {  day: "2. September", mulisProduziert: 14 },
    {  day: "3. September", mulisProduziert: 15 },
    {  day: "4. September", mulisProduziert: 11 },
    {  day: "5. September", mulisProduziert: 12 },
    {  day: "6. September", mulisProduziert: 12 },
    {  day: "7. September", mulisProduziert: 12 },
    {  day: "8. September", mulisProduziert: 16 },
    {  day: "9. September", mulisProduziert: 13 },
    { day: "10. September", mulisProduziert: 14 },
    { day: "11. September", mulisProduziert: 15 },
    { day: "12. September", mulisProduziert: 14 },
    { day: "13. September", mulisProduziert: 14 },
    { day: "14. September", mulisProduziert: 13 },
    { day: "15. September", mulisProduziert: 14 },
    { day: "16. September", mulisProduziert: 13 },
    { day: "17. September", mulisProduziert: 13 },
    { day: "18. September", mulisProduziert: 12 },
    { day: "19. September", mulisProduziert: 12 },
    { day: "20. September", mulisProduziert: 12 },
    { day: "21. September", mulisProduziert: 11 },
    { day: "22. September", mulisProduziert: 11 },
    { day: "23. September", mulisProduziert: 12 },
    { day: "24. September", mulisProduziert: 13 },
    { day: "25. September", mulisProduziert: 14 },
    { day: "26. September", mulisProduziert: 15 },
    { day: "27. September", mulisProduziert: 14 },
    { day: "28. September", mulisProduziert: 15 },
    { day: "29. September", mulisProduziert: 15 },
    { day: "30. September", mulisProduziert: 14 },
]
const chartConfig = {
    mulisProduziert: {
        label: "Mulis Produziert: ",
        color: "blue",
    },
} satisfies ChartConfig
export default function ChartAreaDefault() {
    return (
        <div className="relative w-full min-h-screen bg-[#8EFFA2] p-6 text-slate-900 overflow-hidden">


            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                    backgroundSize: '24px 24px', // Bestimmt den Abstand der Punkte zueinander
                }}
            />
            <Card className="max-w-3x1 mx-auto w-full">
                <CardHeader>
                    <CardTitle >Produktionszahlen</CardTitle>
                    <CardDescription>
                        Produktionszahlen für den Monat September
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={DailyChartData}
                            margin={{
                                left: 24,
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
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Area
                                dataKey="mulisProduziert"
                                type="natural"
                                fill="var(--color-mulisProduziert)"
                                fillOpacity={0.4}
                                stroke="var(--color-mulisProduziert)"
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
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 leading-none font-medium">
                                Produktion ist um 5.2% diesen Monat gestiegen <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                1. bis 30. September 2026
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <Link to="/zwei" className="bg-blue-500 rounded-lg p-2 cursor-pointer">Mit vorherigem Monat vergleichen</Link>
            <Link to="/test" className="bg-blue-500 rounded-lg p-2 cursor-pointer">Zur Jahresübersicht</Link>
        </div>
    )
}