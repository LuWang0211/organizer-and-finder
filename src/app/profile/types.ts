export interface ProfileData {
  user: {
    name: string;
    email: string;
    username: string;
  };
  family: {
    id: number;
    name: string;
  } | null;
  house: {
    id: number;
    name: string;
  } | null;
  stats: {
    totalItems: number;
    totalRooms: number;
  };
}
