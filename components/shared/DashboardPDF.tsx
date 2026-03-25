import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: "#ffffff" },
  title: { fontSize: 24, marginBottom: 20 },
  section: { marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
})

export function DashboardPDF({ data }: { data: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Dashboard Report</Text>
        <View style={styles.section}>
          <Text style={styles.text}>Revenue: ${data.revenue}</Text>
          <Text style={styles.text}>Active Clients: {data.clients}</Text>
          <Text style={styles.text}>Active Leads: {data.leads}</Text>
        </View>
      </Page>
    </Document>
  )
}
