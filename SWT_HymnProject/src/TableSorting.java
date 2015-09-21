import java.text.Collator;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Locale;

import org.eclipse.swt.SWT;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
import org.eclipse.swt.widgets.TableItem;

public class TableSorting {

	private Table table;
    private TableColumn intColumn,TitleColumn,ClassifyColumn;  
    
    public TableSorting(Table table, TableColumn intColumn, TableColumn TitleColumn, TableColumn ClassifyColumn) {
    	this.table = table;
    	this.TitleColumn = TitleColumn;
    	this.ClassifyColumn = ClassifyColumn;
    	
    	intColumn.addListener(SWT.Selection, SortListenerFactory.getListener(SortListenerFactory.STRING_COMPARATOR));
    	TitleColumn.addListener(SWT.Selection, SortListenerFactory.getListener(SortListenerFactory.STRING_COMPARATOR));
    	ClassifyColumn.addListener(SWT.Selection, SortListenerFactory.getListener(SortListenerFactory.STRING_COMPARATOR));
    }
    
}

// this is the ListenerFactory implementation

class SortListenerFactory implements Listener
{
    private Comparator currentComparator = null;
    
    private Collator col = Collator.getInstance(Locale.getDefault());
    
    public static final int INT_COMPARATOR    = 0;
    public static final int STRING_COMPARATOR = 1;
    
    private SortListenerFactory(int _comp)
    {
        switch (_comp) 
        {
        case INT_COMPARATOR:
            currentComparator = intComparator;
            break;

        case STRING_COMPARATOR:
            currentComparator = strComparator;
            break;
            
        default:
            currentComparator = strComparator;
        }
    }
    
    public static Listener getListener(int _comp)
    {
        return new SortListenerFactory(_comp);
    }
    
    private int colIndex = 0;
    private int updown   = 1;
          
    // Integer Comparator
    private Comparator intComparator = new Comparator()
    {
        public int compare(Object arg0, Object arg1) {

            TableItem t1 = (TableItem)arg0;
            TableItem t2 = (TableItem)arg1;

            int v1 = Integer.parseInt(t1.getText(colIndex));
            int v2 = Integer.parseInt(t2.getText(colIndex));

            if (v1<v2) return 1*updown;
            if (v1>v2) return -1*updown;

            return 0;
        }    
    };
         
    // String Comparator
    private Comparator strComparator = new Comparator()
    {
        public int compare(Object arg0, Object arg1) {

            TableItem t1 = (TableItem)arg0;
            TableItem t2 = (TableItem)arg1;

            String v1 = (t1.getText(colIndex));
            String v2 = (t2.getText(colIndex));

            return (col.compare(v1,v2))*updown;
        }    
    };
public void handleEvent(Event e) {
        
        updown = (updown == 1 ? -1 : 1);
        
        TableColumn currentColumn = (TableColumn)e.widget;
        Table table = currentColumn.getParent();
    
        colIndex = searchColumnIndex(currentColumn);
        
        table.setRedraw(false);
        
        TableItem[] items = table.getItems();
       
        Arrays.sort(items,currentComparator);
        
        table.setItemCount(items.length);
        
        for (int i = 0;i<items.length;i++)
        {   
            TableItem item = new TableItem(table,SWT.NONE,i);
            item.setText(getData(items[i]));
            items[i].dispose();
        }
        
        table.setRedraw(true);     
    }
    
    private String[] getData(TableItem t)
    {
        Table table = t.getParent();
        
        int colCount = table.getColumnCount();
        String [] s = new String[colCount];
        
        for (int i = 0;i<colCount;i++)
            s[i] = t.getText(i);
                
        return s;
        
    }
    
    private int searchColumnIndex(TableColumn currentColumn)
    {
        Table table = currentColumn.getParent();
        
        int in = 0;
        
        for (int i = 0;i<table.getColumnCount();i++)
            if (table.getColumn(i) == currentColumn)
                in = i;
        
        return in;
    }
}