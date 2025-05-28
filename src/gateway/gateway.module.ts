import { Module } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from "../helpers/helper.module";
import { GatewayMlRepository } from "./repository/gateway-ml.repository";
import { GatewayStorageBucketRepository } from "./repository/gateway-storage-bucket.repository";

@Module({
    imports: [
        PrismaModule,
        HelperModule,
        ConfigModule,
    ],
    providers: [
        GatewayService,
        GatewayMlRepository,
        GatewayStorageBucketRepository
    ],
    controllers: [],
    exports: [
        GatewayService,
    ]
})
export class GatewayModule { }