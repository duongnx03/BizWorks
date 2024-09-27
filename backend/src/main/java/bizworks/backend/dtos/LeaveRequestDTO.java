/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package bizworks.backend.dtos;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author PC
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDTO {

  private Long id;
  private Date startDate;
  private Date endDate;
  private String leaveType;
  private String reason;
  private Date createdAt;
  private String status;
  private String leaderStatus;
  private String employeeName;
  private Long employeeId;
}
