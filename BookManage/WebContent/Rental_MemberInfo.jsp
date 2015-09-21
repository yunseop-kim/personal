<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page language="java" import="java.util.*, java.sql.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%!
 String TransGrade (int Grade){
	if (Grade == 0)	return "전체이용가";
	if (Grade == 7)		return "7세";
	if (Grade == 12)		return "12세";
	if (Grade == 15)		return "15세";
	if (Grade == 19)		return "19세";
	else return "오류";
}
%>
<%

	Statement stmt;
	
	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bookdb","root","anyang");
	stmt = conn.createStatement();
	
	request.setCharacterEncoding("UTF-8");
	ResultSet rs = null;
	String IDNO = "";
	String Name ="" ;
	String Tel ="" ;
	String Birth = "";
	String Phone ="" ;
	String Address ="" ;
	String Etc ="" ;
	String Borrowed ="";
	
	String Query = request.getParameter( "QUERY" );
	
	try {
		stmt = conn.createStatement();
		String sql = "select * from idinfo where NAME like '%" + Query +"%'";
		rs = stmt.executeQuery( sql );
		if( rs.next() ) {
			IDNO = rs.getString(1);
			Name = rs.getString(3);
			Tel = rs.getString(4);
			Birth = rs.getString(2);  //Date 값을 받아서 
			Phone = rs.getString(5);
			Address = rs.getString(6);
			Etc = rs.getString(7);
			Borrowed = rs.getString(8);
		}
	} catch( Exception e ) {
		out.println( e.toString() );
		return;
	}
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>도서관리</title>
</head>
<body>
  <form method="post">
  <table width="0" border="1">
    <tr>
      <td>회원번호</td>
      <td>
        <input name="IDNO" type="text" value='<%=IDNO%>' readonly="readonly"></td>
      <td>빌린책수</td>
      <td>
		<input name="Borrowed" type"text" value='<%=Borrowed%>' readonly="readonly">
	 </td>
    </tr>
    <tr>
      <td>이름</td>
      <td><input name="Name" type="text" value='<%=Name%>' readonly="readonly"></td>
      <td>전화번호</td>
      <td><input name="Tel" type="text" value='<%=Tel%>' readonly="readonly"></td>
    </tr>
    <tr>
      <td>생년월일</td>
      <td><input name="Birth" type="text" value='<%=Birth%>' readonly="readonly"></td>
      <td>휴대전화</td>
      <td><input name="Phone" type="text" value='<%=Phone%>' readonly="readonly"></td>
    </tr>
    <tr>
      <td>주소</td>
      <td>
        <input name="Address" type="text" value='<%=Address%>' readonly="readonly"></td>
      <td>비고</td>
      <td>
        <input name="ETC" type="text" id="ETC" value='<%=Etc%>' readonly="readonly">      
    </tr>
  </table>
<h1>대출도서 리스트</h1>

 책 번호 입력 : <input type="text" name="BookNum"><input type="submit" value="확인" formaction="Rental_RentBook.jsp">

  <!-- 헤드라인 글씨를 표현하는 태그입니다. -->
<table border=1>                        <!-- 표 형식의 데이터를 표현하는 태그입니다. -->
        <tr>
          <th><input type="radio" name="radio"></th>
          <th>번호</th>                                
          <!-- table태그 내에서 행을 정의할때 쓰는 태그입니다. -->
            <th>제목</th>                     <!-- Table Header의 약자로 table태그 내에서 -->
            <th>작가</th>                     <!-- 강조하고싶은 컬럼을 나타낼때 쓰는 태그입니다. -->
            <th>출판사</th>
            <th>장르</th>
            <th>관람연령</th>
            <th>구입날짜</th>
            <th>진열위치</th>
            <th>대여자</th>
            <th>대여료</th>
        </tr>
 
<%   
try {
	stmt = conn.createStatement();
	rs = stmt.executeQuery("SELECT * FROM bookinfo where Lender = " + IDNO);
        while(rs.next()){
            out.print("<tr>");
		    out.print("<td><input type=\"radio\" name=\"Radio\" value=\""+ rs.getString(1) +"\"></td>");
            out.print("<td>" + rs.getString(1) + "</td>");
            out.print("<td>" + rs.getString(2) + "</td>");
            out.print("<td>" + rs.getString(3) + "</td>");
            out.print("<td>" + rs.getString(4) + "</td>");
            out.print("<td>" + rs.getString(6) + "</td>");
            out.print("<td>" + TransGrade (rs.getInt(7)) + "</td>");	
            out.print("<td>" + rs.getString(5) + "</td>");
            out.print("<td>" + rs.getString(11) + "</td>");
            out.print("<td>" + rs.getString(12) + "</td>");
            out.print("<td>" + rs.getString(10) + "</td>");
            out.print("</tr>");
        }
		stmt.close();
		rs.close();
		conn.close();
	} catch( Exception e ) {
		out.println( e.toString() );
		return;
	}
%>
    </table>
<p>
  <input type="submit" value="반납처리" formaction="Rental_ReturnBook.jsp">
</p>
</form>
</body>
</html>