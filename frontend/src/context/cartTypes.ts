export type Protein = 'chicken' | 'steak' | 'veg'
export type RiceType = 'white' | 'brown'
export type BeansType = 'black' | 'pinto'

export type CartCustomization = {
  protein: Protein
  rice: RiceType
  beans: BeansType
  toppings: string[]
  extras: { cheese: boolean; guac: boolean }
}

export function defaultCustomization(): CartCustomization {
  return {
    protein: 'chicken',
    rice: 'white',
    beans: 'black',
    toppings: ['Lettuce', 'Pico de gallo'],
    extras: { cheese: true, guac: false },
  }
}

export function drinkCustomization(): CartCustomization {
  return {
    protein: 'veg',
    rice: 'white',
    beans: 'black',
    toppings: [],
    extras: { cheese: false, guac: false },
  }
}

export function extraCostForCustomization(c: CartCustomization): number {
  let n = 0
  if (c.extras.cheese) n += 0.75
  if (c.extras.guac) n += 2.25
  return n
}

export function customizationKey(c: CartCustomization): string {
  return JSON.stringify({
    protein: c.protein,
    rice: c.rice,
    beans: c.beans,
    toppings: [...c.toppings].sort(),
    cheese: c.extras.cheese,
    guac: c.extras.guac,
  })
}
