package com.propertyrisk.controller;

import com.propertyrisk.model.Report;
import com.propertyrisk.model.RiskAssessment;
import com.propertyrisk.model.SavedProperty;
import com.propertyrisk.service.UserPersistenceService;
import com.propertyrisk.auth.AuthContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserPersistenceController {

    private final UserPersistenceService userPersistenceService;
    private final AuthContext authContext;

    public UserPersistenceController(UserPersistenceService userPersistenceService, AuthContext authContext) {
        this.userPersistenceService = userPersistenceService;
        this.authContext = authContext;
    }

    @GetMapping("/my-risk-assessments")
    public ResponseEntity<List<RiskAssessment>> myRiskAssessments() {
        return ResponseEntity.ok(userPersistenceService.getMyRiskAssessments(currentUserId()));
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<Report>> myReports() {
        return ResponseEntity.ok(userPersistenceService.getMyReports(currentUserId()));
    }

    @GetMapping("/saved-properties")
    public ResponseEntity<List<SavedProperty>> savedProperties() {
        return ResponseEntity.ok(userPersistenceService.getSavedProperties(currentUserId()));
    }

    @PostMapping("/saved-properties")
    public ResponseEntity<SavedProperty> saveProperty(@RequestBody Map<String, Object> payload) {
        SavedProperty saved = userPersistenceService.saveProperty(
                currentUserId(),
                String.valueOf(payload.getOrDefault("address", "")),
                payload.get("riskScore") instanceof Number number ? number.intValue() : null,
                payload.get("notes") != null ? String.valueOf(payload.getOrDefault("notes", "")) : null);
        return ResponseEntity.ok(saved);
    }

    private String currentUserId() {
        var currentUser = authContext.currentUser();
        return currentUser != null ? currentUser.subject() : null;
    }
}
