import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const emailRegistro = async (datos) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
  });

  console.log(datos);

  const { email, nombre, token } = datos;
  try {
    await transport.sendMail({
      from: "lo que sea",
      to: email,
      subject: "Confirm your account",
      html: `Hi ${nombre}, your account is almost ready to be created</p>
      <p>you just need to verify your account using the next link:
      <a href="${process.env.BACKEND_URL}/auth/confirm/${token}">Verify your account</a></p>
      <p>if you didnt create this account, pls dont pay attention to this message</p>`,
    });
  } catch (error) {
    console.log(error);
  }
};

const emailReset = async (datos) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
  });

  const { email, nombre, token } = datos;
  try {
    await transport.sendMail({
      from: "lo que sea",
      to: email,
      subject: "Reset your password",
      html: `Hi ${nombre}, this is your email confirmation to rest your password</p>
      <p>you just need to verify your account using the next link:
      <a href="${process.env.BACKEND_URL}/auth/reset_password/${token}}">Reset your password</a></p>
      <p>if you didnt create this account, pls dont pay attention to this message</p>`,
    });
  } catch (error) {
    console.log(error);
  }
};
//http://localhost:3000/confirm/${token}
export { emailRegistro, emailReset };
