package com.community.news.controller;

import com.community.news.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/news") // <--- Verifică dacă ai exact asta
public class NewsController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload") // <--- Și asta
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println("DEBUG: Am primit cererea pentru fișierul: " + file.getOriginalFilename());
        try {
            fileStorageService.save(file);
            return "Fișierul " + file.getOriginalFilename() + " a fost salvat cu succes!";
        } catch (Exception e) {
            e.printStackTrace(); 
            return "Eroare: " + e.getMessage();
        }
    }
}