<%--수정용 폼--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page language="java" import="java.util.*, java.sql.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%
	Statement stmt;
	
	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bookdb","root","anyang");
	stmt = conn.createStatement();
	
	request.setCharacterEncoding("UTF-8");
	ResultSet rs = null;
	
	String Title ="" ;
	String Author ="" ;
	String Publisher ="" ;
	String Genre ="" ;
	String Location ="" ;
	String Grade ="" ;
	String Price ="" ;
	String RentalFee ="" ;	

	String Str_BookNo = request.getParameter( "Radio" );
	if(Str_BookNo == null){
		out.println("<SCRIPT LANGUAGE='JavaScript'>alert('수정할 책을 고르세요.');");
		out.print("location.href = 'Book_PageViewerRenewal.jsp';</SCRIPT>");
	}
	try {
		stmt = conn.createStatement();
		String sql = "select Title, Author, Publisher, Genre, Grade, Price, RentalFee, Location from bookinfo where BookNo=" + Str_BookNo;
		rs = stmt.executeQuery( sql );
		if( rs.next() ) {
			Title = rs.getString(1);
			Author = rs.getString(2);
			Publisher = rs.getString(3);
			Genre = rs.getString(4);
			Location = rs.getString(8);
			Grade = rs.getString(5);
			Price = rs.getString(6);
			RentalFee = rs.getString(7);
		}
		stmt.close();
		rs.close();
		conn.close();
	} catch( Exception e ) {
		out.println( e.toString() );
		return;
	}
%>


<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<Title>도서관리</Title>
</head>
<body>
<form name="form1" method="post" action="Book_Modify_Write.jsp?BookNo=<%=Str_BookNo%>">
  <table width="0" border="1">
    <tr>
      <td>제목</td>
      <td><input type="text" name="Title" value='<%=Title%>'></td>
      <td>대여금액</td>
      <td>
      <input type="text" name="RentalFee" value='<%=RentalFee%>'></td>
    </tr>
    <tr>
      <td>저자</td>
      <td><input type="text" name="Author" value='<%=Author%>'></td>
      <td>진열위치</td>
      <td>
      <input type="text" name="Location" value='<%=Location%>'></td>
    </tr>
    <tr>
      <td>출판사</td>
      <td><input type="text" name="Publisher" value='<%=Publisher%>'></td>
      <td>구입가격</td>
      <td>
      <input type="text" name="Price" value='<%=Price%>'></td>
    </tr>
    <tr>
      <td>장르</td>
      <td><select name="Genre" size="1">
        <option>액션</option>
        <option>판타지</option>
        <option>로맨스</option>
        <option>코미디</option>
      </select></td>
      <td>관람등급</td>
      <td>
        <select name="Grade">
          <option>전체이용가</option>
          <option>7세</option>
          <option>12세</option>
          <option>15세</option>
          <option>19세</option>
      </select></td>
    </tr>
    <tr>
      <td><input type="submit" name="Register" value="수정"></td>
      <td>&nbsp;</td>
      <td>책번호</td>
      <td><%=Str_BookNo %></td>
    </tr>
  </table>
</form>
</body>
</html>