package bizworks.backend.controllers.hrdepartment;

import bizworks.backend.dtos.hrdepartment.FavoriteDTO;
import bizworks.backend.models.hrdepartment.Favorite;
import bizworks.backend.services.humanresources.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<String> addFavorite(@RequestBody FavoriteDTO favoriteDTO) {
        favoriteService.saveFavorite(favoriteDTO);
        return ResponseEntity.ok("Favorite added successfully");
    }
    @GetMapping
    public List<Favorite> getFavoriteJobPostings(@RequestParam Long userId) {
        return favoriteService.getFavoritesByUserId(userId);
    }
}