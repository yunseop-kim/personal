<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page language="java" import="java.util.*, java.sql.*, javax.servlet.http.*" %>
<%!
 int TransGrade (String str){
	if (str.equals("전체이용가"))	return 0;
	if (str.equals("7세"))		return 7;
	if (str.equals("12세"))		return 12;
	if (str.equals("15세"))		return 15;
	if (str.equals("19세"))		return 19;
	else return 0;
}
%>
<%
	Statement stmt;

	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bookdb","root","anyang");
	stmt = conn.createStatement();
	
	request.setCharacterEncoding("UTF-8");
	
	String Title = request.getParameter( "Title" );
	String Author = request.getParameter( "Author" );
	String Publisher = request.getParameter( "Publisher" );
	String Genre = request.getParameter( "Genre" );
	String Location = request.getParameter( "Location" );
	String Grade = request.getParameter( "Grade" );
	String Price = request.getParameter( "Price" );
	String RentalFee = request.getParameter( "RentalFee" );	

	String Str_BookNo = request.getParameter( "BookNo" );
	//int Int_BookNum = Integer.parseInt( Str_BookNo );
	
	try {
		String sql = "update bookinfo set Title='" + Title + "', Author='" + Author + "', Publisher='" + Publisher + "', Genre='" + Genre + "', Location='" + Location + "', Grade='" + TransGrade(Grade) + "', Price='" + Price + "', RentalFee='" + RentalFee + "' where BookNo='"+ Str_BookNo +"'";
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
		location.href = 'Book_PageViewerRenewal.jsp';
	}
//-->
</script>
</head>
<body bgcolor="white" onLoad="javascript:alrim();">
<p>&nbsp;</p>
</body>
</html>
		