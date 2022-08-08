import { MatchHistoryDto } from "./match-history.dto";

export type CreateMatchHistoryDto = Omit<MatchHistoryDto, "id">;