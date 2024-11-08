package com.example.demo.utils;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class MailService {

    @Value("${spring.mail.host}")
    private String mailHost;

    @Value("${spring.mail.port}")
    private int mailPort;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${spring.mail.password}")
    private String mailPassword;

    public void sendMailReset(String email, String code) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");

        String subject = "Password Reset Request";
        String htmlContent = "<div style=\"max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333; border: 1px solid #ddd; border-radius: 8px; padding: 20px;\">\n" +
                "    <h2 style=\"color: #007bff; text-align: center; font-size: 24px; margin-bottom: 20px;\">Password Reset Request</h2>\n" +
                "    <p style=\"font-size: 16px;\">Dear my love,</p>\n" +
                "    <p style=\"font-size: 16px; line-height: 1.5;\">You requested a password reset. Please click the link below to reset your password:</p>\n" +
                "    <div style=\"background-color: #f8f9fa; padding: 15px; border: 1px dashed #007bff; text-align: center; font-size: 18px; color: #007bff; margin: 20px 0; border-radius: 5px;\">\n" +
                "        <a href=\"http://localhost:3000/reset-password?code="+code+"&email="+email +"\" style=\"text-decoration: none; color: #007bff; font-weight: bold;\">\n" +
                "            Click here to reset your password\n" +
                "        </a>\n" +
                "    </div>\n" +
                "    <p style=\"font-size: 16px; line-height: 1.5;\">This link will expire in 15 minutes.</p>\n" +
                "    <p style=\"font-size: 16px; line-height: 1.5;\">If you didn't request a password reset, please ignore this email.</p>\n" +
                "    <hr style=\"border: none; border-top: 1px solid #ddd; margin: 20px 0;\">\n" +
                "    <p style=\"font-size: 14px; color: #333;\">Thank you,</p>\n" +
                "    <p style=\"font-size: 14px; color: #007bff; font-weight: bold;\">SW-Sport</p>\n" +
                "</div>\n";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom(mailUsername);

            mailSender.send(message);

            System.out.println("Password reset email sent successfully!");

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}

