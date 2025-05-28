import { TypeSetting } from "@prisma/client";
import { IGlobalSetting } from "../interfaces/global-setting";
export const globalSettingDatas: IGlobalSetting[] = [
    {
        typeSetting: TypeSetting.AUTOMATION_SEND_EMAIL_VERIFICATION,
        name: 'Automation Send Email Verification',
        description: 'This setting to allow send email verification when user register',
        isActivated: true,
    },
    {
        typeSetting: TypeSetting.REQUIRE_VERIF_EMAIL_FOR_LOGIN,
        name: 'Setting Require Verify Email',
        description: 'This setting to set require verify email for login',
        isActivated: true
    }
]