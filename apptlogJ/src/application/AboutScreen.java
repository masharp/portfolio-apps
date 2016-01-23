/* This class holds the "About" GUI pane. It is intended to display useful information about the app and it's author
 * 		by Michael Sharp
 * 		www.softwareontheshore.com
 *
 */
package application;

import javafx.geometry.Insets;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

public class AboutScreen {

	//creates the pane and returns it to the called event action
	public static VBox newAboutPane() {
		final VBox aboutPane = new VBox(20);
		final Text aboutText = new Text();
		final String WEB_URL = "https://www.softwareontheshore.com";

		//set contents of large text display
		aboutText.setText("Thank you for using the ApptLog.\n\nWritten by Michael Sharp\n\t" + WEB_URL + 
				"\n\tTwitter: sharp_mi" +
				"\n\tGitHub: masharp\n\nNotes:\n\n" +
				"MIT License (MIT) Copyright (c) 2015 Michael Sharp");

		aboutPane.getChildren().add(aboutText);
		
		aboutPane.setPadding(new Insets(20, 0, 0, 20));

		return aboutPane;
	}
}
