import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EVisaSubmissionRequest {
  nationality: string;
  fullName: string;
  email: string;
  passportNumber: string;
  travelDate: string;
  visaType: string;
  purposeOfVisit: string;
  paymentReference: string;
  visaFeeAmount: number;
  documentUrls?: string[];
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    paid_at: string;
    metadata?: any;
    customer?: {
      email: string;
      first_name?: string;
      last_name?: string;
    };
  };
}

async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResponse> {
  console.log(`Verifying Paystack transaction: ${reference}`);

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Paystack verification failed:", errorText);
    throw new Error(`Paystack verification failed: ${response.status} ${errorText}`);
  }

  const data: PaystackVerifyResponse = await response.json();
  console.log("Paystack verification response:", JSON.stringify(data));

  return data;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to verify-evisa-payment function");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EVisaSubmissionRequest = await req.json();
    console.log("E-visa submission request:", { ...payload, passportNumber: "[REDACTED]" });

    const {
      nationality,
      fullName,
      email,
      passportNumber,
      travelDate,
      visaType,
      purposeOfVisit,
      paymentReference,
      visaFeeAmount,
      documentUrls = [],
    } = payload;

    // Validate required fields
    if (!paymentReference) {
      throw new Error("Payment reference is required");
    }

    // Verify the payment with Paystack
    const verificationResult = await verifyPaystackTransaction(paymentReference);

    if (!verificationResult.status || verificationResult.data.status !== "success") {
      throw new Error(
        `Payment verification failed. Transaction status: ${verificationResult.data.status}`,
      );
    }

    // Check if payment amount matches the visa fee (amount in kobo for Paystack)
    const paidAmountInGHS = verificationResult.data.amount / 100;
    if (Math.abs(paidAmountInGHS - visaFeeAmount) > 0.01) {
      console.warn(
        `Payment amount mismatch. Expected: ${visaFeeAmount}, Received: ${paidAmountInGHS}`,
      );
    }

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate reference number
    const referenceNumber = `EVISA-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Insert the e-visa application
    const { data: application, error: insertError } = await supabase
      .from("evisa_applications")
      .insert({
        reference_number: referenceNumber,
        nationality,
        full_name: fullName,
        email,
        passport_number: passportNumber,
        travel_date: travelDate,
        visa_type: visaType,
        purpose_of_visit: purposeOfVisit,
        visa_fee_amount: visaFeeAmount,
        payment_status: "paid",
        payment_reference: paymentReference,
        payment_verified_at: new Date().toISOString(),
        application_status: "submitted",
        document_urls: documentUrls,
        metadata: {
          paystack_transaction_id: verificationResult.data.id,
          paid_amount_ghs: paidAmountInGHS,
          currency: verificationResult.data.currency,
          paid_at: verificationResult.data.paid_at,
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting e-visa application:", insertError);
      throw new Error(`Failed to create e-visa application: ${insertError.message}`);
    }

    console.log("E-visa application created successfully:", application.id);

    // Send email notifications
    try {
      console.log("Sending email notifications...");
      const notificationResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-evisa-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          applicantEmail: email,
          applicantName: fullName,
          referenceNumber,
          visaType,
          travelDate,
        }),
      });

      if (!notificationResponse.ok) {
        console.error("Failed to send notification emails:", await notificationResponse.text());
      } else {
        console.log("Email notifications sent successfully");
      }
    } catch (emailError) {
      console.error("Error sending email notifications:", emailError);
      // Don't fail the application if emails fail
    }

    return new Response(
      JSON.stringify({
        success: true,
        referenceNumber,
        applicationId: application.id,
        message: "Your e-visa application has been submitted successfully.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: any) {
    console.error("Error in verify-evisa-payment function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
