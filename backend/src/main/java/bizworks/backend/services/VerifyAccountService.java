package aptech.project.services;

import aptech.project.models.User;
import aptech.project.models.VerifyAccount;
import aptech.project.repository.VerifyAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class VerifyAccountService {
    @Autowired
    private VerifyAccountRepository verifyAccountRepository;

    public VerifyAccount createVerifyAccount(User user) {
        VerifyAccount verifyAccount = new VerifyAccount();
        verifyAccount.setVerify(false);
        verifyAccount.setVerificationCode(generateVerificationCode());
        verifyAccount.setCreatedAt(LocalDateTime.now());
        verifyAccount.setUser(user);

        return verifyAccountRepository.save(verifyAccount);
    }

    public VerifyAccount resendVerificationCode(VerifyAccount verifyAccount) {
        verifyAccount.setVerificationCode(generateVerificationCode());
        return verifyAccountRepository.save(verifyAccount);
    }

    public void save(VerifyAccount verifyAccount){
        verifyAccountRepository.save(verifyAccount);
    }

    public VerifyAccount findByUserId(Long userId) {
        return verifyAccountRepository.findByUserId(userId).orElseThrow();
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
