import { PrismaClient } from '@prisma/client';
import prismaMock, { MockPrismaClient } from '../__mocks__/prismaMock';
import { fetchLocationsByRoom } from '../locationService';

describe('Location Service Functions', () => {
  const roomId = 'Sample_Room_ID';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch locations by room ID successfully', async () => {
    const mockLocations = [
      {
        id: 'Sample_Room_ID_1',
        name: 'Sample Location 1',
        roomId: 1,
        items: [
          { id: 1, name: 'Item 1', quantity: 5, inotherobject: false, otherobjectid: null },
          { id: 2, name: 'Item 2', quantity: 10, inotherobject: false, otherobjectid: null },
        ],
      },
      {
        id: 'Sample_Room_ID_2',
        name: 'Sample Location 2',
        roomId: 1,
        items: [
          { id: 3, name: 'Item 3', quantity: 2, inotherobject: true, otherobjectid: 1 },
        ],
      },
    ];
    
    (prismaMock.location.findMany as jest.Mock).mockResolvedValue(mockLocations);

    const locations = await fetchLocationsByRoom(roomId, MockPrismaClient() as unknown as PrismaClient);
    expect(locations).toEqual(mockLocations);
    expect(prismaMock.location.findMany).toHaveBeenCalledWith({
        where: { roomId },
        // select: { id: true, name: true },
        include: {
          items: {
            select: {
              id: true,
              name: true,
              quantity: true,
              inotherobject: true,
              otherobjectid: true,
            },
          },
        },
    });

  });
});
