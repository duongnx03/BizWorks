package bizworks.backend.services.humanresources;


import bizworks.backend.dtos.hrdepartment.FavoriteDTO;
import bizworks.backend.models.User;
import bizworks.backend.models.hrdepartment.Favorite;
import bizworks.backend.models.hrdepartment.JobPosting;
import bizworks.backend.repositories.UserRepository;
import bizworks.backend.repositories.hrdepartment.FavoriteRepository;
import bizworks.backend.repositories.hrdepartment.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;


    public void saveFavorite(FavoriteDTO favoriteDTO) {
        User user = userRepository.findById(favoriteDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        JobPosting jobPosting = jobPostingRepository.findById(favoriteDTO.getJobPostingId())
                .orElseThrow(() -> new RuntimeException("Job posting not found"));

        if (favoriteRepository.existsByUserAndJobPosting(user, jobPosting)) {
            throw new RuntimeException("Already added to favorites");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setJobPosting(jobPosting);
        favoriteRepository.save(favorite);
    }


    public List<Favorite> getFavoritesByUserId(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }
}