package com.sih.verification.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class QrCodeService {

    /**
     * Generates a QR Code as PNG byte array using Google ZXing.
     */
    public byte[] generateQrCodePng(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code: " + e.getMessage(), e);
        }
    }

    /**
     * Generates a QR Code as a Base64 Data URL suitable for direct HTML <img> rendering.
     * Example output: "data:image/png;base64,iVBORw0KGgoAAAANS..."
     */
    public String generateQrCodeBase64(String text, int width, int height) {
        byte[] pngBytes = generateQrCodePng(text, width, height);
        String base64 = Base64.getEncoder().encodeToString(pngBytes);
        return "data:image/png;base64," + base64;
    }
}
