package com.sih.verification.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.sih.verification.entity.Certificate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfCertificateService {

    @Autowired
    private QrCodeService qrCodeService;

    public byte[] generateCertificatePdf(Certificate certificate, String verificationUrl) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            Color primaryNavy = new Color(24, 43, 73);
            Color goldAccent = new Color(184, 134, 11);
            Color darkGray = new Color(50, 50, 50);

            // Fonts
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, primaryNavy);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, goldAccent);
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, primaryNavy);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, darkGray);
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, Color.GRAY);

            // Outer Border / Container Table
            PdfPTable containerTable = new PdfPTable(1);
            containerTable.setWidthPercentage(100);
            PdfPCell containerCell = new PdfPCell();
            containerCell.setBorder(Rectangle.BOX);
            containerCell.setBorderWidth(3f);
            containerCell.setBorderColor(primaryNavy);
            containerCell.setPadding(20f);

            // 1. Department Header
            Paragraph deptHeader = new Paragraph("GOVERNMENT OF INDIA", headerFont);
            deptHeader.setAlignment(Element.ALIGN_CENTER);
            containerCell.addElement(deptHeader);

            Paragraph deptSub = new Paragraph("DEPARTMENT OF LEGAL METROLOGY (WEIGHTS & MEASURES)", subHeaderFont);
            deptSub.setAlignment(Element.ALIGN_CENTER);
            containerCell.addElement(deptSub);

            Paragraph docTitle = new Paragraph("CERTIFICATE OF VERIFICATION", titleFont);
            docTitle.setAlignment(Element.ALIGN_CENTER);
            docTitle.setSpacingBefore(8f);
            docTitle.setSpacingAfter(15f);
            containerCell.addElement(docTitle);

            // 2. Certificate Number Banner
            PdfPTable bannerTable = new PdfPTable(1);
            bannerTable.setWidthPercentage(100);
            PdfPCell bannerCell = new PdfPCell(new Phrase("Certificate Number: " + certificate.getCertificateNumber(),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.WHITE)));
            bannerCell.setBackgroundColor(primaryNavy);
            bannerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            bannerCell.setPadding(6f);
            bannerCell.setBorder(Rectangle.NO_BORDER);
            bannerTable.addCell(bannerCell);
            containerCell.addElement(bannerTable);

            // Space
            Paragraph space = new Paragraph(" ");
            space.setSpacingBefore(10f);
            containerCell.addElement(space);

            // 3. Instrument and Owner Details Table
            PdfPTable detailsTable = new PdfPTable(2);
            detailsTable.setWidthPercentage(100);
            detailsTable.setWidths(new float[]{35f, 65f});

            addTableRow(detailsTable, "Instrument Number:", certificate.getInstrument().getInstrumentNumber(), labelFont, valueFont);
            addTableRow(detailsTable, "Instrument Type:", certificate.getInstrument().getInstrumentType(), labelFont, valueFont);
            addTableRow(detailsTable, "Business / Owner Name:", certificate.getInstrument().getOwner().getName(), labelFont, valueFont);
            addTableRow(detailsTable, "Owner Contact (Email):", certificate.getInstrument().getOwner().getEmail(), labelFont, valueFont);
            addTableRow(detailsTable, "Verification Location:", certificate.getInstrument().getLocation(), labelFont, valueFont);

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            addTableRow(detailsTable, "Date of Verification:", certificate.getIssueDate().format(dtf), labelFont, valueFont);
            addTableRow(detailsTable, "Certificate Expiry Date:", certificate.getExpiryDate().format(dtf), labelFont, valueFont);
            addTableRow(detailsTable, "Verification Status:", certificate.getStatus().name(), labelFont,
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(16, 137, 62)));

            containerCell.addElement(detailsTable);

            // 4. Verification Statement & QR Code row
            PdfPTable bottomTable = new PdfPTable(2);
            bottomTable.setWidthPercentage(100);
            bottomTable.setWidths(new float[]{70f, 30f});
            bottomTable.setSpacingBefore(15f);

            // Legal statement
            PdfPCell statementCell = new PdfPCell();
            statementCell.setBorder(Rectangle.NO_BORDER);
            Paragraph statement = new Paragraph(
                    "This is to certify that the weighing / measuring instrument described above has been inspected, tested, and verified in accordance with the Legal Metrology Act and Standards. The instrument is approved for commercial use until the expiry date stated above.",
                    FontFactory.getFont(FontFactory.HELVETICA, 9, darkGray));
            statement.setLeading(12f);
            statementCell.addElement(statement);

            Paragraph note = new Paragraph(
                    "\nScan the official QR code to authenticate this certificate via the Government Legal Metrology Verification Portal.",
                    smallFont);
            statementCell.addElement(note);
            bottomTable.addCell(statementCell);

            // QR Code image
            PdfPCell qrCell = new PdfPCell();
            qrCell.setBorder(Rectangle.NO_BORDER);
            qrCell.setHorizontalAlignment(Element.ALIGN_CENTER);

            byte[] qrBytes = qrCodeService.generateQrCodePng(verificationUrl, 120, 120);
            Image qrImage = Image.getInstance(qrBytes);
            qrImage.setAlignment(Element.ALIGN_CENTER);
            qrCell.addElement(qrImage);
            bottomTable.addCell(qrCell);

            containerCell.addElement(bottomTable);

            // 5. Signature representation
            Paragraph sign = new Paragraph("\n\nDigitally Signed by Authorized Legal Metrology Verification Officer\nGovernment of India", smallFont);
            sign.setAlignment(Element.ALIGN_RIGHT);
            containerCell.addElement(sign);

            containerTable.addCell(containerCell);
            document.add(containerTable);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF certificate: " + e.getMessage(), e);
        }
    }

    private void addTableRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setPadding(5f);
        labelCell.setBackgroundColor(new Color(245, 247, 250));
        labelCell.setBorderColor(new Color(220, 224, 230));

        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setPadding(5f);
        valueCell.setBorderColor(new Color(220, 224, 230));

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
