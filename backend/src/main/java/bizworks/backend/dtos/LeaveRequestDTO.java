/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package bizworks.backend.dtos;

import java.util.Date;
/**
 *
 * @author PC
 */
public class LeaveRequestDTO {
    private Long id;
    private Date startDate;
    private Date endDate;
    private String leaveType;
    private String reason;
    private String status;
    private String employeeName;
     private Long employeeId;

    public LeaveRequestDTO(Long id, Date startDate, Date endDate, String leaveType, String reason, String status, String employeeName, Long employeeId) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.leaveType = leaveType;
        this.reason = reason;
        this.status = status;
        this.employeeName = employeeName;
        this.employeeId = employeeId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }
    
    public String getReason() {
        return reason;
    }

    public void setReson(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    
    public Long getEmployeeId(){
        return employeeId;
    }
    
    public void setEmployeeId(Long employeeId){
        this.employeeId = employeeId;
    }
}
