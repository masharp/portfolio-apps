/* This class holds the "ConfirmBox" GUI window. It is intended to display a confirmation box for different user actions.
 * 		by Michael Sharp
 * 		www.softwareontheshore.com
 *
 */
package application;

import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.HBox;
import javafx.stage.Modality;
import javafx.stage.Stage;

public class ConfirmBox {
	static boolean confirmAnswer;

	//method accepts a string title, usually containing the message and returns a boolean
	public static boolean getConfirmBoxWindow(String boxTitle) {
		final Stage confirmBoxWindow = new Stage();
		
		final HBox confirmBoxPane = new HBox(20);
		
		final Button yesButton = new Button("Yes");
		final Button noButton = new Button("No");
		
		Scene confirmBoxScene = new Scene(confirmBoxPane, 250, 75);
	
		//allows user to hit enter key to confirm -- defaults to yesButton
		yesButton.setOnKeyPressed(e -> {
			if (e.getCode().equals(KeyCode.ENTER)) {
				confirmAnswer = true;
				confirmBoxWindow.close();
			}
		});
		
		yesButton.setOnAction(e -> {
			confirmAnswer = true;
			confirmBoxWindow.close();
		});

		noButton.setOnAction(e -> {
			confirmAnswer = false;
			confirmBoxWindow.close();
		});
		
		//allows user to hit esc to return false (similar to hitting noButton
		confirmBoxWindow.addEventHandler(KeyEvent.KEY_PRESSED, e -> {
			if (e.getCode().equals(KeyCode.ESCAPE)) {
				confirmAnswer = false;
				confirmBoxWindow.close();
			}
		});
		
		confirmBoxPane.getChildren().addAll(yesButton, noButton);
		confirmBoxPane.setAlignment(Pos.CENTER);

		yesButton.requestFocus();
		
		confirmBoxScene.getStylesheets().add (Main.class.getResource("application.css").toExternalForm());
	
		//Blocks events to main stage
		confirmBoxWindow.initModality(Modality.APPLICATION_MODAL);
		confirmBoxWindow.setTitle(boxTitle);
		
		confirmBoxWindow.setScene(confirmBoxScene);
		confirmBoxWindow.setResizable(false);
		confirmBoxWindow.centerOnScreen();
		confirmBoxWindow.showAndWait();

		return confirmAnswer;
	}
}
