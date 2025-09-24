import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card'
import { Icon } from '@/ui/components/icon'
import { MapPin } from 'lucide-react'
import { createLocation } from '@/services/locationService'
import { fetchRoomsForCurrentUser } from '@/services/roomService'
import AddLocationForm from './AddLocationForm'

export default async function AddLocationPage({ searchParams }: { searchParams?: Promise<{ roomId?: string }> }) {
  const rooms = await fetchRoomsForCurrentUser()
  const defaultRoomId = searchParams ? (await searchParams)?.roomId : undefined

  async function addLocation(_prev: { ok: true } | { ok: false; error: string } | null, formData: FormData) {
    'use server'
    const roomId = formData.get('roomId')?.toString().trim()
    const name = formData.get('name')?.toString().trim()
    const icon = formData.get('icon')?.toString().trim()

    if (!roomId) return { ok: false as const, error: 'Room is required' }
    if (!name) return { ok: false as const, error: 'Name is required' }

    try {
      await createLocation(roomId, name, { icon: (icon as any) || undefined })
      revalidatePath('/house_layout')
      return { ok: true as const }
    } catch (e: any) {
      return { ok: false as const, error: (e?.message as string) || 'Error creating location' }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4 text-center">
          <div className="flex justify-center mb-6">
            <Icon variant="orange" size="lg">
              <MapPin />
            </Icon>
          </div>
          <CardTitle className="text-3xl font-extrabold mb-2">Add Location</CardTitle>
          <p className="text-base text-text-main/80 font-medium">Create a location under a room.</p>
        </CardHeader>
        <CardContent>
          <AddLocationForm
            rooms={rooms.map(r => ({ id: r.id, name: r.name }))}
            action={addLocation}
            defaultRoomId={defaultRoomId}
          />
        </CardContent>
      </Card>
    </div>
  )
}

