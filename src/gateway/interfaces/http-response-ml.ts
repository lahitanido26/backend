export interface AslResponse {
    isDetected: boolean
    bounding_box: Array<number>;
    label: string;
    probability: number;
}