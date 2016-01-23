package application;

import java.util.Random;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

public class RemoveUserScreen {
	
	static Label errorLabel;
	static Label captchaWordLabel;
	
	static TextField usernameInput;
	static TextField passwordInput;
	static TextField captchaInput;
	
	public static VBox getRemoveUserScreen() {
		final VBox removeUserScreen = new VBox(20);
		
		final HBox usernameHBox = new HBox(30);
		final HBox passwordHBox = new HBox(30);
		final HBox captchaHBox = new HBox(30);
		final HBox confirmHBox =  new HBox(30);
		final HBox buttonsHBox = new HBox(30);
		
		final Label mainLabel = new Label("Please enter your account information and confirm");
		final Label mainNoteLabel = new Label("Note: This action cannot be undone!");
		final Label usernameLabel = new Label("Username: ");
		final Label passwordLabel = new Label("Password:  ");
		final Label captchaLabel = new Label("Confirmation Word:");
		final Label confirmCaptchaLabel = new Label("Validate:    ");
		captchaWordLabel = new Label(generateCaptcha());
		errorLabel = new Label();
		
		usernameInput = new TextField();
		passwordInput = new TextField();
		captchaInput = new TextField();
		
		final Button submitButton = new Button("Submit");
		final Button resetButton = new Button("Reset");
		
		captchaInput.setOnKeyPressed(e -> {
			if (e.getCode().equals(KeyCode.ENTER)) {
				submitRemoveUserForm();
			}
		});
		
		submitButton.setOnAction(e -> {
			submitRemoveUserForm();
		});
		
		resetButton.setOnAction(e -> {
			resetRemoveUserForm();
		});
		
		usernameHBox.getChildren().addAll(usernameLabel, usernameInput);
		passwordHBox.getChildren().addAll(passwordLabel, passwordInput);
		captchaHBox.getChildren().addAll(captchaLabel, captchaWordLabel);
		confirmHBox.getChildren().addAll(confirmCaptchaLabel, captchaInput);
		buttonsHBox.getChildren().addAll(submitButton, resetButton);
		
		removeUserScreen.getChildren().addAll(mainLabel, mainNoteLabel, usernameHBox, passwordHBox, 
				captchaHBox, confirmHBox, buttonsHBox, errorLabel);
		
		errorLabel.setStyle("-fx-text-fill: red");
		mainNoteLabel.setStyle("-fx-text-fill: red");
		captchaWordLabel.setStyle("-fx-text-fill: blue");
		
		usernameInput.requestFocus();	
		removeUserScreen.setPadding(new Insets(50, 0, 0, 65));
		
		Main.clearArray[3] = true;
		
		return removeUserScreen;
	}
	
	public static void resetRemoveUserForm() {
		usernameInput.clear();
		passwordInput.clear();
		captchaInput.clear();
		captchaWordLabel.setText(generateCaptcha());
		errorLabel.setText("");
	}
	
	private static String generateCaptcha() {
		final String PARAM = "ABCDEFGHIJKLMNOPQRZ1234567890";
		Random random = new Random();
		
		StringBuilder captcha = new StringBuilder(6);
		for (int i = 0; i < 6; i++) {
			captcha.append(PARAM.charAt(random.nextInt(PARAM.length())));
		}
		
		return captcha.toString();
	}
	
	private static boolean validateCaptcha(String input, String original) {
		
		if(input.equals(original)) return true;
		else return false;
	}
	
	private static void submitRemoveUserForm() {
		errorLabel.setText("");
		
		String username = usernameInput.getText();
		String password = passwordInput.getText();
		String captcha = captchaInput.getText();
		
		if (validateCaptcha(captcha, captchaWordLabel.getText())) {
			if (Database.checkCredentials(new User(username, password), password)) {
				if(ConfirmBox.getConfirmBoxWindow("Confirm: Are you sure?")) {
					try{
						Database.removeUser(Main.activeUser);
					} catch(Exception ex) {
						ex.printStackTrace();
					}
					SavedLogsScreen.resetTable();
					Main.activeUser = null;
					Main.mainWindow.setTitle("ApptLog Log In");
					Main.mainWindow.setScene(Main.loginScene);
				}
			}
			else {
				errorLabel.setText("Your username and password are incorrect!");
				usernameInput.clear();
				passwordInput.clear();
			}
		} else {
			errorLabel.setText("The validation is incorrect!");
			captchaWordLabel.setText(generateCaptcha());
			captchaInput.clear();
		}
	}
}
