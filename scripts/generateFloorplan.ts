import fs from "fs";
import OpenAI from "openai";

import dotenv from "dotenv";

import converter from "number-to-words";
import pluralize from "pluralize";
import _ from "lodash";

dotenv.config();

const openai = new OpenAI();

async function fillMask() {
  const image = await openai.images.edit({
    image: fs.createReadStream("design/images/room.png"),
    mask: fs.createReadStream("design/images/mask.png"),
    prompt: "The whole picture is a top view of a room layout blueprint inspired by 2Advanced style. There are two rooms in the blueprint. They are detailed with blueprint-style borders and cute, playful elements. The first one is a bed room. You must decide what elements are suitable for a bedroom settings, it should at least include some common household items that are appropriate to put into a bedroom. It should at least include some plants and toys. All the elements are in the same blueprint style as the room. The design has a warm, inviting atmosphere with hues of green, pastel accents, and a touch of pink, creating a family-friendly and welcoming feel. The room's top left corner has a coordinate of (450,150) and the room has a size of 300x300 pixels. The room has a door at the location (676.2812652174364, 685) and a size of 60x30 pixels. You must not place anything within the door area. The second one is a living room. You must decide what elements are suitable for a living room settings, it should at least include some common household items that are appropriate to put into a living room. It should at least include some plants and toys. All the elements are in the same blueprint style as the room. The design has a warm, inviting atmosphere with hues of green, pastel accents, and a touch of pink, creating a family-friendly and welcoming feel. The room's top left corner has a coordinate of (750,150) and the room has a size of 350x350 pixels. The room has a door at the location (780, 494) and a size of 60x30 pixels. You must not place anything within the door area.",
  });

  console.log(image.data);
}

const RoomDescribers = {
  "bedroom": "The bedroom contains common household items such as a bed, nightstand, wardrobe, and bookshelf, all in a blueprint style. The bed is placed centrally with a cozy, inviting look. There are small plants on the nightstand and a shelf, and a few toys scattered around, adding a playful touch.",
  "living room": "The living room includes typical elements such as a sofa, coffee table, TV stand, and bookshelf, all in the same blueprint style. The sofa is placed against one wall with a coffee table in front. There are plants on the coffee table and in the corners of the room, along with toys scattered playfully.",
  "kichen": "The kitchen features a stove, refrigerator, sink, and dining table, all in a blueprint style. The stove is placed against one wall with a refrigerator next to it. The sink is located near the window, and the dining table is in the center of the room. There are small plants on the windowsill and a few toys on the floor, adding a playful touch.",
  "restroom": "The bathroom includes a bathtub, toilet, sink, and mirror, all in a blueprint style. The bathtub is placed against one wall with the toilet next to it. The sink is located near the mirror, and there are small plants on the windowsill. The room has a clean, modern look with a touch of greenery.",
}

function getRoomDescription(roomName: string) {

  const keys = Object.keys(RoomDescribers);

  for (const key of keys) {
    if (roomName.toLowerCase().includes(key)) {
      return RoomDescribers[key as keyof typeof RoomDescribers];
    }
  }

  return "";
}

function generatePrompt() {
  // read json file
  const roomData = fs.readFileSync("data/loft.json");
  const rooms = JSON.parse(roomData.toString());

  let composedPrompt = "A top view of a loft layout blueprint inspired by the 2Advanced style. ";

  const allRoomNames = rooms.rooms.filter((room: any) => room.type === "room").map((room: any) => `a ${room.name}`) ?? [];

  composedPrompt += `The design features ${converter.toWords(allRoomNames.length)} ${pluralize("rooms", allRoomNames.length) }: ${allRoomNames.slice(0, -1).join(", ")} and ${_.last(allRoomNames)}. The blueprint has a warm, inviting atmosphere with hues of green, pastel accents, and a touch of pink, creating a family-friendly and welcoming feel. Both rooms are outlined with blueprint-style borders, and the elements inside them are also rendered in a playful blueprint style. \n\n`;

  for (const room of rooms.rooms) {

    if (room.type !== "room") {
      continue;
    }
    composedPrompt += "**" + _.startCase(room.name) + ` (top left corner at ${room.x},${room.y}; size ${room.width}x${room.height} pixels):** `;

    composedPrompt += getRoomDescription(room.name);
    composedPrompt += "\n\n";
  }

  let hallwayCount = 1;
  for (const index in rooms.rooms) {
    const room = rooms.rooms[index];

    if (room.type !== "hallway") {
      continue;
    }
    composedPrompt += `** Hallway ${hallwayCount++} (top left corner at ${room.x},${room.y}; size ${room.width}x${room.height} pixels):** `;

    composedPrompt += "The area contains no furniture or items, serving as a passage between the rooms. ";
    composedPrompt += "\n\n";
  }

  for (const index in rooms.doors) {
    const door = rooms.doors[index];

    composedPrompt += `** Door ${parseInt(index) + 1} (at ${door.x},${door.y}; size ${door.width}x${door.height} pixels):** `;

    composedPrompt += "The door is placed between two rooms, providing access between them. ";
    composedPrompt += "\n\n";
  }

  composedPrompt += "The overall design is detailed and warm, with a family-friendly vibe, blending the modern and cozy with playful elements. "

  composedPrompt += `The picture you generated must depict exactly ${allRoomNames.length} number of rooms. Each room's top left corner must be at the specified coordinates and have the specified size. The door of each room must be at the specified location and have the specified size. \n` +
  "- No items should be placed within the door area. \n" +
  "- You are definitely not allowed to create any new rooms other than the ones specified. \n" +
  "- You are definitely not allowed to put any items in the hallway area. \n"

  console.log(composedPrompt);
}

async function main() {
  generatePrompt()
  
}
main();