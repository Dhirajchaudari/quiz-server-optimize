export enum QuizLevelEnum {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
}

export interface QuizQuestion {
    topic: string,
    level:QuizLevelEnum,
    question: string;
    options: string[];
    weightage: number;
    ans: number;
  }