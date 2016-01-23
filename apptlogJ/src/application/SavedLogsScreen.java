/* This class holds the 'Old Logs' pane. It allows the user to access the database and view old exercise logs.
 * 		by Michael Sharp
 * 		www.softwareontheshore.com
 *
 */
package application;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableRow;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.VBox;

public class SavedLogsScreen {

	static TableView<LogRow> logTable = new TableView<>();
	static ObservableList<LogRow> logData = FXCollections.observableArrayList();

	//method that contains the pane and returns it to the called event
	@SuppressWarnings("unchecked")
	public static VBox getSavedLogsScreen() {
		VBox mainOldLogsPane = new VBox();

		ObservableList<String> oldLogsChoiceCollection = FXCollections.observableArrayList("All", "Doctor", "Specialty", "Location");
		ComboBox<String> oldLogsComboBox = new ComboBox<String>(oldLogsChoiceCollection);

		TableColumn<LogRow, String> dateColumn = new TableColumn<>("Date");
		TableColumn<LogRow, String> doctorColumn = new TableColumn<>("Doctor");
		TableColumn<LogRow, String> specialtyColumn = new TableColumn<>("Specialty");
		TableColumn<LogRow, String> locationColumn = new TableColumn<>("Location");
		
		logTable.setRowFactory(e -> {
			TableRow<LogRow> row = new TableRow<>();
			row.setOnMouseClicked(ev -> {
				if (ev.getClickCount() == 2 && (!row.isEmpty())) {
					LogRow logEntry = row.getItem();
					EntryBox.getEntryBox(logEntry.getDate(), logEntry);
				}
			});
			return row;
		});
		
		dateColumn.setMinWidth(107);
		doctorColumn.setMinWidth(107);
		specialtyColumn.setMinWidth(107);
		locationColumn.setMinWidth(107);
		
		dateColumn.setCellValueFactory(new PropertyValueFactory<LogRow, String>("date"));
		doctorColumn.setCellValueFactory(new PropertyValueFactory<LogRow, String>("doctorName"));
		specialtyColumn.setCellValueFactory(new PropertyValueFactory<LogRow, String>("doctorSpecialty"));
		locationColumn.setCellValueFactory(new PropertyValueFactory<LogRow, String>("doctorLocation"));
		
		logTable.getColumns().addAll(dateColumn, doctorColumn, specialtyColumn, locationColumn);
		logTable.setEditable(false);
		logTable.setMaxSize(460, 325);
		logTable.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
		logTable.setItems(logData);
		
		oldLogsComboBox.setValue("All");
		
		mainOldLogsPane.getChildren().add(logTable);
		mainOldLogsPane.setPadding(new Insets(20, 0, 0, 20));
		
		Main.clearArray[4] = true;
		
		return mainOldLogsPane;
	}
	
	public static void resetTable() {
		logData.clear();
		logTable.setItems(null);
		logTable.getColumns().clear();
		
		try {
			Database.readLogs(Main.activeUser);
			
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
}
