export interface IQuizQuestion {
    number: number;
    imageUrl: string;
    question: string;
    choices: string[];
    answer: string;
    point: number;
}

export interface IQuizHistory {
    number: number;
    imageUrl: string;
    question: string;
    answer: string;
    point: number;
    isCorrect: boolean;
    myAnswer: string;
}