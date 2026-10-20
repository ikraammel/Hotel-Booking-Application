package com.ikram.hotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Permet à toutes les routes de l'application d'accepter les requêtes de http://localhost:5173
        registry.addMapping("/**")  // Toutes les routes
                .allowedOrigins("http://localhost:5173")  // Autoriser les requêtes depuis ce frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Méthodes autorisées
                .allowedHeaders("*")  // Autoriser tous les headers
                .allowCredentials(true);  // Si tu utilises des cookies ou des sessions
    }
}
