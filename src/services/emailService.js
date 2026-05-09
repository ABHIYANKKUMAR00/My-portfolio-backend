const { getTransporter } = require("../config/email");

/**
 * Sends a notification to the portfolio owner when a new contact form is submitted.
 */
async function sendContactNotification({ name, email, message }) {
  const transporter = getTransporter();
  const notifyTo = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;

  await transporter.sendMail({
    from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
    to: notifyTo,
    subject: `📬 New message from ${name} — Portfolio`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
        <h2 style="color:#1d4ed8;margin-top:0;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;font-weight:bold;width:80px;color:#6b7280;">Name</td>
            <td style="padding:8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:bold;color:#6b7280;">Email</td>
            <td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:bold;vertical-align:top;color:#6b7280;">Message</td>
            <td style="padding:8px 0;">${message.replace(/\n/g, "<br>")}</td>
          </tr>
        </table>
        <p style="margin-top:24px;color:#9ca3af;font-size:12px;">Sent from your portfolio contact form · ${new Date().toUTCString()}</p>
      </div>
    `,
  });
}

/**
 * Sends an auto-reply to the person who submitted the contact form.
 */
async function sendAutoReply({ name, email }) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Abhiyank Gujjar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Thanks for reaching out! 👋",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
        <h2 style="color:#1d4ed8;margin-top:0;">Hey ${name}! 👋</h2>
        <p>Thanks for your message — I've received it and will get back to you as soon as possible, usually within 24–48 hours.</p>
        <p>In the meantime, feel free to check out my projects on
          <a href="https://github.com/abhiyank" style="color:#1d4ed8;">GitHub</a> or connect on
          <a href="https://linkedin.com/in/abhiyank" style="color:#1d4ed8;">LinkedIn</a>.
        </p>
        <br>
        <p>Best,<br><strong>Abhiyank Gujjar</strong><br>Full-Stack & AI/ML Developer</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:12px;">This is an automated reply. Please do not reply to this email directly.</p>
      </div>
    `,
  });
}

module.exports = { sendContactNotification, sendAutoReply };
