import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";
import JSZip from "https://esm.sh/jszip@3.10.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkDownloadRequest {
  applicationIds: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Bulk download documents request received");
    
    const { applicationIds }: BulkDownloadRequest = await req.json();

    if (!applicationIds || applicationIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "No application IDs provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing ${applicationIds.length} applications`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch applications with documents
    const { data: applications, error: fetchError } = await supabase
      .from("evisa_applications")
      .select("id, reference_number, full_name, document_urls")
      .in("id", applicationIds);

    if (fetchError) {
      console.error("Error fetching applications:", fetchError);
      throw fetchError;
    }

    if (!applications || applications.length === 0) {
      return new Response(
        JSON.stringify({ error: "No applications found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create ZIP archive
    const zip = new JSZip();
    let totalFiles = 0;
    let failedFiles = 0;

    for (const app of applications) {
      if (!app.document_urls || app.document_urls.length === 0) {
        console.log(`No documents for application ${app.reference_number}`);
        continue;
      }

      // Create a folder for each application
      const folderName = `${app.reference_number}_${app.full_name.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const appFolder = zip.folder(folderName);

      if (!appFolder) {
        console.error(`Failed to create folder for ${app.reference_number}`);
        continue;
      }

      // Download each document
      for (const docPath of app.document_urls) {
        try {
          totalFiles++;
          console.log(`Downloading ${docPath}...`);

          const { data: fileData, error: downloadError } = await supabase.storage
            .from("evisa-documents")
            .download(docPath);

          if (downloadError) {
            console.error(`Failed to download ${docPath}:`, downloadError);
            failedFiles++;
            continue;
          }

          // Get filename from path
          const fileName = docPath.split('/').pop() || `document_${totalFiles}`;
          
          // Add file to ZIP
          appFolder.file(fileName, fileData);
          console.log(`Added ${fileName} to ZIP`);
        } catch (error) {
          console.error(`Error processing document ${docPath}:`, error);
          failedFiles++;
        }
      }
    }

    if (totalFiles === 0) {
      return new Response(
        JSON.stringify({ error: "No documents found in selected applications" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Creating ZIP archive with ${totalFiles - failedFiles} files...`);

    // Generate ZIP file as blob
    const zipData = await zip.generateAsync({ 
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `evisa_documents_${timestamp}.zip`;

    console.log(`ZIP created: ${filename}`);

    return new Response(zipData, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in bulk-download-documents function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to create ZIP archive" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
