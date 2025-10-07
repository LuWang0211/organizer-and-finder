'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createLocation } from '@/services/locationService'
import { getSession } from '@/auth'

// Validation schema
const addLocationSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  icon: z.string().optional()
})

type ActionResult = { ok: true } | { ok: false; error: string }

export async function addLocation(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  // Session validation
  const session = await getSession()
  if (!session?.dbUser?.familyId) {
    return { ok: false as const, error: 'Unauthorized. Please log in.' }
  }

  // Parse and validate input
  const validationResult = addLocationSchema.safeParse({
    roomId: formData.get('roomId')?.toString().trim(),
    name: formData.get('name')?.toString().trim(),
    icon: formData.get('icon')?.toString().trim() || undefined
  })

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0]
    return { ok: false as const, error: firstError.message }
  }

  const { roomId, name, icon } = validationResult.data

  try {
    await createLocation(roomId, name, { icon: (icon as any) || undefined })
    revalidatePath('/house_layout')
    return { ok: true as const }
  } catch (e: any) {
    console.error('Error creating location:', e)

    // Provide user-friendly error messages
    if (e?.code === 'P2002') {
      return { ok: false as const, error: 'A location with this name already exists in this room.' }
    }

    const reason = (e?.message as string) || 'Failed to create location. Please try again.'
    return { ok: false as const, error: reason }
  }
}
