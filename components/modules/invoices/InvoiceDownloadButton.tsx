"use client"

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 10,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  clientInfo: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  datesRow: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 32,
  },
  dateLabel: {
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 12,
    color: "#0f172a",
    fontWeight: "bold",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 10,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "center" },
  col3: { flex: 1, textAlign: "right" },
  col4: { flex: 1, textAlign: "right" },
  cellText: {
    fontSize: 11,
    color: "#374151",
  },
  totalsSection: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 40,
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 11,
    color: "#6b7280",
    width: 80,
    textAlign: "right",
  },
  totalValue: {
    fontSize: 11,
    color: "#0f172a",
    width: 80,
    textAlign: "right",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 40,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#0f172a",
  },
  grandTotalLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0f172a",
    width: 80,
    textAlign: "right",
  },
  grandTotalValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0f172a",
    width: 80,
    textAlign: "right",
  },
  notesSection: {
    marginTop: 40,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
  },
  notesTitle: {
    fontSize: 10,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 11,
    color: "#6b7280",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    textAlign: "center",
    fontSize: 10,
    color: "#9ca3af",
  },
})

type Props = {
  invoice: {
    number: string
    status: string
    issueDate: Date
    dueDate: Date
    subtotal: number
    tax: number
    discount: number
    total: number
    currency: string
    notes: string | null
    terms: string | null
    client: {
      name: string
      email: string
      company: string | null
    }
    items: {
      id: string
      description: string
      quantity: number
      rate: number
      amount: number
    }[]
  }
}

function InvoiceDocument({ invoice }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>ClientOps</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.number}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={styles.clientName}>{invoice.client.name}</Text>
          <Text style={styles.clientInfo}>{invoice.client.email}</Text>
          {invoice.client.company && (
            <Text style={styles.clientInfo}>{invoice.client.company}</Text>
          )}
        </View>

        <View style={styles.datesRow}>
          <View>
            <Text style={styles.dateLabel}>Issue Date</Text>
            <Text style={styles.dateValue}>
              {new Date(invoice.issueDate).toLocaleDateString()}
            </Text>
          </View>
          <View>
            <Text style={styles.dateLabel}>Due Date</Text>
            <Text style={styles.dateValue}>
              {new Date(invoice.dueDate).toLocaleDateString()}
            </Text>
          </View>
          <View>
            <Text style={styles.dateLabel}>Status</Text>
            <Text style={styles.dateValue}>{invoice.status}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.col3]}>Rate</Text>
          <Text style={[styles.tableHeaderText, styles.col4]}>Amount</Text>
        </View>

        {invoice.items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.cellText, styles.col1]}>{item.description}</Text>
            <Text style={[styles.cellText, styles.col2]}>{item.quantity}</Text>
            <Text style={[styles.cellText, styles.col3]}>${item.rate.toLocaleString()}</Text>
            <Text style={[styles.cellText, styles.col4]}>${item.amount.toLocaleString()}</Text>
          </View>
        ))}

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${invoice.subtotal.toLocaleString()}</Text>
          </View>
          {invoice.tax > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>${invoice.tax.toLocaleString()}</Text>
            </View>
          )}
          {invoice.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>-${invoice.discount.toLocaleString()}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {invoice.currency} ${invoice.total.toLocaleString()}
            </Text>
          </View>
        </View>

        {(invoice.notes || invoice.terms) && (
          <View style={styles.notesSection}>
            {invoice.notes && (
              <>
                <Text style={styles.notesTitle}>Notes</Text>
                <Text style={styles.notesText}>{invoice.notes}</Text>
              </>
            )}
            {invoice.terms && (
              <>
                <Text style={[styles.notesTitle, { marginTop: 10 }]}>Terms</Text>
                <Text style={styles.notesText}>{invoice.terms}</Text>
              </>
            )}
          </View>
        )}

        <Text style={styles.footer}>
          Generated by ClientOps · {invoice.number}
        </Text>
      </Page>
    </Document>
  )
}

export default function InvoiceDownloadButton({ invoice }: Props) {
  return (
    <PDFDownloadLink
      document={<InvoiceDocument invoice={invoice} />}
      fileName={`${invoice.number}.pdf`}
    >
      {({ loading }) => (
        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? "Preparing PDF..." : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  )
}
