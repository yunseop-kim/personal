import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.events.MouseAdapter;
import org.eclipse.swt.events.MouseEvent;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableItem;


public class AddFavorite {

	private Shell shell;
	private Table table;
	private Connection connect;
	private Statement statement;
	
	private Label label_SingNum;
	private Label label_Title;
	private Label label_Classify;
	private Label label_Word;

	private StyledText text_Lyrics;
	
	AddFavorite(
				Shell shell,			Table table,
				Label label_SingNum,	Label label_Title,
				Label label_Classify,	Label label_Word,
				StyledText text_Lyrics)
			{
		this.table = table;
		this.label_SingNum = label_SingNum;
		this.label_Title = label_Title;
		this.label_Classify = label_Classify;
		this.label_Word = label_Word;
		this.text_Lyrics = text_Lyrics;
		this.shell = shell;
		this.AddBtn();
			}
	
	void AddBtn(){
		Button btnAddFavorite = new Button(shell, SWT.NONE);
		btnAddFavorite.setText("\uC990\uACA8\uCC3E\uAE30 \uCD94\uAC00");
		btnAddFavorite.setBounds(540, 416, 88, 36);
		btnAddFavorite.addMouseListener(new MouseAdapter() {
			@Override
			public void mouseUp(MouseEvent e) {
				try {
					String drive = "sun.jdbc.odbc.JdbcOdbcDriver"; 
					String url = "jdbc:odbc:MS Access Database;DBQ=./chansong2.mdb"; 
					Class.forName(drive);
					connect = DriverManager.getConnection(url);
					System.out.println("Connecting succesfully");
					statement = connect.createStatement();
					if(label_SingNum.getText() != null){
						statement.executeUpdate(
								"insert into Favorite (SNGNAME, SNGNUM, SNGWORD, RELWORD, SNGCAT) values ('" + 
						label_Title.getText() + "','" + label_SingNum.getText() + "','" + 
						text_Lyrics.getText() + "','" + label_Word.getText() + "','" + label_Classify.getText() + "');");
						
						TableItem item = new TableItem(table, SWT.NONE);
						item.setText(new String[]{label_SingNum.getText(), label_Title.getText(), label_Classify.getText()});
						
						MessageBox mb = new MessageBox(shell);
						mb.setText("안내");
						mb.setMessage("즐겨찾기에 추가되었습니다.");
						mb.open();
					}
					else
						return;
				} catch (SQLException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}catch (Exception ex){
					
				}
			}
		});
	}
}
