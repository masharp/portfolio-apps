/* This class holds the "ConfirmBox" GUI window. It is intended to display a confirmation box for different user actions.
 * 		by Michael Sharp
 * 		www.softwareontheshore.com
 *
 */
package application;

import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.stage.Modality;
import javafx.stage.Stage;

public class EntryBox {
	static boolean confirmAnswer;

	//method accepts a string title, usually containing the message and returns a boolean
	public static void getEntryBox(String dateTitle, LogRow logEntry) {
		Log tempEntry = new Log(Main.activeUser, logEntry.getDate(), logEntry.getDoctorName(),
				logEntry.getDoctorSpecialty(), logEntry.getDoctorLocation(), logEntry.getOutcome());
		
		Stage entryBoxWindow = new Stage();
		
		VBox entryBoxPane = new VBox(10);
		HBox buttonBoxPane = new HBox(25);
		
		Label dateLabel = new Label("Date: " + logEntry.getDate());
		Label doctorLabel = new Label("Doctor: " + logEntry.getDoctorName());
		Label specialtyLabel = new Label("Specialty: " + logEntry.getDoctorSpecialty());
		Label locationLabel = new Label("Location: " + logEntry.getDoctorLocation());
		
		Text outcomeText = new Text();
		Button confirmButton = new Button("Confirm");
		Button deleteButton = new Button("Delete");

		Scene entryBoxScene = new Scene(entryBoxPane, 400, 300);
		entryBoxScene.getStylesheets().add(("apptlog.css"));
		
		
		//allows user to hit ESC to close window (similar to hitting okayButton
		entryBoxWindow.addEventHandler(KeyEvent.KEY_PRESSED, e -> {
			if (e.getCode().equals(KeyCode.ESCAPE)) {
				entryBoxWindow.close();
				}
				else e.consume();
		});
	
		confirmButton.setOnAction(e -> {
			entryBoxWindow.close();
		});
		
		deleteButton.setOnAction(e -> {
			if(ConfirmBox.getConfirmBoxWindow("Permenantly delete entry?")) {
				try {
					Database.removeEntry(tempEntry);
					SavedLogsScreen.resetTable();
					Main.homePane.setCenter(Main.getCenterNode());
					
				} catch(Exception ex) {}
				entryBoxWindow.close();
			}
		});
		
		buttonBoxPane.getChildren().addAll(confirmButton, deleteButton);
		entryBoxPane.getChildren().addAll(dateLabel, doctorLabel, specialtyLabel, locationLabel, outcomeText, buttonBoxPane);

		entryBoxPane.setPadding(new Insets(10, 0, 0, 10));
		
		outcomeText.setText("Outcome: \n" + logEntry.getOutcome());
		outcomeText.setWrappingWidth(350);
		
		entryBoxScene.getStylesheets().add (Main.class.getResource("application.css").toExternalForm());

		//Blocks events to main stage
		entryBoxWindow.initModality(Modality.APPLICATION_MODAL);
		entryBoxWindow.setTitle(dateTitle);
		
		confirmButton.requestFocus();
		entryBoxWindow.setScene(entryBoxScene);
		entryBoxWindow.setResizable(false);
		entryBoxWindow.centerOnScreen();
		entryBoxWindow.showAndWait();
	}
}
