import hbs, { HbsTransporter , NodemailerExpressHandlebarsOptions, TemplateOptions} from 'nodemailer-express-handlebars';
import nodemailer, { SendMailOptions } from 'nodemailer'
import path from 'path'
import { signJwt } from '../utils/auth';


const transporter: HbsTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: process.env.SMTP_SECURE === "yes" ? true : false,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
});

const hbsOptions: NodemailerExpressHandlebarsOptions = {
    extName: ".hbs",
    viewEngine: {
      extname: ".html",
      partialsDir: path.join(__dirname, "../emails"),
      defaultLayout: "",
    },
    viewPath: path.join(__dirname, "../emails"),
};
  
transporter.use("compile", hbs(hbsOptions));

const FROM = `Quiz app<${process.env.FROM_EMAIL}>`;

const LOGIN_LINK = `${process.env.APP_URL}`;

export const sendUserVerificationEmail = async ({
    email,
    name,
    userId,
  }: {
    email: string;
    name: string;
    userId: string;
  }) => {
    const appUrl = process.env.APP_URL! || "http://localhost:5173"
  const token = signJwt({ id: userId }, { expiresIn: "1d" });
  
    const verificationLink = `${appUrl}/verify-email?token=${token}`;
    const mailOptions: SendMailOptions | TemplateOptions = {
      from: FROM,
      bcc: process.env.SMTP_SECURE === "yes" ? "dhirajchaudhari789@gmail.com" : "",
      to: email,
      template:"verify-email",
      context: {
        verificationLink: verificationLink,
        name: name,
      },
      subject: "Verify your email!",
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error: any) {
      console.log("email verification mail error : " + error.toString());
      throw new Error(error.toString());
    }
};
  
export const sendQuizCompletionEmail = async ({
  email,
  name,
}: {
  email: string;
  name: string;
  }) => {
  

  const mailOptions: SendMailOptions | TemplateOptions = {
    from: FROM,
    bcc: process.env.SMTP_SECURE === "yes" ? "dhirajchaudhari789@gmail.com" : "",
    to: email,
    template:"quiz-completion",
    context: {
      name: name,
    },
    subject: "Quiz Completion",
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.log("email verification mail error : " + error.toString());
    throw new Error(error.toString());
  }
};