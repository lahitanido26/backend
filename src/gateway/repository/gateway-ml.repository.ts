import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from 'axios'
import { AslResponse } from "../interfaces/http-response-ml";

@Injectable()
export class GatewayMlRepository {
    constructor() { }

    async httpPostPredictionAsl(file: Express.Multer.File) {
        const url: string = `${process.env.ML_API_URL}/predict`
        const formData = new FormData();
        const blob = new Blob([file.buffer], { type: file.mimetype });
        formData.append('file', blob, file.originalname);

        let detectionResult: AslResponse

        await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        }).then((res) => {
            detectionResult = res.data
        }).catch((err) => {
            console.log(err)
            throw new InternalServerErrorException("Server Machine Learning Error")
        })

        return detectionResult
    }
}
