/* This class holds the 'New Log' pane. It allows the user to enter information about a specific doctor's visit and save it to their log database.
 * 		by Michael Sharp
 * 		www.softwareontheshore.com
 *
 */
package application;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

public class NewLogScreen {
	
	static TextField dateInput = new TextField();
	static TextField doctorInput = new TextField();
	static TextField specialtyInput = new TextField();
	static TextField locationInput = new TextField();
	static TextArea outcomeInput = new TextArea();

	public static VBox getNewLogScreen() {

		final VBox newLogPane = new VBox(12);
		
		final HBox dateHBox =  new HBox(30);
		final HBox doctorHBox =  new HBox(30);
		final HBox specialtyHBox =  new HBox(30);
		final HBox locationHBox =  new HBox(30);
		final HBox outcomeHBox =  new HBox(30);
		final HBox buttonsHBox =  new HBox(50);
		
		final Label dateLabel = new Label("Date:        ");
		final Label doctorLabel = new Label("Doctor:     ");
		final Label specialtyLabel = new Label("Specialty: ");
		final Label locationLabel = new Label("Location:  ");
		final Label outcomeLabel = new Label("Outcome: ");

		dateInput = new TextField();
		doctorInput = new TextField();
		specialtyInput = new TextField();
		locationInput = new TextField();
		outcomeInput = new TextArea();
		
		final Button saveButton = new Button("Save");
		final Button resetButton = new Button("Reset");
		
		//save button action ---> will launch confirm box and then save to database if confirmed, then reset form
		saveButton.setOnAction(e -> {
			submitNewLogForm();
		});

		//reset button action ---> resets all of the forms to their 'blank' state
		resetButton.setOnAction(e -> {
			resetNewLogForm();
		});

		dateInput.setText(getCurrentDate());
		doctorInput.requestFocus();
		outcomeInput.setPrefSize(300, 130); // H, V
		outcomeInput.setWrapText(true);
		
		dateHBox.getChildren().addAll(dateLabel, dateInput);
		doctorHBox.getChildren().addAll(doctorLabel, doctorInput);
		specialtyHBox.getChildren().addAll(specialtyLabel, specialtyInput);
		locationHBox.getChildren().addAll(locationLabel, locationInput);
		outcomeHBox.getChildren().addAll(outcomeLabel, outcomeInput);
		buttonsHBox.getChildren().addAll(saveButton, resetButton);
	
		newLogPane.getChildren().addAll(dateHBox, doctorHBox, specialtyHBox, locationHBox, outcomeHBox, buttonsHBox);
		
		newLogPane.setPadding(new Insets(25, 0, 0, 35));

		Main.clearArray[1] = true;
		
		return newLogPane;
	}

	public static void saveNewLog(String date, String name, String specialty, String location, String outcome) {
		Log newLog = new Log(Main.activeUser, date, name, specialty, location, outcome);
		
		try {
			Database.writeLog(newLog);
		} catch (Exception ex) {}
	}

	public static void resetNewLogForm() {
		dateInput.setText(getCurrentDate());
		doctorInput.clear();
		specialtyInput.clear();
		locationInput.clear();
		outcomeInput.clear();
	}

	//method that returns the current date ('today')
	public static String getCurrentDate() {
		Calendar date = Calendar.getInstance();
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		String currentDate = formatter.format(date.getTime());
		return currentDate;
	}
	
	private static void submitNewLogForm() {
		if (ConfirmBox.getConfirmBoxWindow("Save your log?")) {
			
			String date = dateInput.getText();
			String name = doctorInput.getText();
			String specialty = specialtyInput.getText();
			String location = locationInput.getText();
			String outcome = outcomeInput.getText();
			
			saveNewLog(date, name, specialty, location, outcome);
			
			resetNewLogForm();
		}
	}
}
