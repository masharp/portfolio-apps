package application;

import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.table.DatabaseTable;

@DatabaseTable(tableName = "logs")
public class Log {
	
	public static final String USER_ID_FIELD_NAME = "user_id";
	public static final String DATE_FIELD_NAME = "date";
	public static final String DOCTOR_FIELD_NAME = "doctor_name";
	public static final String SPECIALTY_FIELD_NAME = "doctor_specialty";
	public static final String LOCATION_FIELD_NAME = "doctor_location";	
	public static final String OUTCOME_FIELD_NAME = "outcome";
	
	@DatabaseField(generatedId = true)
	private int id;
	
	@DatabaseField(foreign = true, columnName = USER_ID_FIELD_NAME)
	private User user;
	
	@DatabaseField(columnName = DATE_FIELD_NAME, canBeNull = false)
	private String date;
	
	
	@DatabaseField(columnName = DOCTOR_FIELD_NAME)
	private String doctorName;
	
	
	@DatabaseField(columnName = SPECIALTY_FIELD_NAME)
	private String doctorSpecialty;
	

	@DatabaseField(columnName = LOCATION_FIELD_NAME)
	private String doctorLocation;
	
	
	@DatabaseField(columnName = OUTCOME_FIELD_NAME)
	private String outcome;
	
	Log() {
		//ORMlite persisted classes must define a no-arg constructor with at least package visibility
	}
	
	public Log(User uUser, String sDate, String sName, String sSpecialty, String sLocation, String sOutcome) {
		
		this.user = uUser;
		this.date = sDate;
		this.doctorName = sName;
		this.doctorSpecialty = sSpecialty;
		this.doctorLocation = sLocation;
		this.outcome = sOutcome;
	}
	public int getId() {
		return id;
	}
	public User getUser() {
		return user;
	}

	public void setUser(User uUser) {
		this.user = uUser;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String sDate) {
		this.date = sDate;
	}

	public String getDoctorName() {
		return doctorName;
	}

	public void setDoctorName(String sName) {
		this.doctorName= sName;
	}

	public String getDoctorSpecialty() {
		return doctorSpecialty;
	}

	public void setDoctorSpecialty(String sSpecialty) {
		this.doctorSpecialty = sSpecialty;
	}

	public String getDoctorLocation() {
		return doctorLocation;
	}

	public void setDoctorLocation(String sLocation) {
		this.doctorLocation = sLocation;
	}

	public String getOutcome() {
		return outcome;
	}

	public void setOutcome(String sOutcome) {
		this.outcome = sOutcome;
	}	
}
