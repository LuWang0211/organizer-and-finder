// src/services/__tests__/containerService.test.ts
import { PrismaClient } from '@prisma/client';
import prismaMock, { MockPrismaClient } from '../__mocks__/prismaMock';
import { fetchContainersByRoom } from '../containerService';

describe('Container Service Functions', () => {
  const roomId = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch containers by room ID successfully', async () => {
    const mockContainers = [
      {
        id: 1,
        name: 'Sample Location 1',
        roomId: 1,
        items: [
          { id: 1, name: 'Item 1', quantity: 5, inotherobject: false, otherobjectid: null },
          { id: 2, name: 'Item 2', quantity: 10, inotherobject: false, otherobjectid: null },
        ],
      },
      {
        id: 2,
        name: 'Sample Location 2',
        roomId: 1,
        items: [
          { id: 3, name: 'Item 3', quantity: 2, inotherobject: true, otherobjectid: 1 },
        ],
      },
    ];
    
    (prismaMock.location.findMany as jest.Mock).mockResolvedValue(mockContainers);

    const containers = await fetchContainersByRoom(roomId, MockPrismaClient() as unknown as PrismaClient);
    expect(containers).toEqual(mockContainers);
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
