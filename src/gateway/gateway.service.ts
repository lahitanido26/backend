import { Injectable } from '@nestjs/common'
import { GatewayMlRepository } from './repository/gateway-ml.repository'
import { GatewayStorageBucketRepository } from './repository/gateway-storage-bucket.repository'
import { FolderBucketType } from '../helpers/helper'

@Injectable()
export class GatewayService {
    constructor(
        private readonly gatewayMlRepository: GatewayMlRepository,
        private readonly gatewayStorageBucketRepository: GatewayStorageBucketRepository

    ) { }

    async predictAsl(file: Express.Multer.File) {
        return await this.gatewayMlRepository.httpPostPredictionAsl(file)
    }

    // async uploadFile(file: Express.Multer.File, remoteFileName: string, folder: FolderBucketType) {
    //     return await this.gatewayStorageBucketRepository.uploadFile(file, remoteFileName, folder)
    // }
}