import { Request, Response } from "express";
import { TopicModel } from "../models/topics.model";
import { QuizUserModel } from "../models/quiz-user.model";

export const createTopic = async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;

    const createTopic = await TopicModel.create({
      topic: topic,
      createdAt: new Date(),
    });

    res.status(200).send({
      message: "Topic created",
      success: true,
      topic: createTopic,
    });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(error.status).send({
      message: error.message.toString(),
      success: false,
    });
    return;
  }
};

export const getAllTopics = async (req: Request, res: Response) => {
  try {
    const allTopics = await TopicModel.find({}).select("topic").lean();

    res.status(200).send({
      message: "Topics fetched",
      success: true,
      topics: allTopics,
    });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(error.status).send({
      message: error.message.toString(),
      success: false,
    });
    return;
  }
};

export const saveUserTopics = async (req: Request, res: Response) => {
  try {
    const { topics } = req.body;
    const userId = req.context?.user;

    const respo = await QuizUserModel.create({
      user: userId,
      topics: topics,
      createdAt: new Date(),
    });

    res.status(200).json({
      message: "Topics saved successfully.",
      success: true,
      data:respo._id.toString()
    });
    return
  } catch (error: any) {
    console.log(error.message.toString());
    res.status(400).json({
      message: error.message.toString(),
      success: false,
    });
  }
};
