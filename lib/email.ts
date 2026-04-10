import { Resend } from "resend";
import { InvoiceSentEmail } from "@/components/emails/InvoiceSentEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceSentEmail({
  clientName,
  clientEmail,
  invoiceNumber,
  invoiceAmount,
  dueDate,
  invoiceLink,
  businessName = "ClientOps",
}: {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceAmount: number;
  dueDate: string;
  invoiceLink: string;
  businessName?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${businessName} <noreply@yourdomain.com>`,
      to: [clientEmail],
      subject: `Invoice #${invoiceNumber} from ${businessName}`,
      react: InvoiceSentEmail({
        clientName,
        invoiceNumber,
        invoiceAmount,
        dueDate,
        invoiceLink,
        businessName,
      }),
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
