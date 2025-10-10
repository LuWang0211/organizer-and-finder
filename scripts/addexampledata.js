// Import the Prisma client
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create family
  const family = await prisma.family.create({
    data: {
      name: "SampleFamily",
    },
  });

  // Create user related to the family
  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      username: "sampleuser",
      password: "securepassword",
      accountProvider: "email",
      name: "Yoki",
      familyId: family.id,
    },
  });

  // Create rooms related to the family
  const roomNames = [
    "kitchen",
    "living_room",
    "bedroom_level_1",
    "restroom_level_1",
    "bedroom_level_2",
    "restroom_level_2",
    "closet",
  ];
  const rooms = [];

  for (const name of roomNames) {
    const room = await prisma.room.create({
      data: {
        name: name,
        familyId: 1,
        id: name + "_SampleFamily",
      },
    });
    rooms.push(room);
  }

  // Create locations in kitchen (4 locations)
  const kitchenLocations = [];
  for (let i = 1; i <= 4; i++) {
    const location = await prisma.location.create({
      data: {
        name: `KitchenContainer_${i}`,
        roomId: rooms[0].id, // Kitchen room ID
      },
    });
    kitchenLocations.push(location);
  }

  // Create locations in living room (2 locations)
  const livingRoomLocations = [];
  for (let i = 1; i <= 2; i++) {
    const location = await prisma.location.create({
      data: {
        name: `LivingRoomContainer_${i}`,
        roomId: rooms[1].id, // Living room ID
      },
    });
    livingRoomLocations.push(location);
  }

  // Create items for locations in the kitchen
  await prisma.item.createMany({
    data: [
      { name: "Item 1", locationid: kitchenLocations[0].id, quantity: 10 },
      { name: "Item 2", locationid: kitchenLocations[0].id, quantity: 5 },
      { name: "Item 3", locationid: kitchenLocations[0].id, quantity: 8 },
      { name: "Item 4", locationid: kitchenLocations[1].id, quantity: 3 },
      { name: "Item 5", locationid: kitchenLocations[1].id, quantity: 7 },
    ],
  });

  // Create items for locations in the living room
  await prisma.item.createMany({
    data: [
      {
        name: "LivingRoom Item 1",
        locationid: livingRoomLocations[0].id,
        quantity: 2,
      },
      {
        name: "LivingRoom Item 2",
        locationid: livingRoomLocations[0].id,
        quantity: 4,
      },
      {
        name: "LivingRoom Item 3",
        locationid: livingRoomLocations[0].id,
        quantity: 6,
      },
    ],
  });

  console.log("Data Example added successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
