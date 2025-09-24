import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card'
import { Icon } from '@/ui/components/icon'
import { Package } from 'lucide-react'
import { createItem } from '@/services/itemService'
import { fetchAllLocationsForCurrentUser } from '@/services/locationService'
import AddItemForm from './AddItemForm'

export default async function AddItemPage({ searchParams }: { searchParams?: Promise<{ locationId?: string | string[] }> }) {
  const locations = await fetchAllLocationsForCurrentUser()
  const sp = await (searchParams ?? Promise.resolve<{ locationId?: string | string[] }>({}))
  const raw = sp.locationId
  const defaultLocationId = Array.isArray(raw) ? raw[0] : raw

  async function addItem(_prev: { ok: true } | { ok: false; error: string } | null, formData: FormData) {
    'use server'
    const name = formData.get('name')?.toString().trim()
    const locationId = formData.get('locationId')?.toString().trim()
    const icon = formData.get('icon')?.toString().trim()
    const qtyRaw = formData.get('quantity')?.toString() ?? formData.get('__qty_fallback')?.toString()
    let quantity = parseInt(qtyRaw || '1', 10)
    if (!Number.isFinite(quantity) || quantity <= 0) quantity = 1

    if (!name) {
      return { ok: false as const, error: 'Name is required' }
    }

    try {
      await createItem(name, { locationId: locationId || undefined, icon: (icon as any) || undefined, quantity })
      revalidatePath('/')
      return { ok: true as const }
    } catch (e: any) {
      const reason = (e?.message as string) || 'Error creating item'
      return { ok: false as const, error: reason }
    }
  }

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
