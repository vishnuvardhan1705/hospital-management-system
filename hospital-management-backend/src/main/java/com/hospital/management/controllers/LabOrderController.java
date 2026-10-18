package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.LabOrderRequest;
import com.hospital.management.entity.LabOrder;
import com.hospital.management.entity.LabOrderItems;
import com.hospital.management.services.LabOrderService;

@RestController
@RequestMapping("/api/lab-orders")
public class LabOrderController {
	
	private LabOrderService labOrderService;

	public LabOrderController(LabOrderService labOrderService) {
		super();
		this.labOrderService = labOrderService;
	}
	
	@PostMapping
	public LabOrder createlabOrder(@RequestBody LabOrderRequest request) {
		
		return labOrderService.createLabOrder(request);
	}
	
	@GetMapping("/{labOrderId}")
	public LabOrder getlabOrder(@PathVariable Long labOrderId) {
		
		return labOrderService.getLabOrder(labOrderId);
	}
	
	@GetMapping("/patient/{patientId}")
	public List<LabOrder> getpatientLabOrder(@PathVariable Long patientId){
		
		return labOrderService.getPatientLabOrder(patientId);
	}
	
	@GetMapping("/consultation/{consultationId}")
	public List<LabOrder> getconsultationOrder(@PathVariable Long consultationId){
		
		return labOrderService.getConsultationOrder(consultationId);
	}

	@PutMapping("{labOrderId}")
	public LabOrder updateOrder(@PathVariable Long labOrderId,@RequestBody LabOrderRequest request){
		
		return labOrderService.updateLabOrder(labOrderId, request);
	}
	
	 @PostMapping("/{labOrderId}/tests/{testId}")
	    public LabOrderItems addTestToOrder(@PathVariable Long labOrderId, @PathVariable Long testId) {

	        return labOrderService.addTestToOrder(labOrderId,testId);
	 }
	 
	 @GetMapping("/{labOrderId}/tests")
	 public List<LabOrderItems> getOrderItems(@PathVariable Long labOrderId) {

	        return labOrderService.getOrderItems(labOrderId);
	 }
}
