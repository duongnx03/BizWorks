package bizworks.backend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to, String subject, String content) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true indicates HTML content
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
            // Handle the exception (e.g., log it or rethrow it)
        }
    }

    public void sendHtmlEmail(String to, String subject, String employeeName, String programName, String startDate, String endDate) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            // Read the HTML template from the resources folder
            ClassPathResource resource = new ClassPathResource("EmailForm.html");
            String htmlContent = new String(FileCopyUtils.copyToByteArray(resource.getInputStream()));

            // Replace placeholders in the HTML template
            htmlContent = htmlContent.replace("[EmployeeName]", employeeName)
                    .replace("[ProgramName]", programName)
                    .replace("[StartDate]", startDate)
                    .replace("[EndDate]", endDate)
                    .replace("[Year]", String.valueOf(java.time.LocalDate.now().getYear()));

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indicates HTML content

            javaMailSender.send(mimeMessage);
        } catch (MessagingException | IOException e) {
            e.printStackTrace();
            // Handle the exception (e.g., log it or rethrow it)
        }
    }
}
