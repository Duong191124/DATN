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

    public void sendTrackingOrder(String email, String tracking) {
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

        String subject = "Track Your Order";
        String htmlContent = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Sport Swear - Order Tracking</title>\n" +
                "</head>\n" +
                "<body style=\"margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f7f7f7; -webkit-font-smoothing: antialiased; line-height: 1.6;\">\n" +
                "    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"margin: 0; padding: 0;\">\n" +
                "        <tr>\n" +
                "            <td align=\"center\" style=\"padding: 20px 0;\">\n" +
                "                <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);\">\n" +
                "                    <!-- Header with Logo -->\n" +
                "                    <tr>\n" +
                "                        <td style=\"padding: 30px 30px 20px; text-align: center;\">\n" +
                "                            <h1 style=\"margin: 0; color: #333333; font-size: 28px; font-weight: bold;\">Sport Swear</h1>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                    \n" +
                "                    <!-- Main Content -->\n" +
                "                    <tr>\n" +
                "                        <td style=\"padding: 0 30px;\">\n" +
                "                            <div style=\"padding: 20px; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;\">\n" +
                "                                <h2 style=\"margin: 0 0 15px; color: #1a73e8; font-size: 22px;\">Thank You for Your Order!</h2>\n" +
                "                                <p style=\"margin: 0; color: #555555; font-size: 16px;\">We're excited to let you know that your order is on its way.</p>\n" +
                "                            </div>\n" +
                "                            \n" +
                "                            <!-- Tracking Info -->\n" +
                "                            <div style=\"margin-bottom: 30px;\">\n" +
                "                                <p style=\"margin: 0 0 10px; color: #333333; font-size: 16px;\">Your tracking number:</p>\n" +
                "                                <div style=\"padding: 15px; background-color: #e8f0fe; border-radius: 4px; font-family: monospace; font-size: 18px; color: #1a73e8; text-align: center;\">\n" +
                "                                    <strong>"+ tracking +"</strong>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            \n" +
                "                            <!-- Track Button -->\n" +
                "                            <div style=\"text-align: center; margin-bottom: 30px;\">\n" +
                "                                <a href=\"https://tracking.ghn.dev/?order_code=" + tracking +" \"\" style=\"display: inline-block; padding: 14px 30px; background-color: #1a73e8; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 16px; transition: background-color 0.2s;\">Track Your Order</a>\n" +
                "                            </div>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                    \n" +
                "                    <!-- Footer -->\n" +
                "                    <tr>\n" +
                "                        <td style=\"padding: 20px 30px; background-color: #f8f9fa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;\">\n" +
                "                            <p style=\"margin: 0; color: #666666; font-size: 14px; text-align: center;\">\n" +
                "                                If you have any questions, please contact our support team.<br>\n" +
                "                                © 2024 Sport Swear. All rights reserved.\n" +
                "                            </p>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                </table>\n" +
                "            </td>\n" +
                "        </tr>\n" +
                "    </table>\n" +
                "</body>\n" +
                "</html>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom(mailUsername);

            mailSender.send(message);

            System.out.println("Order tracking email sent successfully!");

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

}

