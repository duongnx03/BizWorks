package bizworks.backend.configs;

import bizworks.backend.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        final String[] jwt = new String[1]; // Sử dụng mảng để giữ giá trị

        // Kiểm tra cookie chứa JWT
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                jwt[0] = Arrays.stream(cookies)
                        .filter(cookie -> "access_token".equals(cookie.getName()))
                        .map(Cookie::getValue)
                        .findAny()
                        .orElse(null);
            }
        } else {
            jwt[0] = authHeader.substring(7);
        }

        // Nếu tìm thấy JWT, xử lý xác thực
        if (jwt[0] != null) {
            String userEmail = jwtService.extractUsername(jwt[0]);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if (jwtService.isTokenValid(jwt[0], userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // Thêm Bearer token vào Authorization header
                    request.setAttribute("jwt", jwt[0]);
                    request = new HttpServletRequestWrapper(request) {
                        @Override
                        public String getHeader(String name) {
                            if ("Authorization".equals(name)) {
                                return "Bearer " + jwt[0];
                            }
                            return super.getHeader(name);
                        }
                    };
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}