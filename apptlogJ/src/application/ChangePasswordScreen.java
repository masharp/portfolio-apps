package application;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

public class ChangePasswordScreen {
	
	static Label errorLabel;
	
	static TextField newPasswordInput;
	static TextField checkPasswordInput;
	
	public static VBox getChangePasswordScreen() {
		final VBox changePasswordScreen = new VBox(20);
		final HBox newPasswordHBox = new HBox(30);
		final HBox checkPasswordHBox = new HBox(30);
		final HBox buttonsHBox = new HBox(40);
		
		final Label mainChangePasswordLabel = new Label("Please enter your new password");
		final Label mainNoteLabel = new Label("Note: This action cannot be undone!");
		final Label newPasswordLabel = new Label("New Password:      ");
		final Label checkPasswordLabel = new Label("Confirm Password:");
		errorLabel = new Label();
		
		newPasswordInput = new TextField();
		checkPasswordInput = new TextField();
		
		final Button submitButton = new Button("Submit");
		final Button resetButton = new Button("Reset");
		
		//allows user to hit enter to submit form
		checkPasswordInput.setOnKeyPressed(e -> {
			if (e.getCode().equals(KeyCode.ENTER)) {
				submitChangePasswordForm();
			}
		});
		
		//allows user to hit enter to submit form
		newPasswordInput.setOnKeyPressed(e -> {
			if (e.getCode().equals(KeyCode.ENTER)) {
				submitChangePasswordForm();
			}
		});
		
		submitButton.setOnAction(e -> {
			submitChangePasswordForm();
		});
		
		resetButton.setOnAction(e -> {
			resetChangePasswordForm();
		});

		errorLabel.setStyle("-fx-text-fill: red");
		mainNoteLabel.setStyle("-fx-text-fill: red");
		
		newPasswordInput.requestFocus();
		
		newPasswordHBox.getChildren().addAll(newPasswordLabel, newPasswordInput);
		checkPasswordHBox.getChildren().addAll(checkPasswordLabel, checkPasswordInput);
		buttonsHBox.getChildren().addAll(submitButton, resetButton);
		
		changePasswordScreen.getChildren().addAll(mainChangePasswordLabel, mainNoteLabel, newPasswordHBox, 
									checkPasswordHBox, buttonsHBox, errorLabel);

		changePasswordScreen.setPadding(new Insets(70, 0, 0, 70));
		
		Main.clearArray[0] = true;
		
		return changePasswordScreen;
	}

	public static void resetChangePasswordForm() {
		newPasswordInput.clear();
		checkPasswordInput.clear();
		errorLabel.setText("");
	}
	
	private static void submitChangePasswordForm() {
		errorLabel.setText("");

		String newPassword = newPasswordInput.getText();
		String checkPassword = checkPasswordInput.getText();
		
		if (NewUserScreen.checkPassword(newPassword, checkPassword)) {
			if (ConfirmBox.getConfirmBoxWindow("Save New Password?")){
				Database.changePassword(newPassword);
				errorLabel.setText("Done!");
			}
		} else {
			errorLabel.setText("The new passwords you entered do not match!");
			newPasswordInput.clear();
			checkPasswordInput.clear();
		}
	}
}
