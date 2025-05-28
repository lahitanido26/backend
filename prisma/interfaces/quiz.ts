interface Answer {
    text: string;
    isCorrect: boolean;
}

interface Question {
    text: string;
    imageUrl?: string;
    answers: Answer[];
}

export interface IQuiz {
    title: string;
    slug: string,
    questions: Question[];
}
