import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const regionalCommands = [
  { region: "Greater Accra Region", headquarters: "Accra", borderPosts: 3, phone: "+233 302 258 250", email: "accra@gis.gov.gh" },
  { region: "Ashanti Region", headquarters: "Kumasi", borderPosts: 2, phone: "+233 322 022 145", email: "kumasi@gis.gov.gh" },
  { region: "Western Region", headquarters: "Sekondi-Takoradi", borderPosts: 4, phone: "+233 312 046 123", email: "takoradi@gis.gov.gh" },
  { region: "Central Region", headquarters: "Cape Coast", borderPosts: 2, phone: "+233 332 132 456", email: "capecoast@gis.gov.gh" },
  { region: "Eastern Region", headquarters: "Koforidua", borderPosts: 3, phone: "+233 342 022 789", email: "koforidua@gis.gov.gh" },
  { region: "Volta Region", headquarters: "Ho", borderPosts: 5, phone: "+233 362 026 321", email: "ho@gis.gov.gh" },
  { region: "Northern Region", headquarters: "Tamale", borderPosts: 4, phone: "+233 372 022 654", email: "tamale@gis.gov.gh" },
  { region: "Upper East Region", headquarters: "Bolgatanga", borderPosts: 6, phone: "+233 382 022 987", email: "bolgatanga@gis.gov.gh" },
  { region: "Upper West Region", headquarters: "Wa", borderPosts: 5, phone: "+233 392 022 147", email: "wa@gis.gov.gh" },
  { region: "Bono Region", headquarters: "Sunyani", borderPosts: 2, phone: "+233 352 027 258", email: "sunyani@gis.gov.gh" },
  { region: "Bono East Region", headquarters: "Techiman", borderPosts: 2, phone: "+233 352 522 369", email: "techiman@gis.gov.gh" },
  { region: "Ahafo Region", headquarters: "Goaso", borderPosts: 1, phone: "+233 352 922 471", email: "goaso@gis.gov.gh" },
  { region: "Western North Region", headquarters: "Sefwi Wiawso", borderPosts: 3, phone: "+233 312 922 582", email: "sefwiwiawso@gis.gov.gh" },
  { region: "Oti Region", headquarters: "Dambai", borderPosts: 4, phone: "+233 362 922 693", email: "dambai@gis.gov.gh" },
  { region: "North East Region", headquarters: "Nalerigu", borderPosts: 3, phone: "+233 372 922 714", email: "nalerigu@gis.gov.gh" },
  { region: "Savannah Region", headquarters: "Damongo", borderPosts: 4, phone: "+233 372 522 825", email: "damongo@gis.gov.gh" },
];

export const PrintableDirectory = () => {
  const handlePrint = () => {
    const printContent = document.getElementById("printable-directory");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GIS Regional Commands Directory</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #006b3f;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #006b3f;
              margin: 0 0 10px 0;
            }
            .header p {
              color: #666;
              margin: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background: #006b3f;
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-size: 12px;
            }
            td {
              padding: 10px 8px;
              border-bottom: 1px solid #ddd;
              font-size: 11px;
            }
            tr:nth-child(even) {
              background: #f9f9f9;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Ghana Immigration Service</h1>
            <p>Regional Commands Directory</p>
            <p style="font-size: 12px; margin-top: 10px;">Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Region</th>
                <th>Headquarters</th>
                <th>Border Posts</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              ${regionalCommands.map(cmd => `
                <tr>
                  <td><strong>${cmd.region}</strong></td>
                  <td>${cmd.headquarters}</td>
                  <td>${cmd.borderPosts}</td>
                  <td>${cmd.phone}</td>
                  <td>${cmd.email}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>Ghana Immigration Service Headquarters</p>
            <p>Independence Avenue, Accra | Tel: +233 302 258 250</p>
            <p>www.gis.gov.gh</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
      <Printer className="w-4 h-4" />
      Print Directory
    </Button>
  );
};
