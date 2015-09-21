import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.events.MouseAdapter;
import org.eclipse.swt.events.MouseEvent;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.TabFolder;
import org.eclipse.swt.widgets.TabItem;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
import org.eclipse.swt.widgets.TableItem;


public class TableClass {
	private Shell shell;
	private Table table;
	private Connection connect;
	private Statement statement;
	private ResultSet resultSet;
	
	private TabFolder tabFolder;
	private TabItem tabItem;
	
	private Label label_SingNum;
	private Label label_Title;
	private Label label_Classify;
	private Label label_Word;
	
	private Button btnPlay;
	
	private String StrTable;
	private StyledText text_Lyrics;
	
	TableClass(
			String StrTable,			Shell shell,
			TabFolder tabFolder, 	TabItem tabItem, 
			Table table, 			Label label_SingNum, 
			Label label_Title, 		Label label_Classify, 
			Label label_Word, 		StyledText text_Lyrics)
			{
		this.tabFolder = tabFolder;
		this.tabItem = tabItem;
		this.table = table;
		this.label_SingNum = label_SingNum;
		this.label_Title = label_Title;
		this.label_Classify = label_Classify;
		this.label_Word = label_Word;
		this.text_Lyrics = text_Lyrics;
		this.StrTable = StrTable;
		this.shell = shell;
		this.CreateTable();
			}
	
	void CreateTable(){
		table = new Table(tabFolder, SWT.BORDER | SWT.FULL_SELECTION | SWT.VIRTUAL);
		table.setToolTipText("");
		tabItem.setControl(table);
		table.setHeaderVisible(true);
		table.setItemCount(1);
		table.addListener(SWT.SetData, new Listener() {
			public void handleEvent(Event event) {
				String drive = "sun.jdbc.odbc.JdbcOdbcDriver"; 
				String url = "jdbc:odbc:MS Access Database;DBQ=./chansong2.mdb"; 
				
				try{ 
					Class.forName(drive);
					connect = DriverManager.getConnection(url);
					System.out.println("Connecting succesfully");
					statement = connect.createStatement();
					resultSet = statement.executeQuery("Select * from " + StrTable);
					while(resultSet.next()){
						TableItem item = new TableItem(table, SWT.NONE);
						item.setText(new String[]{resultSet.getString(2),resultSet.getString(1),resultSet.getString(9)});
					}
					
					}catch(Exception e){
						System.out.println("Cannot connect to database server");
					}
				}
			});
		
		table.addListener(SWT.DefaultSelection, new Listener() {
		      public void handleEvent(Event e) {
		    	String strSingNum = null;
		        String strTitle = null;
		        String strClassify = null;
		        String strLyrics = null;
		        String strWord = null;
		        		        
		        TableItem[] items = table.getItems();
		        items = table.getSelection();
		        //System.out.println("");
		        
		        for(int i=0; i<items.length; i++) {
		        	strSingNum = items[i].getText(0);  //this text is empty
		        	strTitle = items[i].getText(1);
		        	strClassify = items[i].getText(2);
		        }
		        
		        try {
					resultSet = statement.executeQuery("Select * from " + StrTable + " where SNGNAME = '"+ strTitle + "';");
					while(resultSet.next()){
						strWord = resultSet.getString(6);
						strLyrics = resultSet.getString(4);
					}
				} catch (SQLException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
		        if(strWord == null)	return;
		        label_Word.setText(strWord);
		        text_Lyrics.setText(strLyrics);
		        label_SingNum.setText(strSingNum);
		        label_Title.setText(strTitle);
		        label_Classify.setText(strClassify);
		      }
		    });
		
		TableColumn Column_HymnNum = new TableColumn(table, SWT.CENTER);
		Column_HymnNum.setWidth(50);
		Column_HymnNum.setText("\uC7A5");
		
		TableColumn Column_HymnTitle = new TableColumn(table, SWT.CENTER);
		Column_HymnTitle.setWidth(175);
		Column_HymnTitle.setText("\uC81C\uBAA9");
		
		TableColumn Column_Classify = new TableColumn(table, SWT.CENTER);
		Column_Classify.setWidth(100);
		Column_Classify.setText("\uBD84\uB958");
		
		TableSorting HymnSort = new TableSorting(table, Column_HymnNum, Column_HymnTitle, Column_Classify);
		
		btnPlay = new Button(shell, SWT.NONE);
		btnPlay = new Button(shell, SWT.NONE);
		btnPlay.setBounds(458, 416, 76, 36);
		btnPlay.setText("\u25B6");
		final PlayMusic music = new PlayMusic();
		
		shell.addListener(SWT.Close, new Listener()
		{
			public void handleEvent(Event event) { music.stop(); }
		});
		
		btnPlay.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent e) {
			}
		});
		btnPlay.addListener(SWT.Selection, new Listener()
		{
			public void handleEvent(Event event)
			{
				music.isPlaying = !music.isPlaying;
				btnPlay.setText(music.isPlaying ? "■" : "▶");
				if (!music.isPlaying) music.stop();
				else music.play(new File(".\\Hymnals\\" + label_SingNum.getText() + "장.mp3"));
			}
		});
		
		
	}
	void Addbtn(){
		Button btnAddFavorite = new Button(shell, SWT.NONE);
		btnAddFavorite.setText("\uC990\uACA8\uCC3E\uAE30 \uCD94\uAC00");
		btnAddFavorite.setBounds(540, 416, 88, 36);
		btnAddFavorite.addMouseListener(new MouseAdapter() {
			@Override
			public void mouseUp(MouseEvent e) {
				try {
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
				}
			}
		});
	}
	
	void AddFind(){		
		Button btnSearch = new Button(shell, SWT.NONE);
		btnSearch.addListener(SWT.Selection, new Listener() {
		      public void handleEvent(Event event) {
		       StringSearchDialog strSearchDlg = new StringSearchDialog(shell, 2, table);
		       strSearchDlg.open();
		      }
		    });
		btnSearch.setBounds(336, 416, 55, 36);
		btnSearch.setText("\uAC80\uC0C9");
	}
}
