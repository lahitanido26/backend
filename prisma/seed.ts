import { PrismaClient } from '@prisma/client'
import { IGlobalSetting } from "./interfaces/global-setting"
import { globalSettingDatas } from "./datas/global-setting.data"
const prisma = new PrismaClient()

// seeder for global setting
async function seedGlobalSeeting(data: IGlobalSetting[]) {
    if (data.length > 0) {
        const globalSettings: IGlobalSetting[] = []
        for (const d of data) {
            // get data from d variable
            const { typeSetting } = d
            // check if data exist
            const isExist = await prisma.globalSetting.findUnique({ where: { typeSetting } })
            if (isExist) continue
            globalSettings.push(d)
        }
        await prisma.globalSetting.createMany({ data: globalSettings })
        console.log(`successfully seed the GlobalSetting ${globalSettings.length} datas.`)
    }
    return
}


async function main() {
    // running seeders
    seedGlobalSeeting(globalSettingDatas)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })