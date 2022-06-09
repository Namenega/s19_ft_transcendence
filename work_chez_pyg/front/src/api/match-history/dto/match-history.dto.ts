import { UserDto } from "../../user/dto/user.dto"

export interface MatchHistoryDto {
  id: number;
  me: UserDto;
  my_score: number;
  opponent_id: number;
  opponent_score: number;
}

export interface CompleteMatchHistoryDto {
  id: number;
  me: UserDto;
  my_score: number;
  opponent: UserDto;
  opponent_score: number;
}