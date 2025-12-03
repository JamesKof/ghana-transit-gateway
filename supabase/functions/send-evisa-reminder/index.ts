import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    // Count only weekdays (Monday-Friday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting e-visa reminder check...");
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get all applications that are pending or submitted
    const { data: applications, error: fetchError } = await supabase
      .from("evisa_applications")
      .select("*")
      .in("application_status", ["pending", "submitted"])
      .order("submitted_at", { ascending: true });

    if (fetchError) {
      console.error("Error fetching applications:", fetchError);
      throw fetchError;
    }

    if (!applications || applications.length === 0) {
      console.log("No pending applications found");
      return new Response(
        JSON.stringify({ success: true, message: "No pending applications to process" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${applications.length} pending applications`);
    
    const now = new Date();
    const remindersToSend = [];
    
    for (const app of applications) {
      const submittedDate = new Date(app.submitted_at);
      const businessDays = calculateBusinessDays(submittedDate, now);
      
      console.log(`Application ${app.reference_number}: ${businessDays} business days since submission`);
      
      // Send reminder if 5 or more business days have passed
      if (businessDays >= 5) {
        remindersToSend.push(app);
      }
    }

    if (remindersToSend.length === 0) {
      console.log("No applications require reminders");
      return new Response(
        JSON.stringify({ success: true, message: "No reminders needed" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending ${remindersToSend.length} reminder emails...`);
    
    const emailPromises = remindersToSend.map(async (app) => {
      try {
        const submittedDate = new Date(app.submitted_at);
        const businessDays = calculateBusinessDays(submittedDate, now);
        
        const emailResponse = await resend.emails.send({
          from: "Ghana Immigration Service <noreply@resend.dev>",
          to: [app.email],
          subject: "E-Visa Application Update - Under Review",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #006B4F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                  .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                  .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #F4A300; border-radius: 4px; }
                  .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                  .status-badge { display: inline-block; padding: 6px 12px; background-color: #FFF3CD; color: #856404; border-radius: 4px; font-weight: bold; margin: 10px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>E-Visa Application Status Update</h1>
                  </div>
                  <div class="content">
                    <p>Dear ${app.full_name},</p>
                    
                    <p>This is a status update regarding your Ghana e-visa application.</p>
                    
                    <div class="info-box">
                      <h3>Application Details:</h3>
                      <p><strong>Reference Number:</strong> ${app.reference_number}</p>
                      <p><strong>Visa Type:</strong> ${app.visa_type}</p>
                      <p><strong>Submitted:</strong> ${submittedDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                      <p><strong>Processing Time:</strong> ${businessDays} business days</p>
                      <div class="status-badge">Under Review</div>
                    </div>

                    <h3>Current Status:</h3>
                    <p>Your application is currently under review by our immigration officers. We understand you're waiting for a decision, and we want to assure you that we're working diligently to process your application.</p>

                    <h3>What's Happening:</h3>
                    <ul>
                      <li>Your documents are being carefully reviewed</li>
                      <li>Background checks are being conducted</li>
                      <li>All information is being verified against our requirements</li>
                    </ul>

                    <h3>Expected Timeline:</h3>
                    <p>Standard processing typically takes 5-7 business days from submission. In some cases, additional verification may be required, which can extend the timeline to 10-15 business days.</p>

                    <h3>What You Can Do:</h3>
                    <ul>
                      <li>No action is required from you at this time</li>
                      <li>You can track your application status online using your reference number</li>
                      <li>We'll email you immediately when there's an update</li>
                      <li>If we need additional documents, we'll contact you directly</li>
                    </ul>

                    <p><strong>Important:</strong> Please do not submit a new application as this will delay processing. Your current application is in queue and being actively reviewed.</p>

                    <p>Thank you for your patience. We appreciate your understanding as we ensure thorough processing of all applications.</p>

                    <p>Best regards,<br>
                    Ghana Immigration Service<br>
                    E-Visa Processing Team</p>
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

        console.log(`Reminder sent to ${app.email} for application ${app.reference_number}`);
        return { success: true, applicationId: app.id, emailId: emailResponse.data?.id };
      } catch (error: any) {
        console.error(`Failed to send reminder for ${app.reference_number}:`, error);
        return { success: false, applicationId: app.id, error: error?.message || "Unknown error" };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Reminder emails sent: ${successCount} successful, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${remindersToSend.length} applications`,
        sent: successCount,
        failed: failCount,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-evisa-reminder function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
