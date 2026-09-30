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

const chartData = [
  { month:    "Januar", mulisProduziert: 186 },
  { month:   "Februar", mulisProduziert: 305 },
  { month:      "März", mulisProduziert: 237 },
  { month:     "April", mulisProduziert: 300 },
  { month:       "Mai", mulisProduziert: 209 },
  { month:      "Juni", mulisProduziert: 214 },
  { month:      "Juli", mulisProduziert: 179 },
  { month:    "August", mulisProduziert: 305 },
  { month: "September", mulisProduziert: 237 },
  { month:   "Oktober", mulisProduziert: 300 },
  { month:  "November", mulisProduziert: 209 },
  { month:  "Dezember", mulisProduziert: 214 },
]

const chartConfig = {
  mulisProduziert: {
    label: "Mulis Produziert: ",
    color: "blue",
  },
} satisfies ChartConfig
export default function ChartAreaDefault() {
  return (
    <>

      <h1><a href=""></a></h1>
      <Card className="max-w-3x1 mx-auto w-full">
        <CardHeader>
          <CardTitle >Produktionszahlen</CardTitle>
          <CardDescription>
            Produktionszahlen für das Jahr 2026
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                 left: 24,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <XAxis
                dataKey="month"
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
                y={180}
                stroke="green" // Nutzt die rote Shadcn-Variable für Fehler/Ziele
                strokeDasharray="4 4" // Macht die Linie gestrichelt (optional)
                strokeWidth={2}
              >
                <Label
                  value="Monatsziel: 180"
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
                Januar - Juni 2026
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Link to="/daily" className="bg-blue-500 rounded-lg p-2 cursor-pointer">Zur aktuellen Monatsübersicht</Link>
    
    </>
  )
}