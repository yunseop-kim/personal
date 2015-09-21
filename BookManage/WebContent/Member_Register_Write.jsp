<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" import="java.util.*, java.sql.*, javax.servlet.http.*,java.util.Date, java.text.SimpleDateFormat" %>

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
	String ETC = request.getParameter( "ETC" );
	
	try {
		stmt = conn.createStatement();
		String seq = "select max(IDNO) from idinfo";
		ResultSet rs = stmt.executeQuery( seq );
		
		int IDNO = -1;
		if( rs.next() ) IDNO = rs.getInt(1);
		IDNO++;

		String sql = "INSERT INTO idinfo (IDNO, Birth, Name, Tel, Phone, Address, ETC, Borrowed)" +
			"values(" 	+ IDNO + ", '" 
						+ Birth + "','" 
						+ Name + "','"
						+ Tel + "','"
						+ Phone + "','"
						+ Address + "','"
						+ ETC + "'," 
						+ "0)";
		stmt.executeUpdate( sql );
		stmt.close();
	} catch( Exception e ) {
	  out.println( e.toString() );
	}
%>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<Title>제목 없음</Title>
<script language="javascript">
<!--
	function alrim() {
		alert( "성공적으로 등록하였습니다." );
		location.href = "Member_PageViewer.jsp";
	}
//-->
</script>
</head>
<body onLoad="alrim();">
<p>&nbsp;</p>
</body>
</html>