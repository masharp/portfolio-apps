package application;

import com.j256.ormlite.dao.ForeignCollection;
import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.field.ForeignCollectionField;
import com.j256.ormlite.table.DatabaseTable;

@DatabaseTable(tableName = "users")
public class User {
	
	public static final String USERNAME_FIELD_NAME = "username";
	public static final String PASSWORD_FIELD_NAME = "password_hash";
	
	@DatabaseField(generatedId = true)
	private int id;
	
	@DatabaseField(columnName = USERNAME_FIELD_NAME, canBeNull = false)
	private String username;
	
	@DatabaseField(columnName = PASSWORD_FIELD_NAME, canBeNull = false)
	private String passwordHash;
	
	@ForeignCollectionField
	private ForeignCollection<Log> logs;
	
	User() {
		//ORMlite persisted classes must define a no-arg constructor with at least package visibility
	}
	
	public User(String sUsername, String sPassword) {
		this.username = sUsername;
		this.passwordHash = Security.hashPassword(sPassword);
	}
	
	public int getId() {
		return id;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String sUsername) {
		this.username = sUsername;
	}
	
	public String getPasswordHash() {
		return passwordHash;
	}
	
	public void setPassword(String sPassword) {
		this.passwordHash = Security.hashPassword(sPassword);
	}
	
	public ForeignCollection<Log> getLogs() {
		return logs;
	}
	
	@Override
	public int hashCode() {
		return username.hashCode();
	}
}
