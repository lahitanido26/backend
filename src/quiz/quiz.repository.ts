import { BadRequestException, Injectable } from '@nestjs/common';
import { QuizQuery } from '../prisma/queries/quiz/quiz.query';
import { CreateQuizDto, UpdateQuizDto } from './dto/create-quiz.dto';
import { generateBackgroundClass, generateSlug } from '../helpers/helper';
import { Prisma } from '@prisma/client';
import { LessonRepository } from '../lesson/lesson.repository';
import { PrismaService } from '../prisma/prisma.service';
import { IQuizHistory, IQuizQuestion } from './interfaces/quiz.interface';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizRepository {
    constructor(
        private readonly quizQuery: QuizQuery,
        private readonly lessonRepository: LessonRepository,
        private readonly prisma: PrismaService
    ) { }

    async findQuizByIdOrThrow(id: string) {
        const quiz = await this.quizQuery.findById(id);
        if (!quiz) {
            throw new BadRequestException('Quiz not found');
        }
        // delete answer
        const questions = quiz.questions as unknown as IQuizQuestion[]
        questions.map(q => delete q.answer)
        return {
            ...quiz,
            questions
        };
    }

    async findQuizBySlugOrThrow(slug: string) {
        const quiz = await this.quizQuery.findBySlug(slug);
        if (!quiz) {
            throw new BadRequestException('Quiz not found');
        }
        const questions = quiz.questions as unknown as IQuizQuestion[]
        questions.map(q => delete q.answer)
        return {
            ...quiz,
            questions
        };
    }

    async checkSlugExistAndThrow(slug: string) {
        const quiz = await this.quizQuery.findBySlug(slug);
        if (quiz) {
            throw new BadRequestException('Slug already exist');
        }
        return
    }

    async findAllQuizs() {
        return await this.quizQuery.findAll();
    }

    async createQuiz(dto: CreateQuizDto) {
        const slug = generateSlug(dto.title);
        await this.checkSlugExistAndThrow(slug);
        const lesson = await this.lessonRepository.findLessonBySlugOrThrow(dto.slugLesson)
        const backgroundClass = generateBackgroundClass();
        return await this.quizQuery.create({
            title: dto.title,
            slug: slug,
            lesson: {
                connect: {
                    id: lesson.id
                }
            },
            questions: JSON.parse(JSON.stringify(dto.questions)) as Prisma.JsonArray,
            signs: JSON.parse(JSON.stringify(dto.signs)) as Prisma.JsonArray,
            backgroundColor: backgroundClass.backgroundColor,
            backgroundImage: backgroundClass.backgroundImage
        })
    }

    async updateQuiz(id: string, dto: UpdateQuizDto) {
        const quiz = await this.findQuizByIdOrThrow(id);
        const slug = dto.title ? generateSlug(dto.title) : undefined;
        if (slug && slug !== quiz.slug) {
            await this.checkSlugExistAndThrow(slug);
        }
        if (dto.slugLesson) {
            var lesson = await this.lessonRepository.findLessonBySlugOrThrow(dto.slugLesson)
        }
        return await this.quizQuery.updateById(id, {
            title: dto.title,
            slug: slug,
            ...(lesson ? { lesson: { connect: { id: lesson.id } } } : {}),
            questions: JSON.parse(JSON.stringify(dto.questions)) as Prisma.JsonArray,
            signs: JSON.parse(JSON.stringify(dto.signs)) as Prisma.JsonArray
        })
    }

    async deleteQuiz(id: string) {
        const quiz = await this.findQuizByIdOrThrow(id);
        return await this.quizQuery.deleteById(quiz.id);
    }

    async checkAnswer(idUser: string, dto: SubmitQuizDto) {
        // Start a transaction
        const transaction = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // find user
            const user = await tx.user.findUnique({
                where: {
                    id: idUser
                }
            });
            if (!user) {
                throw new BadRequestException('User not found');
            }
            // find quiz
            const quiz = await tx.quiz.findUnique({
                where: {
                    slug: dto.slugQuiz
                }
            });
            if (!quiz) {
                throw new BadRequestException('quiz not found');
            }

            // get question in quiz by number
            const question = quiz.questions as unknown as IQuizQuestion[]
            const questionByNumber = question.find(q => q.number === dto.numberQuiz);
            if (!questionByNumber) throw new BadRequestException('Question not found')

            if (questionByNumber.answer !== dto.answer) {
                const historyPayload: IQuizHistory = {
                    imageUrl: questionByNumber.imageUrl,
                    answer: questionByNumber.answer,
                    number: dto.numberQuiz,
                    isCorrect: false,
                    point: questionByNumber.point,
                    question: questionByNumber.question,
                    myAnswer: dto.answer
                }
                // find userOnQuiz
                const userOnQuiz = await tx.userOnQuiz.findUnique({
                    where: {
                        idUser_idQuiz: {
                            idUser: idUser,
                            idQuiz: quiz.id
                        }
                    }
                });
                if (!userOnQuiz) {
                    // create userOnQuiz
                    await tx.userOnQuiz.create({
                        data: {
                            score: 0,
                            idUser: idUser,
                            idQuiz: quiz.id,
                            currentNumber: dto.numberQuiz,
                            isDone: question.length === dto.numberQuiz,
                            xp: 0,
                            quizHistory: JSON.parse(JSON.stringify([historyPayload]))
                        }
                    })
                } else {
                    // check is user already take this question
                    const historyQuestion = userOnQuiz.quizHistory as unknown as IQuizHistory[]
                    const history = historyQuestion.find(h => h.number === dto.numberQuiz);
                    if (!history) {
                        // caluate skor by correct answer and total question
                        const score = Math.round((historyQuestion.filter(h => h.isCorrect).length / historyQuestion.length) * 100);
                        // update userOnQuiz
                        await tx.userOnQuiz.update({
                            where: {
                                idUser_idQuiz: {
                                    idUser: idUser,
                                    idQuiz: quiz.id
                                }
                            },
                            data: {
                                score: score,
                                isDone: question.length === dto.numberQuiz,
                                quizHistory: JSON.parse(JSON.stringify([...historyQuestion, historyPayload]))
                            }
                        })
                    }
                }
                return false
            }

            const historyPayload: IQuizHistory = {
                imageUrl: questionByNumber.imageUrl,
                answer: questionByNumber.answer,
                number: dto.numberQuiz,
                isCorrect: true,
                point: questionByNumber.point,
                question: questionByNumber.question,
                myAnswer: dto.answer
            }
            // find userOnQuiz
            const userOnQuiz = await tx.userOnQuiz.findUnique({
                where: {
                    idUser_idQuiz: {
                        idUser: idUser,
                        idQuiz: quiz.id
                    }
                }
            });

            if (!userOnQuiz) {
                // caluate skor by correct answer and total question
                const correctAnswer = question.filter(q => q.answer === q.answer).length
                const totalQuestion = question.length
                const score = (correctAnswer / totalQuestion) * 100
                // create userOnQuiz
                await tx.userOnQuiz.create({
                    data: {
                        idUser: idUser,
                        idQuiz: quiz.id,
                        currentNumber: dto.numberQuiz,
                        isDone: question.length === dto.numberQuiz,
                        xp: questionByNumber.point,
                        score: score,
                        quizHistory: JSON.parse(JSON.stringify([historyPayload]))
                    }
                })
                // update point user
                await tx.user.update({
                    where: {
                        id: idUser
                    },
                    data: {
                        pointXp: user.pointXp + questionByNumber.point
                    }
                });
            } else {
                // check is user already take this question
                const historyQuestion = userOnQuiz.quizHistory as unknown as IQuizHistory[]
                const history = historyQuestion.find(h => h.number === dto.numberQuiz);

                if (!history) {
                    // push new history
                    historyQuestion.push(historyPayload);
                    // update point user
                    await tx.user.update({
                        where: {
                            id: idUser
                        },
                        data: {
                            pointXp: user.pointXp + questionByNumber.point
                        }
                    });
                }

                // caluate skor by correct answer and total question
                const score = Math.round((historyQuestion.filter(h => h.isCorrect).length / historyQuestion.length) * 100);

                // update userOnQuiz
                await tx.userOnQuiz.update({
                    where: {
                        idUser_idQuiz: {
                            idUser: idUser,
                            idQuiz: quiz.id
                        }
                    },
                    data: {
                        currentNumber: dto.numberQuiz,
                        isDone: question.length === dto.numberQuiz,
                        xp: history ? userOnQuiz.xp : userOnQuiz.xp + questionByNumber.point,
                        score: score,
                        quizHistory: JSON.parse(JSON.stringify(historyQuestion))
                    }
                });
            }
            return questionByNumber
        });
        if (!transaction) throw new BadRequestException('Wrong answer');
        return transaction;
    }

    async getHistory(idUser: string, slugQuiz: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: idUser
            }
        })
        if (!user) throw new BadRequestException('User not found')
        const quiz = await this.prisma.quiz.findUnique({
            where: {
                slug: slugQuiz
            }
        })
        if (!quiz) throw new BadRequestException('Quiz not found')
        const userOnQuiz = await this.prisma.userOnQuiz.findUnique({
            where: {
                idUser_idQuiz: {
                    idUser: idUser,
                    idQuiz: quiz.id
                }
            }
        })
        if (!userOnQuiz) throw new BadRequestException('User not found')
        return userOnQuiz
    }
}