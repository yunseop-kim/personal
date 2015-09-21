<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page language="java" import="java.util.*, java.sql.*, javax.servlet.http.*" %>

<%
	Statement stmt;

	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bookdb","root","anyang");
	stmt = conn.createStatement();
	
	request.setCharacterEncoding("UTF-8");

	String Radio = request.getParameter( "Radio" );
	String Query = request.getParameter( "Name");
	String IDNO = request.getParameter("IDNO");
	String Borrowed = request.getParameter("Borrowed");
	int Int_Borrowed = Integer.parseInt(Borrowed) - 1;
	%>

<html>
<head>
<title>글 수정하기</title>
</head>
<body>
<%
if(Radio==null){
	out.println("<SCRIPT LANGUAGE='JavaScript'>alert('반납할 책을 고르세요.');");
	out.print("location.href = 'Rental_MemberInfo.jsp?QUERY="+ Query + "';</SCRIPT>");
}else{
	try {
		String sql_Book = "update bookinfo set Lender=NULL, RentalDay=NULL where BookNo=" + Radio;
		String sql_Member = "update idinfo set Borrowed=" + Int_Borrowed +" where IDNO=" + IDNO;
		stmt = conn.createStatement();
		stmt.executeUpdate( sql_Book );
		stmt.executeUpdate( sql_Member );
		stmt.close();
		conn.close();
	} catch( Exception e ) {
		out.println( e.toString() );
		return;
	}
	out.println("<SCRIPT LANGUAGE='JavaScript'>alert('반납 처리 되었습니다.');");
	out.print("location.href = 'Rental_MemberInfo.jsp?QUERY="+ Query + "';</SCRIPT>");
}
%>
<p>&nbsp;</p>
</body>
</html>
		