import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.FontDialog;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.SWT;
import org.eclipse.swt.widgets.TabItem;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.TabFolder;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.widgets.Label;
import org.eclipse.wb.swt.SWTResourceManager;
import org.eclipse.core.databinding.observable.Realm;
import org.eclipse.jface.databinding.swt.SWTObservables;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.Font;

public class HymnMain {
	protected Shell shlHymnalPlayer;
	private Table Table_Hymn;
	private StyledText text_Lyrics;
	private Table Table_Favorite;

	private Label label_SingNum;
	private Label label_Title;
	private Label label_Classify;
	private Label label_Word;
	
	private Font font;
	private Color color;
	
	/**
	 * Launch the application.
	 * @param args
	 */
	public static void main(String[] args) {
		Display display = Display.getDefault();
		Realm.runWithDefault(SWTObservables.getRealm(display), new Runnable() {
			public void run() {
				try {
					HymnMain window = new HymnMain();
					window.open();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Open the window.
	 */
	public void open() {
		Display display = Display.getDefault();
		createContents();
		shlHymnalPlayer.open();
		shlHymnalPlayer.layout();
		while (!shlHymnalPlayer.isDisposed()) {
			if (!display.readAndDispatch()) {
				display.sleep();
			}
		}
	}

	/**
	 * Create contents of the window.
	 */
	protected void createContents() {
		shlHymnalPlayer = new Shell();
		shlHymnalPlayer.setSize(725, 500);
		shlHymnalPlayer.setText("Hymnal Player");
		
		StringSearchDialog.centerOnFirstScreen(shlHymnalPlayer);
		
		label_SingNum = new Label(shlHymnalPlayer, SWT.NONE);
		label_SingNum.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		label_SingNum.setBounds(372, 10, 35, 21);
		
		label_Title = new Label(shlHymnalPlayer, SWT.NONE);
		label_Title.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		label_Title.setBounds(413, 10, 286, 21);
		
		
		label_Classify = new Label(shlHymnalPlayer, SWT.NONE);
		label_Classify.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		label_Classify.setBounds(372, 37, 125, 21);
		
		label_Word = new Label(shlHymnalPlayer, SWT.NONE);
		label_Word.setBackground(SWTResourceManager.getColor(SWT.COLOR_WHITE));
		label_Word.setBounds(540, 37, 159, 21);
		
		text_Lyrics = new StyledText(shlHymnalPlayer, SWT.BORDER | SWT.H_SCROLL | SWT.V_SCROLL);
		text_Lyrics.setBounds(336, 64, 363, 346);
		
		TabFolder tabFolder = new TabFolder(shlHymnalPlayer, SWT.NONE);
		tabFolder.setBounds(0, 10, 330, 442);
		
		TabItem HymnTab = new TabItem(tabFolder, SWT.NONE);
		HymnTab.setText("\uCC2C\uC1A1\uAC00");
		
		TableClass HymnTable = new TableClass(
				"newsong",	shlHymnalPlayer,
				tabFolder, 	HymnTab, 
				Table_Hymn, 	label_SingNum,
				label_Title,	label_Classify,
				label_Word,		text_Lyrics);
		HymnTable.AddFind();

		TabItem FavoriteTab = new TabItem(tabFolder, SWT.NONE);
		FavoriteTab.setText("\uC990\uACA8\uCC3E\uAE30");
		
		Table_Favorite = new Table(tabFolder, SWT.BORDER);
		Table_Favorite.setHeaderVisible(true);
		FavoriteTab.setControl(Table_Favorite);
		
		TableClass FavoriteTable = new TableClass(
				"Favorite",	shlHymnalPlayer,
				tabFolder, 	FavoriteTab, 
				Table_Hymn, 	label_SingNum,
				label_Title,	label_Classify,
				label_Word,		text_Lyrics);
		FavoriteTable.Addbtn();
		
		Label lblTitleText = new Label(shlHymnalPlayer, SWT.NONE);
		lblTitleText.setAlignment(SWT.CENTER);
		lblTitleText.setBounds(336, 10, 30, 15);
		lblTitleText.setText("\uACE1\uBA85");
		
		Label lblClassifyText = new Label(shlHymnalPlayer, SWT.NONE);
		lblClassifyText.setAlignment(SWT.CENTER);
		lblClassifyText.setText("\uBD84\uB958");
		lblClassifyText.setBounds(336, 37, 30, 15);
		
		Label label_WordText = new Label(shlHymnalPlayer, SWT.NONE);
		label_WordText.setText("\uB9D0\uC500");
		label_WordText.setAlignment(SWT.CENTER);
		label_WordText.setBounds(503, 37, 30, 15);
		/*
		Button btnSearch = new Button(shlHymnalPlayer, SWT.NONE);
		btnSearch.addListener(SWT.Selection, new Listener() {
		      public void handleEvent(Event event) {
		       StringSearchDialog strSearchDlg = new StringSearchDialog(shlHymnalPlayer, 2);
		       strSearchDlg.open();
		      }
		    });
		btnSearch.setBounds(336, 416, 55, 36);
		btnSearch.setText("\uAC80\uC0C9");
		*/
		Button btnFont = new Button(shlHymnalPlayer, SWT.PUSH);
		btnFont.setText("\uAE00\uAF34");
		btnFont.setBounds(397, 416, 55, 36);
		btnFont.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(SelectionEvent event) {
				// 폰트다이얼로그
				FontDialog fontDialog = new FontDialog(shlHymnalPlayer);
 
				// 폰트가 NULL이 아닐 경우 라벨 폰트 데이터를 폰트다이얼로그에 설정한다.
				if (font != null) {
					fontDialog.setFontList(text_Lyrics.getFont().getFontData());
				}
 
				// 컬러가 NULL이 아닐 경우 폰트컬러를 폰트아이얼로그에 설정한다.
				if (color != null) {
					fontDialog.setRGB(color.getRGB());
				}
 
				// 폰트다이얼로그 오픈
				if (fontDialog.open() != null) {
					// 폰트다이얼로그에서 선택된 내용이 있을경우
					// 기존 적용된 폰트 내용을 제거한다.
					if (font != null) {
						font = null;
					}
 
					// 기존 적용된 컬러 내용을 제거한다.
					if (color != null) {
						color = null;
					}
 
					// 선택된 폰트 내용을 라벨에 설정함.
					font = new Font(shlHymnalPlayer.getDisplay(), fontDialog.getFontList());
					text_Lyrics.setFont(font);
 
					// 선택된 컬러내용을 라벨에 설정함.
					color = new Color(shlHymnalPlayer.getDisplay(), fontDialog.getRGB());
					text_Lyrics.setForeground(color);
 
					// 화면에 반영
					shlHymnalPlayer.pack();
				}
			}
		});
		
	}
}