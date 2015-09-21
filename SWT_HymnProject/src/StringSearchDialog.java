import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import org.eclipse.swt.widgets.Dialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableItem;
import org.eclipse.swt.widgets.Text;
import org.eclipse.swt.SWT;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.events.MouseAdapter;
import org.eclipse.swt.events.MouseEvent;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.graphics.Rectangle;


public class StringSearchDialog extends Dialog {

	protected Object result;
	protected Shell shell;
	private Text text_Query;
	
	private static Connection connect;
	private static Statement statement;
	private static ResultSet resultSet;

	private Table table;

	/**
	 * Create the dialog.
	 * @param parent
	 * @param style
	 */
	public StringSearchDialog(Shell parent, int style, Table table) {
		super(parent, SWT.DIALOG_TRIM | SWT.PRIMARY_MODAL);
		setText("SWT Dialog");
		this.table = table;
	}

	/**
	 * Open the dialog.
	 * @return the result
	 */
	public Object open() {
		createContents();
		shell.open();
		shell.layout();
		Display display = getParent().getDisplay();
		while (!shell.isDisposed()) {
			if (!display.readAndDispatch()) {
				display.sleep();
			}
		}
		return result;
	}

	/**
	 * Create contents of the dialog.
	 */
	private void createContents() {
		shell = new Shell(getParent(), getStyle());
		shell.setSize(290, 130);
		shell.setText("\uAC80\uC0C9");
		centerOnFirstScreen(shell);
		
		text_Query = new Text(shell, SWT.BORDER);
		text_Query.setBounds(72, 20, 200, 25);
		
		Button btnSearch = new Button(shell, SWT.NONE);
		btnSearch.addMouseListener(new MouseAdapter() {
			@Override
			public void mouseUp(MouseEvent e) {
				String drive = "sun.jdbc.odbc.JdbcOdbcDriver"; 
				String url = "jdbc:odbc:MS Access Database;DBQ=./chansong2.mdb"; 
				table.removeAll();
		    	table.redraw();
				try{ 
					Class.forName(drive);
					connect = DriverManager.getConnection(url);
					System.out.println("Connecting succesfully");
					statement = connect.createStatement();
					resultSet = statement.executeQuery("Select * from newsong where SNGWORD like '%" + text_Query.getText() + "%';");
					while(resultSet.next()){
						TableItem item = new TableItem(table, SWT.NONE);
						item.setText(new String[]{resultSet.getString(2),resultSet.getString(1),resultSet.getString(9)});
					}
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					System.out.println("Cannot connect to database server");
				}
				System.out.println(text_Query.getText());
				shell.close();
			}
		});
		btnSearch.setBounds(46, 67, 76, 25);
		btnSearch.setText("\uAC80\uC0C9");
		
		Button btnCancel = new Button(shell, SWT.NONE);
		btnCancel.addMouseListener(new MouseAdapter() {
			@Override
			public void mouseUp(MouseEvent e) {
				shell.close();
			}
		});
		btnCancel.setBounds(168, 67, 76, 25);
		btnCancel.setText("\uCDE8\uC18C");
		
		Label label_Text = new Label(shell, SWT.NONE);
		label_Text.setText("\uAC80\uC0C9 \uB2E8\uC5B4");
		label_Text.setBounds(10, 25, 56, 15);

	}
	
	public static void centerOnFirstScreen(Shell shell)
	{
		Point shellSize = shell.getSize();
		Rectangle monitorBounds = shell.getDisplay().getMonitors()[0].getBounds();
		shell.setLocation(monitorBounds.x + (monitorBounds.width - shellSize.x) / 2, monitorBounds.y + (monitorBounds.height - shellSize.y) / 2);
	}
}
