package com.hospital.management.dto;

public class RoomRequest {

    private Long wardId;
    private String roomNumber;
    private String roomType;
    private String floor;
    private Double dailyCharge;
    private String status;
    
	public Long getWardId() {
		return wardId;
	}
	public void setWardId(Long wardId) {
		this.wardId = wardId;
	}
	public String getRoomNumber() {
		return roomNumber;
	}
	public void setRoomNumber(String roomNumber) {
		this.roomNumber = roomNumber;
	}
	public String getRoomType() {
		return roomType;
	}
	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}
	public String getFloor() {
		return floor;
	}
	public void setFloor(String floor) {
		this.floor = floor;
	}
	public Double getDailyCharge() {
		return dailyCharge;
	}
	public void setDailyCharge(Double dailyCharge) {
		this.dailyCharge = dailyCharge;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
    

}
