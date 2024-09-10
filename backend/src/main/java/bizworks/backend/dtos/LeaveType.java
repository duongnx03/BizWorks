/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package bizworks.backend.dtos;

/**
 *
 * @author PC
 */
public enum LeaveType {
    SICK("Sick leave"),
    MATERNITY("Maternity leave"),
    PERSONAL("Personal leave"),
    BEREAVEMENT("Bereavement leave"),
    MARRIAGE("Marriage leave"),
    CIVIC_DUTY("Civic duty leave"),
    OTHER("Other leave");

    private final String description;

    LeaveType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}

