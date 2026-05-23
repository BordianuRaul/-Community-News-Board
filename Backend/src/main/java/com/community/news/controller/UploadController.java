package com.community.news.controller;

import com.community.news.dto.PresignRequest;
import com.community.news.dto.PresignResponse;
import com.community.news.dto.PresignGetRequest;
import com.community.news.service.PresignedUrlService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "*")
public class UploadController {

    private final PresignedUrlService presignedUrlService;

    public UploadController(PresignedUrlService presignedUrlService) {
        this.presignedUrlService = presignedUrlService;
    }

    @PostMapping("/presign")
    @ResponseStatus(HttpStatus.CREATED)
    public PresignResponse createPresignedUrl(@RequestBody PresignRequest request) {
        return presignedUrlService.createUploadUrl(request);
    }

    @PostMapping("/presign-get")
    @ResponseStatus(HttpStatus.CREATED)
    public PresignResponse createPresignedGet(@RequestBody PresignGetRequest request) {
        return presignedUrlService.createDownloadUrl(request.getKey());
    }
}
