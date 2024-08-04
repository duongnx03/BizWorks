package bizworks.backend.repository;

import bizworks.backend.models.VerifyAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerifyAccountRepository extends JpaRepository<VerifyAccount, Long> {
    Optional<VerifyAccount> findByUserId(Long userId);
}
