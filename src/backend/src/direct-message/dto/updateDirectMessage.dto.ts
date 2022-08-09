import { PartialType } from "@nestjs/mapped-types";
import { CreateDirectMessageDto } from "./createDirectMessage.dto";

/* `UpdateDirectMessageDto` is a class that extends `CreateDirectMessageDto` and is
used to update a direct message */
export class UpdateDirectMessageDto extends PartialType(CreateDirectMessageDto)
{}
