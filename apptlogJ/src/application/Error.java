package application;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.table.DatabaseTable;

@DatabaseTable(tableName = "errors")
public class Error {
	
	public static final String DATE_FIELD_NAME = "date";
	public static final String USER_FIELD_NAME = "user";
	public static final String TRACE_FIELD_NAME = "print_trace";
	
	@DatabaseField(columnName = DATE_FIELD_NAME, canBeNull = false)
	private String date;
	
	@DatabaseField(columnName = USER_FIELD_NAME)
	private String user;
	
	@DatabaseField(columnName = TRACE_FIELD_NAME, canBeNull = false)
	private String printTrace;
	
	Error() {
		//ORMlite persisted classes must define a no-arg constructor with at least package visibility
	}
	
	public Error(String sDate, String sUser, String sPrintTrace) {
		this.date = sDate;
		this.user = sUser;
		this.printTrace = sPrintTrace;
	}
	
	public String getDate() {
		return date;
	}
	
	public void setDate(String sDate) {
		this.date = sDate;
	}
	
	public String getUser() {
		return user;
	}
	
	public void setUser(String sUser) {
		this.user = sUser;
	}
	
	public String getPrintTrace() {
		return printTrace;
	}
	
	public void setPrintTrace(String sPrintTrace) {
		this.printTrace = sPrintTrace;
	}
	
	//turns an exception's print stack trace into a usable string
	public static String exceptionTraceToString(Exception ex) {
		ByteArrayOutputStream byteArrayStream = new ByteArrayOutputStream();
		PrintStream printStream = new PrintStream(byteArrayStream);
		
		ex.printStackTrace(printStream);
		printStream.close();
		
		return byteArrayStream.toString();
	}
}
