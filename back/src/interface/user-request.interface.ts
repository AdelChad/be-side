import { Role } from "src/enum/role.enum";

export interface UserRequest {
    id: number,
    email: string,
    role: Role
}