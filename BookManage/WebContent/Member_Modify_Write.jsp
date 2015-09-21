<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page language="java" import="java.util.*, java.sql.*, javax.servlet.http.*"%>
<%
	Statement stmt;

	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bookdb","root","anyang");
	stmt = conn.createStatement();
	
	request.setCharacterEncoding("UTF-8");
	String Name = request.getParameter( "Name" );
	String Tel = request.getParameter( "Tel" );
	String Birth = (request.getParameter("Year") +"-" + request.getParameter("Month") + "-" + request.getParameter("Day"));
	String Phone = request.getParameter( "Phone" );
	String Address = request.getParameter( "Address" );
	String Etc = request.getParameter( "ETC" );
	String IdNO = request.getParameter( "IDNO" );
	//int Int_BookNum = Integer.parseInt( Str_BookNo );
	
	try {
		String sql = "update idinfo set Name='" + Name + "', Tel='" + Tel + "', Birth='" + Birth + "', Phone='" + Phone + "', Address='" + Address + "', ETC='" + Etc + "' where IDNO='"+ IdNO + "'";
		stmt = conn.createStatement();
		stmt.executeUpdate( sql );
		stmt.close();
		conn.close();
	} catch( Exception e ) {
		out.println( e.toString() );
		return;
	}
%>
<html>
<head>
<title>글 수정하기</title>
<script language='javascript'>
<!--
	function alrim() {
		alert( "글 수정이 완료되었습니다." );
		location.href = 'Member_PageViewer.jsp';
	}
//-->
</script>
</head>
<body onLoad="javascript:alrim();">
<p>&nbsp;</p>
</body>
</html>