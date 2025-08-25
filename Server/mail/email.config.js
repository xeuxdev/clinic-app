import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export  const sendEmail = async (to, template) => {
  await transporter.sendMail({
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
}


