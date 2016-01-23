package application;

import javafx.beans.property.SimpleStringProperty;

public class LogRow {
	private final SimpleStringProperty date;
	private final SimpleStringProperty doctorName;
	private final SimpleStringProperty doctorSpecialty;
	private final SimpleStringProperty doctorLocation;
	private final SimpleStringProperty outcome;
	
	public LogRow(String sDate, String sName, String sSpecialty, String sLocation, String sOutcome) {
		this.date = new SimpleStringProperty(sDate);
		this.doctorName = new SimpleStringProperty(sName);
		this.doctorSpecialty = new SimpleStringProperty(sSpecialty);
		this.doctorLocation = new SimpleStringProperty(sLocation);
		this.outcome = new SimpleStringProperty(sOutcome);
	}
	public String getDate() {
		return date.get();
	}
	public void setDate(String sDate) {
		date.set(sDate);
	}
	public String getDoctorName() {
		return doctorName.get();
	}
	public void setDoctorName(String sName) {
		doctorName.set(sName);
	}
	public String getDoctorSpecialty() {
		return doctorSpecialty.get();
	}
	public void setDoctorSpecialty(String sSpecialty) {
		doctorSpecialty.set(sSpecialty);
	}
	public String getDoctorLocation() {
		return doctorLocation.get();
	}
	public void setDoctorLocation(String sLocation) {
		doctorLocation.set(sLocation);
	}
	public String getOutcome() {
		return outcome.get();
	}
	public void setOutcome(String sOutcome) {
		outcome.set(sOutcome);
	}
}
