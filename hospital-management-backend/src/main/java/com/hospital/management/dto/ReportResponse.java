package com.hospital.management.dto;

import java.util.LinkedHashMap;
import java.util.Map;

public class ReportResponse {

    private String reportName;
    private Map<String, Object> data = new LinkedHashMap<>();
    
    public ReportResponse() {
    }

    public ReportResponse(String reportName) {
        this.reportName = reportName;
    }
    
	public String getReportName() {
		return reportName;
	}
	public void setReportName(String reportName) {
		this.reportName = reportName;
	}
	public Map<String, Object> getData() {
		return data;
	}
	public void setData(Map<String, Object> data) {
		this.data = data;
	}
    
    public void add(String key, Object value) {
        this.data.put(key, value);
    }
    
}
