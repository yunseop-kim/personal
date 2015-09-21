<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page language="java" import="java.util.*, java.sql.*, javax.servlet.http.*" %>

<%
	Statement stmt;

	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bookdb","root","anyang");
	stmt = conn.createStatement();
	
	request.setCharacterEncoding("UTF-8");
	ResultSet rs = null;
	
	String Str_BookNo = request.getParameter( "Radio" );
	if(Str_BookNo == null){
		out.println("<SCRIPT LANGUAGE='JavaScript'>alert('삭제할 책을 입력하세요.');");
		out.print("location.href = 'Book_PageViewerRenewal.jsp';</SCRIPT>");
	}
	String sql = "select count(*) from bookinfo where BookNo=" + Str_BookNo;
	rs = stmt.executeQuery( sql );
	sql = "delete from bookinfo where BookNo=" + Str_BookNo;
	
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
%>

<html>
<head>
	<script language=javascript>
		self.window.alert("글을 삭제하였습니다.");
		location.href="Book_PageViewerRenewal.jsp";
	</script>
</head>
</html>	