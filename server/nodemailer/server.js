import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const port = 1337;

app.use(express.json());
app.use(cors());
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", async (req, res) => {
  try {
    const { name, phone, service, message } = req.body; 
    const info = await transport.sendMail({
      from: `"Diginote" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Enquiry",
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      
      <header style="background-color: #4f46e5; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">📩 New Service Request</h1>
      </header>
      
      <main style="padding: 20px;">
        <p>Hello,</p>
        <p>You have received a new service request. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Service:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${service}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Message:</td>
            <td style="padding: 8px;">${message}</td>
          </tr>
        </table>
        
        <p style="margin-top: 20px;">Best regards,<br><strong>Your App Name</strong></p>
      </main>
      
      <footer style="background-color: #f4f4f4; color: #777; padding: 15px; text-align: center; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Your App Name. All rights reserved.
      </footer>
    </div>
  </div>
`,
    });
    console.log("success", info.messageId)

  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
