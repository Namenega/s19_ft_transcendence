import { UserDto } from "../../user/dto/user.dto"

export interface GameDto {
  id: number;
  user1: UserDto;
  user2: UserDto | null;
  ballspeed: number;
  map: string;
}