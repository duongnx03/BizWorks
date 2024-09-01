package bizwebsite.example.demo.config;

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
                        .requestMatchers("/api/auth/authenticate").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/forgot-password/reset").permitAll()
                        .requestMatchers("/api/auth/register").hasAnyAuthority("ADMIN")
                        .requestMatchers("/api/auth/logout").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api/auth/refresh").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api/verify/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/auth/reset-password")
                        .hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER", "MANAGE")
                        .requestMatchers("/api/employee/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api/attendance/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api/violation-types/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api/violations/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api/salaries/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api//companies/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api/job-posts/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api/applications/**").hasAnyAuthority("ADMIN", "EMPLOYEE", "LEADER")
                        .requestMatchers("/api/departments/**").hasAnyAuthority("ADMIN", "LEADER", "MANAGE")
                        .requestMatchers("/api/positions/**").hasAnyAuthority("ADMIN", "LEADER", "MANAGE")
                        .anyRequest().authenticated())

                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}
