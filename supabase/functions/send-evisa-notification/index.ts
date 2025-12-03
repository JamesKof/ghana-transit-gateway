import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EVisaNotificationRequest {
  applicantEmail: string;
  applicantName: string;
  referenceNumber: string;
  visaType: string;
  travelDate: string;
  adminEmails?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      applicantEmail,
      applicantName,
      referenceNumber,
      visaType,
      travelDate,
      adminEmails = ["admin@immigration.gov.gh"],
    }: EVisaNotificationRequest = await req.json();

    console.log("Sending e-visa notifications for:", referenceNumber);

    // Send confirmation email to applicant
    const applicantEmailResponse = await resend.emails.send({
      from: "Ghana Immigration Service <noreply@resend.dev>",
      to: [applicantEmail],
      subject: "E-Visa Application Received - Reference: " + referenceNumber,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #006B4F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #006B4F; border-radius: 4px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              .button { display: inline-block; padding: 12px 24px; background-color: #006B4F; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>E-Visa Application Received</h1>
              </div>
              <div class="content">
                <p>Dear ${applicantName},</p>
                <p>Thank you for submitting your e-visa application to Ghana Immigration Service. We have successfully received your application and payment.</p>
                
                <div class="info-box">
                  <h3>Application Details:</h3>
                  <p><strong>Reference Number:</strong> ${referenceNumber}</p>
                  <p><strong>Visa Type:</strong> ${visaType}</p>
                  <p><strong>Travel Date:</strong> ${new Date(travelDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p><strong>Status:</strong> Pending Review</p>
                </div>

                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>Your application is being reviewed by our team</li>
                  <li>Processing typically takes 3-5 business days</li>
                  <li>You will receive email updates on your application status</li>
                  <li>Keep your reference number safe for tracking purposes</li>
                </ul>

                <p><strong>Important:</strong> Please ensure you uploaded all required documents. If any documents are missing, we will contact you via email.</p>

                <p>If you have any questions, please contact our support team with your reference number.</p>

                <p>Best regards,<br>Ghana Immigration Service</p>
              </div>
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} Ghana Immigration Service. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Applicant email sent:", applicantEmailResponse);

    // Send notification to admins
    const adminEmailResponse = await resend.emails.send({
      from: "Ghana Immigration Service <noreply@resend.dev>",
      to: adminEmails,
      subject: "New E-Visa Application Submitted - " + referenceNumber,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #006B4F; color: white; padding: 20px; text-align: center; }
              .content { background-color: #f9f9f9; padding: 30px; }
              .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #F4A300; }
              .urgent { color: #d32f2f; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>⚠️ New E-Visa Application</h2>
              </div>
              <div class="content">
                <p class="urgent">A new e-visa application requires review.</p>
                
                <div class="info-box">
                  <h3>Application Summary:</h3>
                  <p><strong>Reference:</strong> ${referenceNumber}</p>
                  <p><strong>Applicant:</strong> ${applicantName}</p>
                  <p><strong>Email:</strong> ${applicantEmail}</p>
                  <p><strong>Visa Type:</strong> ${visaType}</p>
                  <p><strong>Travel Date:</strong> ${new Date(travelDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-US')}</p>
                </div>

                <p><strong>Action Required:</strong></p>
                <ul>
                  <li>Review application details and uploaded documents</li>
                  <li>Verify payment confirmation</li>
                  <li>Update application status as appropriate</li>
                </ul>

                <p>Please log in to the admin dashboard to process this application.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        applicantEmailId: applicantEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-evisa-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
