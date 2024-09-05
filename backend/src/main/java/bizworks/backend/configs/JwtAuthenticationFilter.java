package bizworks.backend.configs;

import bizworks.backend.models.RefreshToken;
import bizworks.backend.services.JwtService;
import bizworks.backend.services.RefreshTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final RefreshTokenService refreshTokenService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        final String[] jwt = new String[1]; // Sử dụng mảng để giữ giá trị

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

        if (jwt[0] != null) {
            String userEmail = jwtService.extractUsername(jwt[0]);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                boolean isTokenValid = jwtService.isTokenValid(jwt[0], userDetails);

                if (isTokenValid) {
                    // Nếu access token hợp lệ
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
                } else {
                    // Access token hết hạn, kiểm tra refresh token
                    String refreshTokenFromCookie = getRefreshTokenFromCookies(request);

                    if (refreshTokenFromCookie != null) {
                        Optional<RefreshToken> refreshTokenOptional = refreshTokenService.findByToken(refreshTokenFromCookie);

                        if (refreshTokenOptional.isPresent() && jwtService.isRefreshTokenValid(refreshTokenFromCookie)) {
                            String newAccessToken = jwtService.generateToken(userDetails);

                            Cookie newAccessTokenCookie = new Cookie("access_token", newAccessToken);
                            newAccessTokenCookie.setHttpOnly(true);
                            newAccessTokenCookie.setPath("/");
                            response.addCookie(newAccessTokenCookie);

                            UsernamePasswordAuthenticationToken newAuthToken = new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                            newAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(newAuthToken);

                            request.setAttribute("jwt", newAccessToken);
                            request = new HttpServletRequestWrapper(request) {
                                @Override
                                public String getHeader(String name) {
                                    if ("Authorization".equals(name)) {
                                        return "Bearer " + newAccessToken;
                                    }
                                    return super.getHeader(name);
                                }
                            };
                        } else {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid refresh token");
                            return;
                        }
                    } else {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Refresh token missing");
                        return;
                    }
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> "refresh_token".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findAny()
                    .orElse(null);
        }
        return null;
    }
}
