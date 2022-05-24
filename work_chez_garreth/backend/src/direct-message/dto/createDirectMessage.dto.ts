import { OmitType } from "@nestjs/mapped-types";
import { DirectMessageEntity } from "../entities/directMessage.entity";

/* It's a class that extends the DirectMessageEntity class, but omits the id
property */
export class CreateDirectMessageDto extends OmitType(DirectMessageEntity, ["id"])
{}
