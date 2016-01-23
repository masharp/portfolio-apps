package application;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.control.Tooltip;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

public class NewUserScreen {
	
	static Label usernameErrorLabel;
	
	static TextField newUsernameInput;
	static TextField newPasswordInput;
	static TextField checkPasswordInput;
	
	public static VBox getNewUserScreen() {
		
		final VBox newUserScreen = new VBox(20);
		
		final HBox newUsernameHBox = new HBox(30);
		final HBox newPasswordHBox = new HBox(30);
		final HBox checkPasswordHBox = new HBox(30);
		final HBox userButtonsHBox = new HBox(35);
		
		final Label newLoginLabel = new Label("Please fill out your new login information");
		final Label newUsernameLabel = new Label("Username:");
		final Label newPasswordLabel = new Label("Password: ");
		final Label checkPasswordLabel = new Label("Confirm:    ");
		final Label usernameErrorLabel = new Label();
		
		final Button submitButton = new Button("Submit");
		final Button resetButton = new Button("Reset");
		final Button cancelButton = new Button("Cancel");
		
		final Tooltip passwordTooltip = new Tooltip("Your password must be at least 1 character long!");
		
		newUsernameInput = new TextField();
		newPasswordInput = new TextField();
		checkPasswordInput = new TextField();
		
		//allows user to hit enter on the check password text box
		checkPasswordInput.setOnKeyPressed(e -> {
			if (e.getCode().equals(KeyCode.ENTER)) {
				submitNewUserForm();
			}
		});
		
		submitButton.setOnAction(e -> {
			submitNewUserForm();
		});	
		
		resetButton.setOnAction(e -> {
			resetNewUserForm();
		});
		
		cancelButton.setOnAction(e -> {
			Main.loginPane.setCenter(Main.loginBox);
			Main.mainWindow.setTitle("ApptLog Log In");
		});
		
		newUsernameHBox.getChildren().addAll(newUsernameLabel, newUsernameInput);
		newPasswordHBox.getChildren().addAll(newPasswordLabel, newPasswordInput);
		checkPasswordHBox.getChildren().addAll(checkPasswordLabel, checkPasswordInput);	
		userButtonsHBox.getChildren().addAll(submitButton, resetButton, cancelButton);
		
		newUserScreen.getChildren().addAll(newLoginLabel, newUsernameHBox, newPasswordHBox, checkPasswordHBox,
				userButtonsHBox, usernameErrorLabel);
		
		newUserScreen.setSpacing(15);
		newUserScreen.setPadding(new Insets(60, 0, 0, 45));
		
		usernameErrorLabel.setStyle("-fx-text-fill: red");
		newPasswordInput.setTooltip(passwordTooltip);
		newUsernameInput.requestFocus();
		
		Main.clearArray[2] = true;
		
		return newUserScreen;
	}

	public static void resetNewUserForm() {
		newUsernameInput.clear();
		newPasswordInput.clear();
		checkPasswordInput.clear();
		usernameErrorLabel.setText("");
	}
	
	protected static boolean checkPassword(String password, String passwordCheck) {
		boolean result;
		
		if (password.equals(passwordCheck) && password.length() > 0) {
			result = true;
		} else result = false;
		
		return result;
	}
	
	private static void submitNewUserForm() {
		String username = newUsernameInput.getText();
		String password = newPasswordInput.getText();
		String passwordCheck = checkPasswordInput.getText();
		
		User tempUser = new User(username, password);
		
		try {
			if (checkPassword(password, passwordCheck)) { 
				if (!Database.checkNewUser(tempUser)) {
					if (ConfirmBox.getConfirmBoxWindow("Save New User?")) {
						Database.saveNewUser(tempUser);
						Main.loginPane.setCenter(Main.loginBox);
						Main.mainWindow.setTitle("ApptLog Log In");
					} 
					else {
						resetNewUserForm();
					}
				}
				else {
					usernameErrorLabel.setText("Username already exists!");
					newPasswordInput.clear();
					checkPasswordInput.clear();
				}
			}
			else {
				usernameErrorLabel.setText("Password invalid or does not match!");
				newPasswordInput.clear();
				checkPasswordInput.clear();
			}
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}
}

