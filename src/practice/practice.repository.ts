import { BadRequestException, Injectable } from '@nestjs/common';
import { PracticeQuery } from '../prisma/queries/practice/practice.query';
import { CreatePracticeDto, UpdatePracticeDto } from './dto/create-practice';
import { FolderBucketType, _validateFile, generateBackgroundClass, generateSlug, getCustomFilename } from '../helpers/helper';
import { Prisma } from '@prisma/client';
import { LessonRepository } from '../lesson/lesson.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePredictPracticeDto } from './dto/predict.dto';
import { IPracticeHistory, IPracticeQuestion } from './interfaces/practice.interface';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class PracticeRepository {
    constructor(
        private readonly practiceQuery: PracticeQuery,
        private readonly lessonRepostory: LessonRepository,
        private readonly prisma: PrismaService,
        private readonly gatewayService: GatewayService,
    ) { }

    async findPracticeByIdOrThrow(id: string) {
        const practice = await this.practiceQuery.findById(id);
        if (!practice) {
            throw new BadRequestException('Practice not found');
        }
        return practice;
    }

    async findPracticeBySlugOrThrow(slug: string) {
        const practice = await this.practiceQuery.findBySlug(slug);
        if (!practice) {
            throw new BadRequestException('Practice not found');
        }
        return practice;
    }

    async checkSlugExistAndThrow(slug: string) {
        const practice = await this.practiceQuery.findBySlug(slug);
        if (practice) {
            throw new BadRequestException('Slug already exist');
        }
        return
    }

    async findAllPractices() {
        return await this.practiceQuery.findAll();
    }

    async createPractice(dto: CreatePracticeDto) {
        const slug = generateSlug(dto.title);
        await this.checkSlugExistAndThrow(slug);

        const lesson = await this.lessonRepostory.findLessonBySlugOrThrow(dto.slugLesson);

        const backgroundClass = generateBackgroundClass();

        return await this.practiceQuery.create({
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
        });
    }


    async updatePractice(id: string, dto: UpdatePracticeDto) {
        const practice = await this.findPracticeByIdOrThrow(id);
        const slug = dto.title ? generateSlug(dto.title) : undefined;
        if (slug && slug !== practice.slug) {
            await this.checkSlugExistAndThrow(slug);
        }
        if (dto.slugLesson) {
            var lesson = await this.lessonRepostory.findLessonBySlugOrThrow(dto.slugLesson);
        }
        return await this.practiceQuery.updateById(id, {
            title: dto.title,
            slug: slug,
            ...(dto.slugLesson ? { lesson: { connect: { id: lesson.id } } } : {}),
            questions: JSON.parse(JSON.stringify(dto.questions)) as Prisma.JsonArray,
            signs: JSON.parse(JSON.stringify(dto.signs)) as Prisma.JsonArray
        })
    }

    async deletePractice(id: string) {
        const practice = await this.findPracticeByIdOrThrow(id);
        return await this.practiceQuery.deleteById(practice.id);
    }

    async CaptureImage(idUser: string, dto: CreatePredictPracticeDto, file: Express.Multer.File) {
        if (!file) throw new BadRequestException('Please upload file');
        _validateFile(
            `Image`,
            file,
            ['.jpeg', '.jpg', '.png'],
            1,
        );

        try {
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

                // find practice
                const practice = await tx.practice.findUnique({
                    where: {
                        slug: dto.slugPractice
                    }
                });
                if (!practice) {
                    throw new BadRequestException('Practice not found');
                }

                // get prediction
                const signPredict = await this.gatewayService.predictAsl(file)
                if (!signPredict.isDetected) throw new BadRequestException('Oops, your answer is wrong, please try again')

                // get question in practice by number
                const question = practice.questions as unknown as IPracticeQuestion[]
                const questionByNumber = question.find(q => q.number === dto.numberPractice);
                if (!questionByNumber) throw new BadRequestException('Question not found')

                // check answer is correct
                if (signPredict.label !== questionByNumber.answer) throw new BadRequestException('Oops, your answer is wrong, please try again')

                const historyPayload: IPracticeHistory = {
                    imageUrl: questionByNumber.imageUrl,
                    answer: questionByNumber.answer,
                    number: dto.numberPractice,
                    isCorrect: true,
                    point: questionByNumber.point,
                    question: questionByNumber.question,
                    myAnswer: signPredict.label
                }
                // find userOnPractice
                const userOnPractice = await tx.userOnPractice.findUnique({
                    where: {
                        idUser_idPractice: {
                            idUser: idUser,
                            idPractice: practice.id
                        }
                    }
                });

                if (!userOnPractice) {
                    // create userOnPractice
                    await tx.userOnPractice.create({
                        data: {
                            idUser: idUser,
                            idPractice: practice.id,
                            currentNumber: dto.numberPractice,
                            isDone: question.length === dto.numberPractice,
                            score: questionByNumber.point,
                            practiceHistory: JSON.parse(JSON.stringify([historyPayload]))
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
                    const historyQuestion = userOnPractice.practiceHistory as unknown as IPracticeHistory[]
                    const history = historyQuestion.find(h => h.number === dto.numberPractice);

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

                    // update userOnPractice
                    await tx.userOnPractice.update({
                        where: {
                            idUser_idPractice: {
                                idUser: idUser,
                                idPractice: practice.id
                            }
                        },
                        data: {
                            currentNumber: dto.numberPractice,
                            isDone: question.length === dto.numberPractice,
                            score: history ? userOnPractice.score : userOnPractice.score + questionByNumber.point,
                            practiceHistory: JSON.parse(JSON.stringify(historyQuestion))
                        }
                    });
                }
                return questionByNumber
            });

            return transaction;
        } catch (error) {
            throw error;
        }
    }
}