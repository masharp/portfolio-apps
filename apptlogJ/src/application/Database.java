package application;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.List;
import java.util.Properties;

import org.h2.jdbcx.JdbcDataSource;

import com.j256.ormlite.dao.CloseableIterator;
import com.j256.ormlite.dao.Dao;
import com.j256.ormlite.dao.DaoManager;
import com.j256.ormlite.dao.ForeignCollection;
import com.j256.ormlite.jdbc.DataSourceConnectionSource;
import com.j256.ormlite.stmt.DeleteBuilder;
import com.j256.ormlite.stmt.QueryBuilder;
import com.j256.ormlite.support.ConnectionSource;
import com.j256.ormlite.table.TableUtils;


public class Database {
	private static String DB_DRIVER;
	private static String DB_URL;
	private static String DB_USER;
	private static String DB_PASSWORDS;
	
	private static JdbcDataSource dataSource = new JdbcDataSource();
	private static ConnectionSource connectionSource = null;
	
	private static Dao<Log, Integer> logDao;	
	private static Dao<User, Integer> userDao;
	private static Dao<Error, Integer> errorDao;
	
	public static void startDatabase()  {
		getPropertyValues();
		
		dataSource.setURL(DB_URL);
		dataSource.setUser(DB_USER);
		dataSource.setPassword(DB_PASSWORDS);
		
		try {
			Class.forName(DB_DRIVER);
			connectionSource = new DataSourceConnectionSource(dataSource, DB_URL);
			
			logDao = DaoManager.createDao(connectionSource, Log.class);
			userDao = DaoManager.createDao(connectionSource, User.class);
			errorDao = DaoManager.createDao(connectionSource, Error.class);
			
			//TableUtils.dropTable(connectionSource, Log.class, true);
			//TableUtils.dropTable(connectionSource, User.class, true);
			//TableUtils.dropTable(connectionSource, Error.class, true);
			
			TableUtils.createTableIfNotExists(connectionSource, Log.class);
			TableUtils.createTableIfNotExists(connectionSource, User.class);
			TableUtils.createTableIfNotExists(connectionSource, Error.class);
			
		} catch(Exception ex) {
			//saveNewError(new Error(NewLogScreen.getCurrentDate(), Main.activeUser.getUsername(), Error.exceptionTraceToString(ex)));
			
		} finally {
			if (connectionSource != null) {
				try {
					connectionSource.close();
				} catch (SQLException ex) {
					saveNewError(new Error(NewLogScreen.getCurrentDate(), Main.activeUser.getUsername(), Error.exceptionTraceToString(ex)));
				}
			}
		}
	}
	
	protected static void readLogs(User activeUser) throws Exception {
		ForeignCollection<Log> logs = activeUser.getLogs();
		CloseableIterator<Log> logIterator = logs.closeableIterator(); 
		
		if (logIterator.hasNext()) {
			for (Log log : logs) {
				log = logIterator.next();
				
				LogRow logRowEntry = new LogRow(log.getDate(), log.getDoctorName(), log.getDoctorSpecialty(), log.getDoctorLocation(),
										log.getOutcome());
				
				SavedLogsScreen.logData.add(logRowEntry);
			}
		}
		logIterator.close();	
	}
	
	protected static void writeLog(Log newLog) {
		try {
			logDao.create(newLog);
		} catch (Exception ex) {
			//saveNewError(new Error(NewLogScreen.getCurrentDate(), Main.activeUser.getUsername(), Error.exceptionTraceToString(ex)));
		}
	}
	
	protected static boolean checkNewUser(User activeUser) {
		QueryBuilder<User, Integer> statementBuilder = userDao.queryBuilder();
		List<User> users;
		String user = activeUser.getUsername();
		
		try {
			statementBuilder.where().eq(User.USERNAME_FIELD_NAME, user);
			users = userDao.query(statementBuilder.prepare());
			
			if (users.contains(user)) {
				users.clear();
				return true;
			}
			
			else {
				users.clear();
				return false;
			}
		} catch (Exception ex) {
			//saveNewError(new Error(NewLogScreen.getCurrentDate(), Main.activeUser.getUsername(), Error.exceptionTraceToString(ex)));
		}
		return false;
	}
	
	protected static void saveNewUser(User newUser) {
		try {
			userDao.create(newUser);
		} catch (Exception ex) {
			//saveNewError(new Error(NewLogScreen.getCurrentDate(), Main.activeUser.getUsername(), Error.exceptionTraceToString(ex)));
		}
	}
	
	protected static void removeEntry(Log entry) throws SQLException, Exception {
		DeleteBuilder<Log, Integer> deleteBuilder = logDao.deleteBuilder();
		deleteBuilder.where().eq(Log.DATE_FIELD_NAME, entry.getDate()).and().eq(
									Log.DOCTOR_FIELD_NAME, entry.getDoctorName()).and().eq(
									Log.SPECIALTY_FIELD_NAME, entry.getDoctorSpecialty()).and().eq(
									Log.LOCATION_FIELD_NAME, entry.getDoctorLocation()).and().eq(
									Log.OUTCOME_FIELD_NAME, entry.getOutcome()).and().eq(
									Log.USER_ID_FIELD_NAME, entry.getUser());
		
		logDao.delete(deleteBuilder.prepare());
	}
	
	protected static boolean checkCredentials(User tempUser, String tempPassword) {
		String user = tempUser.getUsername();
		String password = "";
		QueryBuilder<User, Integer> statementBuilder = userDao.queryBuilder();
		List<User> users;
		
		if (Security.isPasswordCorrect(tempUser.getPasswordHash(), tempPassword)) {
			password = tempUser.getPasswordHash();
		}
		
		try {
			statementBuilder.where().eq(User.USERNAME_FIELD_NAME, user).and()
			.eq(User.PASSWORD_FIELD_NAME, password);
		
			users = userDao.query(statementBuilder.prepare());
			
			if (users.isEmpty()) return false;
		} catch (Exception ex) {
			//saveNewError(new Error(NewLogScreen.getCurrentDate(), Main.activeUser.getUsername(), Error.exceptionTraceToString(ex)));
		}
		return true;
	}
	
	protected static User getActiveUser(User tempUser) {
		String user = tempUser.getUsername();
		QueryBuilder<User, Integer> statementBuilder = userDao.queryBuilder();
		User activeUser = null;
		
		try {

			statementBuilder.where().eq(User.USERNAME_FIELD_NAME, user);
			activeUser = userDao.queryForFirst(statementBuilder.prepare());
			return activeUser;
		} catch (Exception ex) {
			//saveNewError(new Error(NewLogScreen.getCurrentDate(), Main.activeUser.getUsername(), Error.exceptionTraceToString(ex)));
		}
		return activeUser;
	}
	
	protected static void changePassword(String newPassword) {
		Main.activeUser.setPassword(newPassword);
		
		try {
			userDao.update(Main.activeUser);
		} catch (Exception ex) {
			//saveNewError(new Error(NewLogScreen.getCurrentDate(), Main.activeUser.getUsername(), Error.exceptionTraceToString(ex)));
		}
	}
	
	protected static void removeUser(User activeUser) throws Exception {
		ForeignCollection<Log> logs = activeUser.getLogs();
		CloseableIterator<Log> logIterator = logs.closeableIterator(); 
		
		if (logIterator.hasNext()) {
			for (Log log : logs) {
				
				log = logIterator.next();
				logDao.delete(log);
			}
		}
		logIterator.close();
		
		userDao.delete(activeUser);
	}
	
	protected static void saveNewError(Error newError) {
		try {
			errorDao.create(newError);
		} catch (Exception ex) {
			//saveNewError(new Error(NewLogScreen.getCurrentDate(), Main.activeUser.getUsername(), Error.exceptionTraceToString(ex)));
		}
	}
	
	private static void getPropertyValues() {
		Properties properties = new Properties();
	    InputStream inStream = null;
	    
	    try {
	        File file = new File("server.properties");
	        inStream = new FileInputStream(file);
	    }
	    catch (Exception ex) { 
	    	inStream = null; 
	    }
	 
	    try {
	        if (inStream == null) {
	            inStream = Database.class.getClassLoader().
	    				getResourceAsStream("apptlogDB.properties");
	        }
	        properties.load(inStream);
	    }
	    catch (Exception ex) { }
	    
	    DB_DRIVER = properties.getProperty("driver");
	    DB_URL = properties.getProperty("url");
	    DB_USER  = properties.getProperty("user");
		DB_PASSWORDS = properties.getProperty("passwords");
	}
}
