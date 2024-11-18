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
        String htmlContent = "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<style>" +
                "  body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }" +
                "  .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }" +
                "  .email-header { font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333333; }" +
                "  .email-content { font-size: 16px; color: #555555; margin-bottom: 20px; }" +
                "  .email-button { display: inline-block; text-decoration: none; padding: 10px 20px; background-color: #007bff; color: white; font-weight: bold; border-radius: 5px; margin-top: 20px; }" +
                "  .email-button:hover { background-color: #0056b3; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "  <div class='email-container'>" +
                "    <div class='email-header'>Thank you for your order!</div>" +
                "    <div class='email-content'>" +
                "      Your tracking ID is: <strong>" + tracking + "</strong>.<br>" +
                "      You can track your order by clicking the button below." +
                "    </div>" +
                "    <a class='email-button' href='https://tracking.ghn.dev/?order_code=" + tracking + "' target='_blank'>Track Your Order</a>" +
                "  </div>" +
                "</body>" +
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

