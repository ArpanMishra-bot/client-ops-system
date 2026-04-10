import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface InvoiceSentEmailProps {
  clientName: string;
  invoiceNumber: string;
  invoiceAmount: number;
  dueDate: string;
  invoiceLink: string;
  businessName?: string;
}

export const InvoiceSentEmail = ({
  clientName,
  invoiceNumber,
  invoiceAmount,
  dueDate,
  invoiceLink,
  businessName = "ClientOps",
}: InvoiceSentEmailProps) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(invoiceAmount);

  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Your invoice #{invoiceNumber} from {businessName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>{businessName}</Heading>
            <Text style={headerSubtitle}>Client Operations Platform</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={greeting}>Hi {clientName},</Text>
            <Text style={paragraph}>
              A new invoice has been created for your recent work with {businessName}.
              Please review the details below.
            </Text>
          </Section>

          <Section style={card}>
            <Row style={cardRow}>
              <Column style={cardLabel}>Invoice Number</Column>
              <Column style={cardValue}>{invoiceNumber}</Column>
            </Row>
            <Row style={cardRow}>
              <Column style={cardLabel}>Amount Due</Column>
              <Column style={cardValueLarge}>{formattedAmount}</Column>
            </Row>
            <Row style={cardRow}>
              <Column style={cardLabel}>Due Date</Column>
              <Column style={cardValue}>{formattedDueDate}</Column>
            </Row>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={invoiceLink}>
              View Invoice
            </Button>
          </Section>

          <Section style={section}>
            <Text style={paragraph}>
              If you have any questions about this invoice, please reply to this email.
            </Text>
            <Text style={smallText}>
              Payment is due by {formattedDueDate}.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              {businessName} — Helping freelancers and agencies run their business.
            </Text>
            <Text style={footerSmall}>
              This is an automated message. Please do not reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6e6e6",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "40px 20px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "20px",
};

const headerTitle = {
  color: "#6366f1",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
};

const headerSubtitle = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "5px 0 0",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "20px 0",
};

const section = {
  marginBottom: "24px",
};

const greeting = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const paragraph = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const card = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  marginBottom: "24px",
  padding: "20px",
};

const cardRow = {
  marginBottom: "12px",
};

const cardLabel = {
  color: "#6b7280",
  fontSize: "14px",
  width: "40%",
};

const cardValue = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
};

const cardValueLarge = {
  color: "#6366f1",
  fontSize: "24px",
  fontWeight: "bold",
};

const buttonSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
};

const smallText = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "8px 0 0",
};

const footer = {
  marginTop: "32px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0 0 8px",
};

const footerSmall = {
  color: "#9ca3af",
  fontSize: "10px",
  margin: "0",
};
