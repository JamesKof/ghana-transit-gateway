import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "subscribe" | "status_update" | "policy_update" | "deadline_reminder";
  email: string;
  applicationRef?: string;
  notificationTypes?: string[];
  data?: {
    subject?: string;
    message?: string;
    applicantName?: string;
    newStatus?: string;
    oldStatus?: string;
  };
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
  console.log("Received request to send-notification-email function");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const payload: NotificationRequest = await req.json();
    console.log("Request payload:", JSON.stringify(payload));

    if (payload.type === "subscribe") {
      const { email, applicationRef, notificationTypes } = payload;
      
      const { data: existing } = await supabase
        .from("notification_subscribers")
        .select("id")
        .eq("email", email)
        .eq("application_ref", applicationRef || null)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("notification_subscribers")
          .update({ 
            notification_types: notificationTypes || ["status"],
            is_active: true 
          })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("notification_subscribers")
          .insert({
            email,
            application_ref: applicationRef || null,
            notification_types: notificationTypes || ["status"],
          });
      }

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #006B3F; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Ghana Immigration Service</h1>
            </div>
            <div class="content">
              <h2>Subscription Confirmed!</h2>
              <p>Thank you for subscribing to GIS notifications.</p>
              ${applicationRef ? `<p><strong>Application Reference:</strong> ${applicationRef}</p>` : ""}
              <p>You will receive updates for:</p>
              <ul>
                ${(notificationTypes || ["status"]).map(t => `<li>${t.replace("_", " ").toUpperCase()}</li>`).join("")}
              </ul>
              <p>If you did not request this subscription, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Ghana Immigration Service | Independence Avenue, Accra</p>
              <p>+233 302 224 445 | info@gis.gov.gh</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail(email, "GIS Notification Subscription Confirmed", emailHtml);

      return new Response(JSON.stringify({ success: true, message: "Subscribed successfully" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (payload.type === "status_update") {
      const { email, data } = payload;
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #006B3F; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .status-badge { display: inline-block; padding: 8px 16px; background: #FFD700; color: #333; font-weight: bold; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Ghana Immigration Service</h1>
            </div>
            <div class="content">
              <h2>Application Status Update</h2>
              <p>Dear ${data?.applicantName || "Applicant"},</p>
              <p>Your application status has been updated:</p>
              <p><span class="status-badge">${data?.newStatus || "Updated"}</span></p>
              <p>${data?.message || "Please log in to your account to view more details about your application."}</p>
              <p>If you have any questions, please contact our office or visit gis.gov.gh.</p>
            </div>
            <div class="footer">
              <p>Ghana Immigration Service | Independence Avenue, Accra</p>
              <p>+233 302 224 445 | info@gis.gov.gh</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail(email, data?.subject || "Application Status Update - GIS", emailHtml);

      await supabase.from("notification_logs").insert({
        notification_type: "status_update",
        subject: data?.subject || "Application Status Update",
        message: data?.message || "Status updated",
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid notification type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
