import { TypeSetting } from "@prisma/client";

export interface IGlobalSetting {
    typeSetting: TypeSetting,
    name: string,
    description: string,
    isActivated: boolean
}