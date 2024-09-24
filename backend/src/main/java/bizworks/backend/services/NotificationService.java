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

    public void sendNotification(String recipient, String message) {
        // Implementation to send the notification
        System.out.println("Sending notification to: " + recipient);
        System.out.println("Message: " + message);
    }

}