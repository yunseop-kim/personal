<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" import="java.util.*, java.sql.*, javax.servlet.http.*" %>

<%
	Statement stmt;

	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bookdb","root","anyang");
	stmt = conn.createStatement();
	
	request.setCharacterEncoding("UTF-8");
	ResultSet rs = null;
	
	String Str_IDNO = request.getParameter( "Radio" );
	if(Str_IDNO == null){
		out.println("<SCRIPT LANGUAGE='JavaScript'>alert('삭제할 책을 입력하세요.');");
		out.print("location.href = 'Book_PageViewerRenewal.jsp';</SCRIPT>");
	}else{
		String sql = "select count(*) from idinfo where IDNO=" + Str_IDNO;
		rs = stmt.executeQuery( sql );
		sql = "delete from idinfo where IDNO=" + Str_IDNO;
		
		try
		{
			stmt.executeUpdate( sql );
			stmt.close();
			conn.close();
		}
		catch( Exception e )
		{
			out.println( e.toString() );
			return;
		}
	}
%>

<html>
<head>
	<script language=javascript>
		self.window.alert("글을 삭제하였습니다.");
		location.href="Member_PageViewer.jsp";
	</script>
</head>
</html>	