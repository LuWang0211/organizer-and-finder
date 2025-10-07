import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card'
import { Icon } from '@/ui/components/icon'
import { Package } from 'lucide-react'
import { fetchLocationsForHouse } from '@/services/locationService'
import { fetchHouseForFamily } from '@/services/roomService'
import { getSession } from '@/auth'
import AddItemForm from './AddItemForm'
import { addItem } from './actions'
import AuthProtectedComponent from '@/AuthProtectedComponent'

export const dynamic = 'force-dynamic'

async function DataLoader({ searchParams }: { searchParams?: Promise<{ locationId?: string | string[] }> }) {
  const session = await getSession()
  if (!session) return null

  const house = await fetchHouseForFamily(session.dbUser.familyId!)
  if (!house) throw new Error('No house found for family')

  const locations = await fetchLocationsForHouse(house.id)
  const sp = await (searchParams ?? Promise.resolve<{ locationId?: string | string[] }>({}))
  const raw = sp.locationId
  const defaultLocationId = Array.isArray(raw) ? raw[0] : raw

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4 text-center">
          <div className="flex justify-center mb-6">
            <Icon variant="secondary" size="lg">
              <Package />
            </Icon>
          </div>
          <CardTitle className="text-3xl font-extrabold mb-2">Add Item</CardTitle>
          <p className="text-base text-text-main/80 font-medium">Create a new item and optionally link to a location.</p>
        </CardHeader>
        <CardContent>
          <AddItemForm
            locations={locations}
            action={addItem}
            defaultLocationId={defaultLocationId}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default function AddItemPage({ searchParams }: { searchParams?: Promise<{ locationId?: string | string[] }> }) {
  return (
    <AuthProtectedComponent>
      <DataLoader searchParams={searchParams} />
    </AuthProtectedComponent>
  )
}

