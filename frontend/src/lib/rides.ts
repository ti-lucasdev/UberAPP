import type { CalculationInput } from '../types'

export type Ride = {
  id: string
  user_id: string
  created_at: string
  uber: number
  ninety_nine: number
  particular: number
  in_driver: number
  kilometers: number
  fuel_price: number
  vehicle_average: number
}

export function rideToInput(ride: Ride): CalculationInput {
  return {
    uber: Number(ride.uber),
    ninetyNine: Number(ride.ninety_nine),
    particular: Number(ride.particular),
    inDriver: Number(ride.in_driver),
    kilometers: Number(ride.kilometers),
    fuelPrice: Number(ride.fuel_price),
    vehicleAverage: Number(ride.vehicle_average),
  }
}
