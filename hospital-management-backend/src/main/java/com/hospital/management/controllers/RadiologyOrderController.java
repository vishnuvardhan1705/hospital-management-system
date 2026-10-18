package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.RadiologyOrderRequest;
import com.hospital.management.entity.RadiologyOrder;
import com.hospital.management.services.RadiologyOrderService;

@RestController
@RequestMapping("/api/radiology-orders")
public class RadiologyOrderController {
	
	private RadiologyOrderService orderService;

	public RadiologyOrderController(RadiologyOrderService orderService) {
		super();
		this.orderService = orderService;
	}

	@PostMapping
	public RadiologyOrder createOrder(@RequestBody RadiologyOrderRequest request) {
		
		return orderService.createRadiologyOrder(request);
	}
	
	@GetMapping("/{radiologyOrderId}")
	public RadiologyOrder getOrder(@PathVariable Long radiologyOrderId) {
		
		return orderService.getRadiologyOrder(radiologyOrderId);
	}
	
	@GetMapping("/patient/{patientId}")
	public List<RadiologyOrder> getOrderBypatient(@PathVariable Long patientId) {
		
		return orderService.getOrderByPatient(patientId);
	}
	
	@GetMapping("/doctor/{doctorId}")
	public List<RadiologyOrder> getOrderBydoctor(@PathVariable Long doctorId){
		
		return orderService.getOrderByDoctor(doctorId);
	}
	
	@GetMapping("/consultation/{consultationId}")
	public List<RadiologyOrder> getOrderByconsultation(@PathVariable Long consultationId){
		
		return orderService.getOrderByConsultation(consultationId);
	}
	
	@PutMapping("/{orderId}")
	public RadiologyOrder updateOrder(@PathVariable Long orderId, @RequestBody RadiologyOrderRequest request) {
		
		return orderService.updateRadiologyOrder(orderId, request);
	}
	
	@PatchMapping("/{orderId}/schedule")
	public RadiologyOrder sheduleorder(@PathVariable Long orderId) {
		
		return orderService.sheduleRadiology(orderId);
	}
}
