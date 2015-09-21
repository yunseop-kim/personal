<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page language="java" import="java.util.Date, java.sql.*, javax.servlet.http.*, java.text.SimpleDateFormat" %>
<%
	Statement stmt;

	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bookdb","root","anyang");
	stmt = conn.createStatement();
	
	request.setCharacterEncoding("UTF-8");

	String IDNO = request.getParameter( "IDNO" );
	String Name = request.getParameter( "Name" );
	String BookNum = request.getParameter( "BookNum" );
	String Borrowed = request.getParameter("Borrowed");
	int Int_Borrowed = Integer.parseInt(Borrowed) + 1 ;
	Date birth = new Date();   //시간과 날짜를 얻어온다.
	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");  //날짜 형식을 지정
	String formatDate = dateFormat.format(birth);
%>
<html>
<head>
<title>책 대여</title>
</head>
<body>
<%
ResultSet rs = stmt.executeQuery("SELECT * FROM bookinfo where BookNo = " + BookNum);
rs.next();

if(BookNum.equals("")){
	out.println("<SCRIPT LANGUAGE='JavaScript'>alert('대여할 책을 입력하세요.');");
	out.print("location.href = 'Rental_MemberInfo.jsp?QUERY="+ Name + "';</SCRIPT>");
}else if (rs.getString(12) != null){
	out.println("<SCRIPT LANGUAGE='JavaScript'>alert('이미 대여된 책입니다.');");
	out.print("location.href = 'Rental_MemberInfo.jsp?QUERY="+ Name + "';</SCRIPT>");
}else{
	try {
		String sql_Book = "update bookinfo set Lender=" + IDNO + ", RentalDay='" + formatDate + "' where BookNo=" + BookNum;
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
	out.println("<SCRIPT LANGUAGE='JavaScript'>alert('대여 되었습니다.');");
	out.print("location.href = 'Rental_MemberInfo.jsp?QUERY="+ Name + "';</SCRIPT>");
}
%>
</body>
</html>
		