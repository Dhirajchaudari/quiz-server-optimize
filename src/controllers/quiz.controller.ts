import { Request, Response } from "express";
import { Quiz, QuizModel } from "../models/quiz.model";
import { QuizLevelEnum, QuizQuestion } from "../interfaces/quiz.interface";
import { QuizUserModel } from "../models/quiz-user.model";
import { User, UserModel } from "../models/user.model";
import { FlattenMaps } from "mongoose";
import { Types } from "mongoose";
import { sendQuizCompletionEmail } from "../nodemailer";

export const createQuizQuestions = async (
  req: Request<any, any, QuizQuestion>,
  res: Response
) => {
  try {
    const { topic, question, level, options, weightage, ans } = req.body;

    const createdQuestions = await QuizModel.create({
      topic: topic,
      options: options,
      question: question,
      weightage: weightage,
      level: level,
      ans: ans,
      createdAt: new Date(),
    });

    res.status(200).send({
      message: "Quiz created successfully",
      success: true,
      data: createdQuestions,
    });
  } catch (error: any) {
    res.status(500).send({
      message: error.message.toString(),
      success: false,
    });
  }
};

export const getAllQuiz = async (req: Request, res: Response) => {
  try {
    const quizTopics = await QuizModel.find({})
      .select("-ans -createdAt -updatedAt")
      .populate("topic", "_id topic")
      .lean();

    res.status(200).send({
      message: "Quiz topics found",
      success: true,
      data: quizTopics,
    });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).send({
      message: error.message.toString(),
      success: false,
    });
  }
};

export const getQuizByTopics = async (req: Request, res: Response) => {
  try {
    const quizId = req.query.quizId
    // console.log(req)

    const user = await QuizUserModel.findOne({ _id:quizId }).select("topics").lean();

    const topicIds = user?.topics.map((el) => el?._id.toString())

    const easyQuestions = await QuizModel.find({
      topic: { $in: topicIds },
      level: QuizLevelEnum.Easy,
    })
      .select('-ans -createdAt -updatedAt') // Exclude fields
      .populate('topic', '_id topic') // Populate topic with specific fields
      .lean();
  
    const mediumQuestions = await QuizModel.find({
      topic: { $in: topicIds },
      level: QuizLevelEnum.Medium,
    })
      .select('-ans -createdAt -updatedAt') // Exclude fields
      .populate('topic', '_id topic') // Populate topic with specific fields
      .lean();
  
    const hardQuestions = await QuizModel.find({
      topic: { $in: topicIds },
      level: QuizLevelEnum.Hard,
    })
      .select('-ans -createdAt -updatedAt') // Exclude fields
      .populate('topic', '_id topic') // Populate topic with specific fields
      .lean();
  
    const questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions].sort(() => Math.random() - 0.5)

    res.status(200).send({
      message: "All the best your quiz started.",
      success: true,
      data: questions.slice(0,10),
    });

    return

  } catch (error: any) {
    console.log(error)
    res.status(500).send({
      message: error.message.toString(),
      success: false,
    });
    return
  }
};

export const saveQuizResponse = async (req: Request, res: Response) => {
  try {
    const { questionId, userAns,quizId } = req.body;
    const userId = req.context?.user;

    // await QuizUserModel.up
    const quizResponsePresent = await QuizUserModel.countDocuments({
      _id:quizId
    });

    if (quizResponsePresent === 0) {
      res.status(400).json({
        message: "Quiz not found",
        success: false,
      });
      return;
    }

    // check userAns correct or not
    let isCorrect: boolean = false;

    const que = await QuizModel.findOne({
      _id: questionId,
    })
      .select("ans weightage")
      .lean();

    if (que?.ans === userAns) {
      isCorrect = true;
    }

    // check question already present

    const questionPresent = await QuizUserModel.countDocuments({
      _id:quizId,
      "quizResponse.questionId": questionId,
    });

    let quizResponse;

    if (questionPresent === 0) {
      quizResponse = await QuizUserModel.findOneAndUpdate(
        {       _id:quizId        },
        {
          $push: {
            quizResponse: {
              questionId: questionId,
              userAns: userAns,
              isCorrect: isCorrect,
              createdAt: new Date(),
            },
          },
        }
      );
    } else {
      quizResponse = await QuizUserModel.findOneAndUpdate(
        {
          _id:quizId,
          "quizResponse.questionId": questionId,
        },
        {
          $set: {
            "quizResponse.$.userAns": userAns,
            "quizResponse.$.isCorrect": isCorrect,
            "quizResponse.$.updatedAt": new Date(),
          },
        }
      );
    }

    res.status(200).json({
      message: "Quiz response saved successfully.",
      success: true,
    });
    return;
  } catch (error: any) {
    res.status(error.status).json({
      message: error.message.toString(),
      success: false,
    });
    return;
  }
};

export const quizCompleted = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.body;
    const userId = req.context?.user;

    // Fetch user's quiz responses for the given quiz
    const quizUser = await QuizUserModel.findOne({
      _id: quizId,
    })
      .select('quizResponse')
      .populate({
        path: 'quizResponse.questionId',
        model: QuizModel,
        select: 'weightage',
      })
      .lean();

    if (!quizUser) {
      return res.status(404).json({
        message: 'Quiz responses not found for the user',
        success: false,
      });
    }

    // Calculate the score for the correct answers
    const correctResponses = quizUser.quizResponse.filter((response) => response.isCorrect);
    const score = correctResponses.reduce((acc, response) => {
      const question = response.questionId as unknown as { weightage: number };
      return acc + (question.weightage || 0);
    }, 0);

    // Update the final score in the QuizUser document
    await QuizUserModel.updateOne(
      { _id: quizId,  },
      { $set: { finalScore: score } }
    );

    // Optionally, send a congratulatory email
    // await sendCongratulatoryEmail(userId, score);
    const user = await UserModel.findOne({ _id: userId }).select("firstName lastName email").lean()
    const userName = `${user?.firstName}  ${user!.firstName}`
    await sendQuizCompletionEmail({
      email:user!.email,
      name:userName
    })

    // Respond with success
    res.status(200).json({
      message: 'Thank you for your response!',
      success: true,
      score,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      success: false,
    });
  }
};

export const quizResult = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.query;

    // Fetch the quiz user data
    const quizUser = await QuizUserModel.findById(quizId)
      .select('user finalScore topics quizResponse')
      .populate('user', 'firstName lastName')
      .populate('topics', 'topic')
      .lean();

    if (!quizUser) {
      return res.status(404).json({
        message: 'Quiz not found',
        success: false,
      });
    }

    // Fetch the associated questions
    const questionIds = quizUser.quizResponse.map(response => response.questionId);
    const questions = await QuizModel.find({ _id: { $in: questionIds } })
      .lean();

    // Prepare the results
    const results = quizUser.quizResponse.map(response => {
      const question: (FlattenMaps<Quiz> & {
        _id: Types.ObjectId;
    }) | undefined= questions.find(q => q._id.toString() === response.questionId.toString());

      return {
        question: {
          _id: question?._id,
          question: question?.question,
          options: question?.options,
          correctAnswer: question?.ans,
          score: question?.weightage,
        },
        response: {
          questionId: response.questionId,
          userAns: response.userAns,
        },
        isCorrect: response.isCorrect,
      };
    });

    // Construct the data to be returned
    const data = {
      user: quizUser.user,
      topics: quizUser.topics,
      results,
      totalScore: quizUser.finalScore,
    };

    // Send the response
    res.status(200).json({
      data,
      success: true,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: 'An error occurred',
      success: false,
    });
  }
};

