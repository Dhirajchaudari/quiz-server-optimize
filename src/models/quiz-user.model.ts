import {
  ModelOptions,
  Ref,
  Severity,
  getModelForClass,
  prop,
} from "@typegoose/typegoose";
import { Topic } from "./topics.model";
import { User } from "./user.model";
import { Quiz } from "./quiz.model";

@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
export class QuizResponse {
  @prop({ ref: Quiz })
  questionId: Ref<Quiz>;

  @prop()
  userAns: string;

  @prop()
  isCorrect: boolean;

  @prop(() => Date)
  updatedAt: Date;

  @prop(() => Date)
  createdAt: Date;
}

  @ModelOptions({ options: { allowMixed: Severity.ALLOW } })
  export class QuizUser {
    
    @prop({ ref: User })
    user: Ref<User>;

    @prop({ ref: Topic })
    topics: Ref<Topic>[];

    @prop({ type: () => QuizResponse }) 
    quizResponse: QuizResponse[];

    @prop()
    finalScore: number;

    @prop(() => Date)
    updatedAt: Date;

    @prop(() => Date)
    createdAt: Date;
  }

export const QuizUserModel = getModelForClass(QuizUser, {
  schemaOptions: { timestamps: true },
});
