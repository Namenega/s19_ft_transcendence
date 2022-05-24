import { PartialType } from "@nestjs/mapped-types";
import { CreateDirectMessageListDto } from "./createDirectMessageList.dto";

/* `UpdateDirectMessageListDto` is a class that extends
`CreateDirectMessageListDto` and is used to update a direct message list */
export class UpdateDirectMessageListDto extends PartialType(CreateDirectMessageListDto)
{}
