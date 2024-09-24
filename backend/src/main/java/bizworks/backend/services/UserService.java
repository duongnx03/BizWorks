package bizworks.backend.services;

import bizworks.backend.models.User;
import bizworks.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void createUser(User user){
        userRepository.save(user);
    }

    public List<User> findByRole(String role) {
        return userRepository.findByRole(role);
    }
}
