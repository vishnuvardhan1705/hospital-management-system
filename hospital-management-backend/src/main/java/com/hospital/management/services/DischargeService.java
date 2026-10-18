package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.DischargeMedicationRequest;
import com.hospital.management.dto.DischargeRequest;
import com.hospital.management.entity.Discharge;
import com.hospital.management.entity.DischargeMedication;

public interface DischargeService {
	
	public Discharge createDischarge(DischargeRequest request);
	public Discharge getDischarge(Long dischargeId);
	public List<Discharge> getDischargeByPatient(Long patientId);
	
	public DischargeMedication addDischargeMedication(Long dischargeId, DischargeMedicationRequest request);
	public List<DischargeMedication> getDischargeMedication(Long dischargeId);
	public Discharge completeDischarge(Long dischargeId);

}
