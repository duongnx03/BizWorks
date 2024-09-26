package bizworks.backend.services;
import bizworks.backend.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendNotification(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("bizworks8386@gmail.com"); // Địa chỉ email của hệ thống

        mailSender.send(message);

}
    }