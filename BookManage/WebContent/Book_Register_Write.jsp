<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" import="java.util.*, java.sql.*, javax.servlet.http.*,java.util.Date, java.text.SimpleDateFormat" %>

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
	
	Date nowDate = new Date();   //시간과 날짜를 얻어온다.
	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");  //날짜 형식을 지정
	String BoughtDay = dateFormat.format(nowDate);

	String Title = request.getParameter( "Title" );
	String Author = request.getParameter( "Author" );
	String Publisher = request.getParameter( "Publisher" );
	String Genre = request.getParameter( "Genre" );
	String Location = request.getParameter( "Location" );
	String Grade = request.getParameter( "Grade" );
	String Price = request.getParameter( "Price" );
	String RentalFee = request.getParameter( "RentalFee" );	
	String FilePath = request.getParameter("filename1");
	
	try {
		stmt = conn.createStatement();
		String seq = "select max(BookNo) from bookinfo";
		ResultSet rs = stmt.executeQuery( seq );
		
		int BookNo = -1;
		if( rs.next() ) BookNo = rs.getInt(1);
		BookNo++;

		String sql = "INSERT INTO bookinfo (BookNo, Title, Author, Publisher, BoughtDay, Genre, Grade, Price, LendTotal, RentalFee, Location, filepath)" +
			"values(" 	+ BookNo + ", '" 	//책번호
						+ Title + "','" 	//제목
						+ Author + "','" 	//작가
						+ Publisher + "','" //출판사
						+ BoughtDay + "','" //책 구입날짜
						+ Genre + "'," 		//장르
						+ TransGrade(Grade) + ","	//관람등급 
						+ Price + 			//책 가격
						",0," 				//총 빌린 횟수
						+ RentalFee + ",'" 	//대여료
						+ Location + "','"
						+ FilePath + "')";	//책 위치
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
		location.href = "Book_PageViewerRenewal.jsp";
	}
//-->
</script>
</head>
<body bgcolor="white" text="white" link="blue" vlink="purple" alink="red" onLoad="alrim();">
<p>&nbsp;</p>
</body>
</html>