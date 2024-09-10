/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package bizworks.backend.dtos;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author PC
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchDTO {

  private Date startDate;
  private Date endDate;
  private String leaveType;
  private String employeeName;
  private String status;
}
