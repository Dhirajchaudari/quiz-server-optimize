import {
  ModelOptions,
  Ref,
  Severity,
  getModelForClass,
  prop,
} from "@typegoose/typegoose";
import { Topic } from "./topics.model";

@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Quiz {

  @prop({ref:Topic})
  topic: Ref<Topic>;

  @prop()
  question: string;

  @prop()
  options: [string];

  @prop({ required: true })
  ans: string;

  @prop()
  level: string;

  @prop({ required: true })
  weightage: number;

  @prop(() => Date)
  updatedAt: Date;

  @prop(() => Date)
  createdAt: Date;
}

export const QuizModel = getModelForClass(Quiz, {
  schemaOptions: { timestamps: true },
});
