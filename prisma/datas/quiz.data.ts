import { IQuiz } from "../interfaces/quiz";

export const quizData: IQuiz[] = [
    {
        title: 'ASL Alphabet Quiz',
        slug: 'asl-alphabet-quiz',
        questions: [
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_a.png',
                answers: generateAnswers('A'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_b.png',
                answers: generateAnswers('B'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_c.png',
                answers: generateAnswers('C'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_d.png',
                answers: generateAnswers('D'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_e.png',
                answers: generateAnswers('E'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_f.png',
                answers: generateAnswers('F'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_g.png',
                answers: generateAnswers('G'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_h.png',
                answers: generateAnswers('H'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_i.png',
                answers: generateAnswers('I'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_j.png',
                answers: generateAnswers('J'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_k.png',
                answers: generateAnswers('K'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_l.png',
                answers: generateAnswers('L'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_m.png',
                answers: generateAnswers('M'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_n.png',
                answers: generateAnswers('N'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_o.png',
                answers: generateAnswers('O'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_p.png',
                answers: generateAnswers('P'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_q.png',
                answers: generateAnswers('Q'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_r.png',
                answers: generateAnswers('R'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_s.png',
                answers: generateAnswers('S'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_t.png',
                answers: generateAnswers('T'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_u.png',
                answers: generateAnswers('U'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_v.png',
                answers: generateAnswers('V'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_w.png',
                answers: generateAnswers('W'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_x.png',
                answers: generateAnswers('X'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_y.png',
                answers: generateAnswers('Y'),
            },
            {
                text: 'What is the letter for this sign?',
                imageUrl: 'https://example.com/images/asl_z.png',
                answers: generateAnswers('Z'),
            },
        ],
    },
];

// Helper function to generate answers
function generateAnswers(correctAnswer: string) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const shuffled = alphabet.sort(() => 0.5 - Math.random());
    const answers = shuffled.slice(0, 3).filter(letter => letter !== correctAnswer);
    answers.push(correctAnswer);
    return answers.sort().map(answer => ({
        text: answer,
        isCorrect: answer === correctAnswer,
    }));
}
