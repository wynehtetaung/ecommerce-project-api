const nodemailer = require("nodemailer");

const sendMail = async (
  userName,
  userEmail,
  subject,
  sendText,
  link,
  linkText
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.USER_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });
    const mailOptions = {
      from: "ECOMMERCE<process.env.USER_EMAIL>",
      to: userEmail,
      subject: subject,
      html: `<div style="background-color:#e1e1e1;padding:18px;">
          <h3 style="color:#333;">Hello,Dear ${userName}👋</h3>
          <p>${sendText}</p>
          <span>click 👉 <span/><a href='${link}'> ${linkText} <a/><span> 💯<span/>
          <p></p>
        </div>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
