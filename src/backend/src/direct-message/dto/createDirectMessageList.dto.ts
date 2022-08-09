import { OmitType } from "@nestjs/mapped-types";
import { DirectMessageListEntity } from "../entities/directMessageList.entity";

/* This class is used to create a new direct message list */
export class CreateDirectMessageListDto extends OmitType(DirectMessageListEntity, ["id"])
{}
