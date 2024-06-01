import { ModelOptions, Severity, getModelForClass, index, pre, prop } from "@typegoose/typegoose";
import { UserProfileStatus } from "../interfaces/user.interface";
import bcrypt from 'bcrypt'

@pre<User>("save", async function () {
  // check if password is being modified
  if (!this.isModified("password")) {
    return;
  }
  
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hashSync(this.password, salt);

  this.password = hash;
})
@index({ email: 1, firstName: 1, lastName: 1 })
@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
export class User {

  @prop({required:true})
  firstName: string;

  @prop()
  lastName: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true, unique: true })
  number: number;

  @prop({ required: true , default: UserProfileStatus.emailVerificationPending})
  userVerifyStatus: UserProfileStatus;

  @prop({ required: true })
  password: string;

  @prop(() => Date)
  updatedAt: Date;

  @prop(() => Date)
  createdAt: Date;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
