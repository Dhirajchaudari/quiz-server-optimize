


export enum UserProfileStatus {
    emailVerificationPending = "emailVerificationPending",
    completed = "completed"
}

export interface VerificationTokenType {
    email: string;
    id: string;
  }

