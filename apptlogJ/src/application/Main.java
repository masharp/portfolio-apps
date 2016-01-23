/* This is the ApptLog application, written in Java, primarily with the JavaFX framework. It is a simple program that allows
 * a user to track individual doctor's visit information which are saved in an embedded database for future reference.
 *
 * This is the main class that contains the main method and launches the application. Also contains the characteristics of the application and
 * the menu bar.
 *
 * 		by Michael Sharp
 * 		www.softwareontheshore.com
 *
 */

package application;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class Main extends Application {
	static User activeUser =  null;
	
	//work around for ensuring the clear form method does not have any null values
	static boolean[] clearArray = new boolean[5];
	
	static Stage mainWindow;
	
	static BorderPane homePane;
	static BorderPane loginPane;
	
	static VBox loginBox;
	
	static Scene mainScene;
	static Scene loginScene;
	
	static Label errorLabel;
	static TextField usernameInput;
	static TextField passwordInput;
	
	//main method, launches application and embedded database
	public static void main(String[] args) {
		Database.startDatabase();
		launch(args);
	}

	@Override
	public void start(Stage primaryStage) throws Exception {
		
		mainWindow = primaryStage;
		
		homePane =  new BorderPane();
		loginPane = new BorderPane();
		
		loginBox = new VBox(20);
		final HBox usernameHBox = new HBox(30);
		final HBox passwordHBox = new HBox(30);
		final HBox loginButtonsHBox = new HBox(30);
		
		final Label loginLabel = new Label("Welcome to your ApptLog!");
		final Label usernameLabel = new Label("Username:");
		final Label passwordLabel = new Label("Password: ");
		errorLabel = new Label();
		
		final Button loginButton = new Button("Log In");
		final Button newButton = new Button("New User");
		
		usernameInput = new TextField();
		passwordInput = new TextField();

		final MenuBar mainMenuBar = new MenuBar();
		final Menu menuFile = new Menu("File");
		final Menu menuUser = new Menu("User");
		final Menu menuLogs = new Menu("Logs");
		

		final MenuItem fileExit = new MenuItem("Exit");
		final MenuItem fileAbout = new MenuItem("About");
		final MenuItem fileLogout = new MenuItem("Logout");

		final MenuItem userChangePassword = new MenuItem("Change Password");
		final MenuItem userRemove = new MenuItem("Remove Account");
		
		final MenuItem logsNew = new MenuItem("New Log");
		final MenuItem logsSaved = new MenuItem("Saved Logs");
		
		mainScene = new Scene(homePane, 500, 400);
		loginScene = new Scene(loginPane, 400, 300);
		
		//allow user to hit ENTER key instead of clicking login button
		usernameInput.setOnKeyPressed(e -> {
			if (e.getCode().equals(KeyCode.ENTER)) {
				submitLoginForm();
			}
		});
		
		//allow user to hit ENTER key instead of clicking login button
		passwordInput.setOnKeyPressed(e -> {
			if (e.getCode().equals(KeyCode.ENTER)) {
				submitLoginForm();
			}
		});
		
		loginButton.setOnAction(e -> {
			submitLoginForm();
		});
		
		//takes user to new user registration window
		newButton.setOnAction(e -> {
			mainWindow.setTitle("ApptLog New User Registration");
			usernameInput.clear();
			passwordInput.clear();
			errorLabel.setText("");
			loginPane.setCenter(NewUserScreen.getNewUserScreen());
		});

		// MENU BAR ACTIONS-----------------------
		fileLogout.setOnAction(e -> {
			resetApplicationFields();
		});
		
		fileExit.setOnAction(e -> {
			if (ConfirmBox.getConfirmBoxWindow("Are you sure?")) {
				mainWindow.close();
			}
			else e.consume();
		});
		
		fileAbout.setOnAction(e -> {
			SavedLogsScreen.resetTable();
			homePane.setCenter(AboutScreen.newAboutPane());
		});
		
		userChangePassword.setOnAction(e -> {
			SavedLogsScreen.resetTable();
			homePane.setCenter(ChangePasswordScreen.getChangePasswordScreen());
		});
		
		userRemove.setOnAction(e -> {
			SavedLogsScreen.resetTable();
			homePane.setCenter(RemoveUserScreen.getRemoveUserScreen());
		});
		
		logsNew.setOnAction(e -> {
			SavedLogsScreen.resetTable();
			homePane.setCenter(NewLogScreen.getNewLogScreen());
		});
		
		logsSaved.setOnAction(e -> {
			SavedLogsScreen.resetTable();
			homePane.setCenter(SavedLogsScreen.getSavedLogsScreen());
		});
		//END OF MENU BAR ACTIONS------------------------

		//sets the window's close operation with a confirm box
		mainWindow.setOnCloseRequest(e -> {
			if (ConfirmBox.getConfirmBoxWindow("Are you sure?")) {
				mainWindow.close();
			}
			//ignores the event handler
			else e.consume();
		});
		
		//allow user to hit ESC key to close program
		mainWindow.addEventHandler(KeyEvent.KEY_PRESSED, e -> {
			if (e.getCode().equals(KeyCode.ESCAPE)) {
				if (ConfirmBox.getConfirmBoxWindow("Are you sure?")) {
					mainWindow.close();
				}
				//ignores the event handler
				else e.consume();
			}
		});
					
		usernameHBox.getChildren().addAll(usernameLabel, usernameInput);
		passwordHBox.getChildren().addAll(passwordLabel, passwordInput);
		loginButtonsHBox.getChildren().addAll(loginButton, newButton);
	
		menuFile.getItems().addAll( fileAbout, fileLogout, fileExit);
		menuUser.getItems().addAll(userChangePassword, userRemove);
		menuLogs.getItems().addAll(logsNew, logsSaved);
		mainMenuBar.getMenus().addAll(menuFile, menuUser, menuLogs);
		
		loginBox.getChildren().addAll(loginLabel, usernameHBox, passwordHBox, loginButtonsHBox, errorLabel);
		loginBox.setPadding(new Insets(65, 0, 0, 50));

		loginPane.setCenter(loginBox);
		
		homePane.setTop(mainMenuBar);
		homePane.setCenter(NewLogScreen.getNewLogScreen());
		
		errorLabel.setStyle("-fx-text-fill: red");
		
		mainScene.getStylesheets().add (Main.class.getResource("application.css").toExternalForm());
		loginScene.getStylesheets().add (Main.class.getResource("application.css").toExternalForm());
		
		mainWindow.setTitle("ApptLog Log In");
		mainWindow.setScene(loginScene);
		mainWindow.setResizable(false);
		mainWindow.centerOnScreen();
		mainWindow.show();
	}
	
	//helper method to update the OutputScreen table after the EntryBox delete button method is called
	protected static Node getCenterNode() {
		return SavedLogsScreen.getSavedLogsScreen();
	}
	
	private static void submitLoginForm() {
		String username = usernameInput.getText();
		String password = passwordInput.getText();
		
		User tempUser = new User(username, password);
		
		errorLabel.setText("");
		
		try {
			if (Database.checkCredentials(tempUser, password)) {
				usernameInput.clear();
				passwordInput.clear();
				
				activeUser = Database.getActiveUser(tempUser);
				Database.readLogs(activeUser);
				
				mainWindow.setTitle("ApptLog");
				mainWindow.setScene(mainScene);
			}
			else  {
				errorLabel.setText("Please enter the correct login information!");
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
	
	private static void resetApplicationFields() {
		if (clearArray[0] == true) {
			ChangePasswordScreen.resetChangePasswordForm();
		} if (clearArray[1] == true ){
			NewLogScreen.resetNewLogForm();
		} if (clearArray[2] == true) {
			NewUserScreen.resetNewUserForm();
		} if (clearArray[3] == true) {
			RemoveUserScreen.resetRemoveUserForm();
		} if (clearArray[4] == true) {
			SavedLogsScreen.resetTable();
		}
		
		activeUser = null;
		mainWindow.setTitle("ApptLog Log In");
		mainWindow.setScene(loginScene);
	}
}
