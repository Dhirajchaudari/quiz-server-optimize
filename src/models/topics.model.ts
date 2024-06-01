import {
  ModelOptions,
  Severity,
  getModelForClass,
  prop,
} from "@typegoose/typegoose";
import { QuizTopicEnum } from "../interfaces/topic.interface";

@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Topic {
  @prop({ required: true, default: QuizTopicEnum.CSS })
  topic: QuizTopicEnum;

  @prop(() => Date)
  updatedAt: Date;

  @prop(() => Date)
  createdAt: Date;
}

export const TopicModel = getModelForClass(Topic, {
  schemaOptions: { timestamps: true },
});
