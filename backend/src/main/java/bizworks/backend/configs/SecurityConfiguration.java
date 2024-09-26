package bizworks.backend.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/auth/authenticate").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/forgot-password/reset").permitAll()
                        .requestMatchers("/api/auth/register").hasAnyAuthority("ADMIN", "MANAGE", "LEADER")
                        .requestMatchers("/api/auth/logout").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/auth/refresh").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/verify/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/auth/reset-password").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/employee/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/attendance/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/violation-types/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/violations/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/violation_complaints/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/salaries/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/departments/**").hasAnyAuthority("ADMIN", "LEADER", "MANAGE")
                        .requestMatchers("/api/positions/**").hasAnyAuthority("ADMIN", "LEADER", "MANAGE")
                        .requestMatchers("/api/complaint/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/overtime/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/emp-queue/**").hasAnyAuthority("ADMIN", "LEADER", "MANAGE")
                        .requestMatchers("/api/missedCheckOut/**").hasAnyAuthority("ADMIN", "LEADER", "MANAGE", "EMPLOYEE")
                        .requestMatchers("/api/review/**").hasAnyAuthority("ADMIN", "LEADER", "MANAGE", "EMPLOYEE")
                        .requestMatchers("/api/job-postings/**").permitAll()
                        .requestMatchers("/api/job-applications/**").permitAll()
                        .requestMatchers("/api/exams/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER" , "MANAGE")
                        .requestMatchers("/api/questions/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER" , "MANAGE")
                        .requestMatchers("/api/answers/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER" , "MANAGE")
                        .requestMatchers("/api/files/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER" , "MANAGE")
                        .requestMatchers("/api/files/upload/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER" , "MANAGE")
                        .requestMatchers("/api/training-programs/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER" , "MANAGE")
                        .requestMatchers("/api/interview-schedules/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER" , "MANAGE")
                        .requestMatchers("/api/favorites/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER" , "MANAGE")
                        .requestMatchers("/api/leave-requests/**").hasAnyAuthority("ADMIN", "LEADER", "MANAGE", "EMPLOYEE")
                        .requestMatchers("/api/training-contents/**").hasAnyAuthority("ADMIN", "LEADER", "MANAGE", "EMPLOYEE")

                        .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
