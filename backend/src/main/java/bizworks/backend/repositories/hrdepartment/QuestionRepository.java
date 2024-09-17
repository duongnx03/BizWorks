    package bizworks.backend.repositories.hrdepartment;

    import bizworks.backend.models.hrdepartment.Question;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.stereotype.Repository;

    @Repository
    public interface QuestionRepository extends JpaRepository<Question, Long> {
    }
