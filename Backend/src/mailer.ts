import nodemailer from "nodemailer";
import { resolve } from "path";

interface EmailData {
  complainant: { email: string; name: string }[];
  TrackingNumber: string;
}

export const sendEmail = (data: EmailData): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { complainant, TrackingNumber } = data;
    const [{ email, name }] = complainant;

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    let content = {
      from: '"Tiabidii Management" <tiabidiimanagement@official.sample>',
      to: email,
      subject: "Issue of tracking number",
      text: `Hello ${name},
Your tracking number for the task allocated is ${TrackingNumber}
                  `,
    };
    transporter.sendMail(content, (err, info) => {
      if (err) {
        reject(err);
      } else {
        return resolve({
          message: "email sent",
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info),
        });
      }
    });
  });
};
