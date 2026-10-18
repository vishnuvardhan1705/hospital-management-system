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

import com.hospital.management.dto.FollowUpRequest;
import com.hospital.management.entity.FollowUp;
import com.hospital.management.services.FollowUpService;

@RestController
@RequestMapping("/api/follow-ups")
public class FollowUpController {

	private FollowUpService followUpService;

	public FollowUpController(FollowUpService followUpService) {
		super();
		this.followUpService = followUpService;
	}

    @PostMapping
    public FollowUp createFollowUp(@RequestBody FollowUpRequest request) {

        return followUpService.createFollowUp(request);
    }

    @PutMapping("/{followUpId}")
    public FollowUp updateFollowUp( @PathVariable Long followUpId, @RequestBody FollowUpRequest request) {

        return followUpService.updateFollowUp(followUpId, request);
    }

    @GetMapping("/{followUpId}")
    public FollowUp getFollowUp(@PathVariable Long followUpId) {

        return followUpService.getFollowUp(followUpId);
    }

    @GetMapping("/patient/{patientId}")
    public List<FollowUp> getPatientFollowUps(@PathVariable Long patientId) {

        return followUpService.getFollowUpByPatient(patientId);
    }

    @GetMapping("/upcoming")
    public List<FollowUp> getUpcomingFollowUps() {

        return followUpService.getUpcomingFollowUp();
    }

    @PatchMapping("/{followUpId}/complete")
    public FollowUp completeFollowUp( @PathVariable Long followUpId) {

        return followUpService.completeFollowUp(followUpId);
    }

    @PatchMapping("/{followUpId}/cancel")
    public FollowUp cancelFollowUp(@PathVariable Long followUpId) {

        return followUpService.cancelFollowUp(followUpId);
    }
}
