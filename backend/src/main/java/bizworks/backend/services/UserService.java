package bizworks.backend.services;

import bizworks.backend.models.User;
import bizworks.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void createUser(User user){
        userRepository.save(user);
    }
}
