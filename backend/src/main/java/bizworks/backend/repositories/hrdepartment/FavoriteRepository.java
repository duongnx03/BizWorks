package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.User;
import bizworks.backend.models.hrdepartment.Favorite;
import bizworks.backend.models.hrdepartment.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserAndJobPosting(User user, JobPosting jobPosting);
    List<Favorite> findByUserId(Long userId);

}