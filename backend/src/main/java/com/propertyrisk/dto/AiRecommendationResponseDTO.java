package com.propertyrisk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRecommendationResponseDTO {

    private Double latitude;
    private Double longitude;
    private String overallRiskLevel;
    private int averageConfidence;
    private int highRiskCount;
    private List<PredictionItemDTO> predictions;
    private List<String> insights;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PredictionItemDTO {
        private String id;
        private String label;
        private int probability;
        private int confidence;
        private String timeframe;
        private String description;
        private List<Integer> trend;
    }
}
