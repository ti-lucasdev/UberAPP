import type { Ride } from '../lib/rides'
import { rideToInput } from '../lib/rides'
import { calculateDriverProfit } from './calculations'

export type ReportPeriod = 'weekly' | 'monthly'

export type ReportDay = {
  key: string
  date: Date
  rides: number
  grossRevenue: number
  fuelCost: number
  kilometers: number
  rentalCost: number
  netValue: number
}

export type DriverReport = {
  periodLabel: string
  rides: number
  workedDays: number
  grossRevenue: number
  fuelCost: number
  kilometers: number
  rentalCost: number
  netBeforeRental: number
  netValue: number
  averagePerWorkedDay: number
  days: ReportDay[]
}

function startOfDay(value: Date): Date {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

function endOfDay(value: Date): Date {
  const date = new Date(value)
  date.setHours(23, 59, 59, 999)
  return date
}

function startOfWeek(value: Date): Date {
  const date = startOfDay(value)
  const daysSinceMonday = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - daysSinceMonday)
  return date
}

function dateKey(value: Date): string {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function weekKey(value: Date): string {
  return dateKey(startOfWeek(value))
}

function periodBounds(period: ReportPeriod, referenceDate: Date) {
  if (period === 'weekly') {
    const start = startOfWeek(referenceDate)
    const end = endOfDay(new Date(start))
    end.setDate(end.getDate() + 6)
    return { start, end }
  }

  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
  const end = endOfDay(new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0))
  return { start, end }
}

function labelForPeriod(period: ReportPeriod, start: Date, end: Date): string {
  if (period === 'monthly') {
    const label = start.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    return label.charAt(0).toUpperCase() + label.slice(1)
  }

  const startLabel = start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  const endLabel = end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  return `${startLabel} — ${endLabel}`
}

export function buildDriverReport(
  rides: Ride[],
  weeklyRental: number,
  period: ReportPeriod,
  referenceDate = new Date(),
): DriverReport {
  const { start, end } = periodBounds(period, referenceDate)
  const daysByWeek = new Map<string, Set<string>>()

  for (const ride of rides) {
    const rideDate = new Date(ride.created_at)
    const key = weekKey(rideDate)
    const workedDays = daysByWeek.get(key) ?? new Set<string>()
    workedDays.add(dateKey(rideDate))
    daysByWeek.set(key, workedDays)
  }

  const periodRides = rides.filter((ride) => {
    const date = new Date(ride.created_at)
    return date >= start && date <= end
  })
  const dayMap = new Map<string, ReportDay>()

  for (const ride of periodRides) {
    const date = new Date(ride.created_at)
    const key = dateKey(date)
    const input = rideToInput(ride)
    const result = calculateDriverProfit(input)
    const current = dayMap.get(key) ?? {
      key,
      date: startOfDay(date),
      rides: 0,
      grossRevenue: 0,
      fuelCost: 0,
      kilometers: 0,
      rentalCost: 0,
      netValue: 0,
    }

    current.rides += 1
    current.grossRevenue += result.grossRevenue
    current.fuelCost += result.fuelCost
    current.kilometers += result.kilometers
    current.netValue += result.netValue
    dayMap.set(key, current)
  }

  const safeWeeklyRental = Number.isFinite(weeklyRental) && weeklyRental > 0 ? weeklyRental : 0
  const days = [...dayMap.values()].map((day) => {
    const workedDaysInWeek = daysByWeek.get(weekKey(day.date))?.size ?? 0
    const rentalCost = workedDaysInWeek > 0 ? safeWeeklyRental / workedDaysInWeek : 0
    return { ...day, rentalCost, netValue: day.netValue - rentalCost }
  }).sort((a, b) => b.date.getTime() - a.date.getTime())

  const totals = days.reduce((sum, day) => ({
    rides: sum.rides + day.rides,
    grossRevenue: sum.grossRevenue + day.grossRevenue,
    fuelCost: sum.fuelCost + day.fuelCost,
    kilometers: sum.kilometers + day.kilometers,
    rentalCost: sum.rentalCost + day.rentalCost,
    netValue: sum.netValue + day.netValue,
  }), { rides: 0, grossRevenue: 0, fuelCost: 0, kilometers: 0, rentalCost: 0, netValue: 0 })
  const netBeforeRental = totals.netValue + totals.rentalCost

  return {
    periodLabel: labelForPeriod(period, start, end),
    ...totals,
    workedDays: days.length,
    netBeforeRental,
    averagePerWorkedDay: days.length > 0 ? totals.netValue / days.length : 0,
    days,
  }
}
