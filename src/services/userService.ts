import { user } from "@prisma/client"
import prisma from '@/services/db';

export async function createUser(provider: string, email: string, name: string) {
    const newFamily = await prisma.family.create({
        data: {
            name: `${name}'s Family`
        }
    })

    return await prisma.user.create({
        data: {
            accountProvider: provider,
            email,
            username: email,
            name,
            password: "nopassword",
            familyId: newFamily.id
        }
    })
}

export async function getOrCreateUser(provider: string, email: string, name: string): Promise<user> {
    const user = await prisma.user.findFirst({
        where: {
            email,
            accountProvider: provider
        }
    })

    if (user) {
        return user
    }

    return createUser(provider, email, name);
}