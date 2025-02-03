// src/services/__tests__/itemServer.test.ts
import { PrismaClient } from '@prisma/client';
import prismaMock, { MockPrismaClient } from '../__mocks__/prismaMock';
import { fetchItems, fetchItemsByContainer } from '../itemService';

describe('Item Service Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchItems', () => {
    it('should fetch all items successfully', async () => {
      const mockItems = [
        { id: 1, name: 'Item 1', quantity: 5, inotherobject: false, otherobjectid: null },
        { id: 2, name: 'Item 2', quantity: 10, inotherobject: false, otherobjectid: null },
      ];

      (prismaMock.item.findMany as jest.Mock).mockResolvedValue(mockItems);

      const items = await fetchItems(MockPrismaClient() as unknown as PrismaClient);
      expect(items).toEqual(mockItems);
      expect(prismaMock.item.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchItemsByContainer', () => {
    it('should fetch items by container ID successfully', async () => {
      const locationId = 1;
      const mockItemsByContainer = [
        { id: 1, name: 'Item 1', quantity: 5, inotherobject: false, otherobjectid: null },
        { id: 3, name: 'Item 3', quantity: 2, inotherobject: true, otherobjectid: 1 },
      ];

      (prismaMock.item.findMany as jest.Mock).mockResolvedValue(mockItemsByContainer);

      const items = await fetchItemsByContainer(locationId, MockPrismaClient() as unknown as PrismaClient);
      expect(items).toEqual(mockItemsByContainer);
      expect(prismaMock.item.findMany).toHaveBeenCalledWith({
        where: { locationid: locationId },
        select: { id: true, name: true, quantity: true, inotherobject: true, otherobjectid: true },
      });
    });
  });
});
