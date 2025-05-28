export interface IPracticeHistory {
    number: number;
    imageUrl: string;
    question: string;
    answer: string;
    point: number;
    isCorrect: boolean;
    myAnswer: string;
}

export interface IPracticeQuestion {
    number: number;
    imageUrl: string;
    question: string;
    answer: string;
    point: number;
}