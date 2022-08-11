import { UserDto } from "../../user/dto/user.dto"

export interface MatchHistoryDto {
  id: number;
  user: UserDto;
  userScore: number;
  opponentId: number;
  opponentScore: number;
}

export interface CompleteMatchHistoryDto {
  id: number;
  user: UserDto;
  userScore: number;
  opponent: UserDto;
  opponentScore: number;
}