import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackNotificationRequest {
  name: string;
  email: string;
  region: string;
  feedback_type: string;
  subject: string;
  message: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  console.log(`Sending email to ${to} with subject: ${subject}`);
  
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Ghana Immigration Service <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  const data = await response.json();
  console.log("Resend API response:", JSON.stringify(data));
  
  if (!response.ok) {
    throw new Error(`Failed to send email: ${JSON.stringify(data)}`);
  }
  
  return data;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-feedback-notification function");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: FeedbackNotificationRequest = await req.json();
    console.log("Received feedback notification request:", payload);

    const { name, email, region, feedback_type, subject, message } = payload;

    // Send confirmation email to the user
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #006A4E 0%, #008C64 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 30px; }
            .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .badge-success { background: #d4edda; color: #155724; }
            .info-box { background: #f8f9fa; border-left: 4px solid #006A4E; padding: 16px; margin: 20px 0; border-radius: 4px; }
            .info-box strong { color: #006A4E; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #6c757d; }
            .footer a { color: #006A4E; text-decoration: none; }
            .divider { height: 1px; background: #e0e0e0; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Feedback Received</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Ghana Immigration Service</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for submitting your feedback to the Ghana Immigration Service - ${region}. We have received your message and our team will review it carefully.</p>
              
              <div class="info-box">
                <p style="margin: 0 0 10px 0;"><strong>Feedback Type:</strong> <span class="badge badge-success">${feedback_type}</span></p>
                <p style="margin: 0 0 10px 0;"><strong>Region:</strong> ${region}</p>
                <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
                <div class="divider"></div>
                <p style="margin: 0;"><strong>Your Message:</strong></p>
                <p style="margin: 10px 0 0 0; color: #555;">${message}</p>
              </div>
              
              <p>We aim to respond to all feedback within 3-5 business days. If your inquiry requires immediate attention, please contact the ${region} office directly.</p>
              
              <p style="margin-top: 30px;">Best regards,<br><strong>Ghana Immigration Service<br>${region}</strong></p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 10px 0;">This is an automated confirmation email.</p>
              <p style="margin: 0;">© ${new Date().getFullYear()} Ghana Immigration Service. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const userEmailResponse = await sendEmail(
      email,
      "Feedback Received - Ghana Immigration Service",
      userEmailHtml
    );

    console.log("User confirmation email sent:", userEmailResponse);

    // Send notification email to GIS admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .details p { margin: 8px 0; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
            .badge-warning { background: #ffc107; color: #000; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>🔔 New Feedback Submission</h2>
            <div class="alert">
              <strong>⚠️ Action Required:</strong> A new ${feedback_type} has been submitted to the ${region} office.
            </div>
            
            <div class="details">
              <p><strong>Type:</strong> <span class="badge badge-warning">${feedback_type.toUpperCase()}</span></p>
              <p><strong>Region:</strong> ${region}</p>
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 15px 0;">
              <p><strong>Message:</strong></p>
              <p style="color: #555;">${message}</p>
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 15px 0;">
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p><em>Please log in to the feedback dashboard to review and respond to this feedback.</em></p>
          </div>
        </body>
      </html>
    `;

    const adminEmailResponse = await sendEmail(
      "admin@gis.gov.gh", // Replace with actual admin email
      `New Feedback: ${feedback_type} - ${region}`,
      adminEmailHtml
    );

    console.log("Admin notification email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        userEmail: userEmailResponse,
        adminEmail: adminEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-feedback-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);