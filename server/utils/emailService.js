// server/utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send new user registration notification to admin
export const sendNewUserNotification = async (userName, userEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "🎉 New User Registration - Sridhar Fashions",
      html: `
        <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fdfaf5;">
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="font-family: 'Playfair Display', serif; color: #b49349; margin-bottom: 10px;">New Customer Alert</h1>
            <p style="color: #64748b; margin-bottom: 30px;">A new user has joined Sridhar Fashions!</p>
            
            <div style="background: #f9f6f0; padding: 20px; border-radius: 12px; border-left: 4px solid #b49349;">
              <p style="margin: 0 0 10px 0; color: #2c1810;"><strong>Name:</strong> ${userName}</p>
              <p style="margin: 0; color: #2c1810;"><strong>Email:</strong> ${userEmail}</p>
            </div>
            
            <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
              This is an automated notification from your Sridhar Fashions admin panel.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification sent for new user: ${userName}`);
  } catch (error) {
    console.error("❌ Failed to send admin notification:", error);
  }
};

// Send welcome email to new user
export const sendWelcomeEmail = async (userName, userEmail) => {
  try {
    const mailOptions = {
      from: `"Sridhar Fashions" <${process.env.ADMIN_EMAIL}>`,
      to: userEmail,
      subject: "✨ Welcome to Sridhar Fashions - Your Journey in Elegance Begins",
      html: `
        <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #fdfaf5 0%, #f9f6f0 100%); padding: 40px 20px;">
          <div style="background: white; padding: 50px 40px; border-radius: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-top: 5px solid #b49349;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-family: 'Playfair Display', serif; color: #b49349; font-size: 42px; margin: 0 0 10px 0; letter-spacing: -1px;">
                Welcome to Sridhar Fashions
              </h1>
              <div style="width: 60px; height: 3px; background: linear-gradient(to right, #b49349, #d4af37); margin: 0 auto;"></div>
            </div>

            <!-- Greeting -->
            <div style="margin-bottom: 35px;">
              <p style="font-size: 18px; color: #2c1810; margin: 0 0 20px 0;">
                Dear <strong>${userName}</strong>,
              </p>
              <p style="font-size: 16px; color: #5a5a5a; line-height: 1.8; margin: 0 0 20px 0;">
                We are absolutely delighted to welcome you to the <strong>Sridhar Fashions</strong> family! 🎉
              </p>
              <p style="font-size: 16px; color: #5a5a5a; line-height: 1.8; margin: 0 0 20px 0;">
                Your journey into the world of exquisite silk sarees, timeless elegance, and unparalleled craftsmanship begins today. Each piece in our collection is a celebration of heritage, woven with passion and designed to make you shine on every special occasion.
              </p>
            </div>

            <!-- What Awaits Section -->
            <div style="background: #f9f6f0; padding: 30px; border-radius: 20px; margin-bottom: 35px; border-left: 4px solid #b49349;">
              <h2 style="font-family: 'Playfair Display', serif; color: #b49349; font-size: 24px; margin: 0 0 20px 0;">
                What Awaits You
              </h2>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 10px 0; color: #2c1810; font-size: 15px;">
                  ✨ <strong>Curated Collections</strong> - Handpicked sarees from master weavers
                </li>
                <li style="padding: 10px 0; color: #2c1810; font-size: 15px;">
                  🎨 <strong>Exclusive Designs</strong> - Unique patterns you won't find anywhere else
                </li>
                <li style="padding: 10px 0; color: #2c1810; font-size: 15px;">
                  💎 <strong>Premium Quality</strong> - Silk Mark certified authenticity
                </li>
                <li style="padding: 10px 0; color: #2c1810; font-size: 15px;">
                  🛍️ <strong>Personalized Service</strong> - Expert guidance for your perfect choice
                </li>
              </ul>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin-bottom: 35px;">
              <p style="font-size: 16px; color: #5a5a5a; margin-bottom: 25px;">
                Ready to explore our stunning collection?
              </p>
              <a href="http://localhost:5173/shop" style="display: inline-block; background: linear-gradient(135deg, #b49349 0%, #d4af37 100%); color: white; padding: 16px 40px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 8px 20px rgba(180, 147, 73, 0.3);">
                Browse Our Collection
              </a>
            </div>

            <!-- Closing Message -->
            <div style="border-top: 2px solid #f1f5f9; padding-top: 30px; margin-top: 30px;">
              <p style="font-size: 16px; color: #5a5a5a; line-height: 1.8; margin: 0 0 20px 0;">
                Thank you for choosing <strong>Sridhar Fashions</strong>. We're honored to be part of your special moments and look forward to helping you find the perfect saree that tells your unique story.
              </p>
              <p style="font-size: 16px; color: #2c1810; margin: 0;">
                With warm regards,<br>
                <strong style="color: #b49349;">The Sridhar Fashions Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #f1f5f9;">
              <p style="font-size: 13px; color: #8a7b6a; margin: 0 0 10px 0;">
                Need help? We're here for you!
              </p>
              <p style="font-size: 13px; color: #8a7b6a; margin: 0;">
                📧 Contact us anytime | 📱 WhatsApp: +91 81824 05059
              </p>
            </div>

          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to: ${userEmail}`);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
  }
};
