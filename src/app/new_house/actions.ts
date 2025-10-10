"use server";

import { getSession } from "@/auth";
import prisma from "@/services/db";
import { getLayoutData } from "./layoutService";

type FormState = {
  error?: string;
  success?: boolean;
};

export async function createHouse(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const session = await getSession();
    if (!session?.dbUser?.familyId) {
      return { error: "Unauthorized" };
    }

    const familyId = session.dbUser.familyId;
    const layoutType = formData.get("layoutType") as string;
    const houseName = formData.get("houseName") as string;

    if (!layoutType || !houseName) {
      return { error: "Layout type and house name are required" };
    }

    // Check if family already has a house
    const existingHouse = await prisma.house.findFirst({
      where: { familyId },
    });

    if (existingHouse) {
      return { error: "Family already has a house" };
    }

    // Load layout data
    const layoutData = getLayoutData(layoutType);

    // Create house and rooms in a transaction
    await prisma.$transaction(async (tx) => {
      // Create the house
      const house = await tx.house.create({
        data: {
          name: houseName.trim(),
          familyId,
          metadata: layoutData.house as any,
        },
      });

      // Create rooms from layout data
      for (const roomData of layoutData.rooms) {
        await tx.room.create({
          data: {
            id: `${house.id}_${roomData.id}`,
            name: roomData.name,
            familyId,
            houseId: house.id,
            metadata: roomData.metadata as any,
          },
        });
      }
    });

    // Return success status for client-side redirect
    return { success: true };
  } catch (error) {
    console.error("Error creating house:", error);
    return { error: "Failed to create house" };
  }
}
