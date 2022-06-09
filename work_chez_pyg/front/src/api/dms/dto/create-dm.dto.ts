import { DmDto } from "./dm.dto";

export type CreateDmDto = Omit<DmDto, "id">;