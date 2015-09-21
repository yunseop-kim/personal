<%--수정용 폼--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page language="java" import="java.util.*, java.sql.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%!
 String TransGrade (int Grade){
	if (Grade == 0)			return "전체이용가";
	if (Grade == 7)			return "7세";
	if (Grade == 12)		return "12세";
	if (Grade == 15)		return "15세";
	if (Grade == 19)		return "19세";
	else return "오류";
}
String boolRent(String Rent){
	if(Rent == null) 		return "대여가능";
	else 					return "대여중";
}
%>
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
	int Grade =0 ;
	String Price ="" ;
	String RentalFee ="" ;
	String FilePath ="";
	String Lender ="";

	String Str_BookNo = request.getParameter( "BookNo" );
	if(Str_BookNo == null){
		out.println("<SCRIPT LANGUAGE='JavaScript'>alert('수정할 책을 고르세요.');");
		out.print("location.href = 'Book_PageViewerRenewal.jsp';</SCRIPT>");
	}
	try {
		stmt = conn.createStatement();
		String sql = "select Title, Author, Publisher, Genre, Grade, Price, RentalFee, Location, FilePath, Lender from bookinfo where BookNo=" + Str_BookNo;
		rs = stmt.executeQuery( sql );
		if( rs.next() ) {
			Title = rs.getString(1);
			Author = rs.getString(2);
			Publisher = rs.getString(3);
			Genre = rs.getString(4);
			Location = rs.getString(8);
			Grade = rs.getInt(5);
			Price = rs.getString(6);
			RentalFee = rs.getString(7);
			FilePath = rs.getString(9);
			Lender = rs.getString(10);
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
<meta http-equiv="Content-Type" content="text/html; img/jpeg; charset=UTF-8">
<Title>도서관리</Title>
</head>
<body>
<form name="form1" method="post">

  <table width="0" border="1">
    <tr>
      <td>표지</td>
      <td><img src="C:\Users\Tim\workspace\.metadata\.plugins\org.eclipse.wst.server.core\tmp0\wtpwebapps\BookManage\img\<%=FilePath%>" width="165" height="200"></img></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>책번호</td>
      <td><%=Str_BookNo %></td>
      <td>상태</td>
      <td><%=boolRent(Lender) %></td>
    </tr>
    <tr>
      <td>제목</td>
      <td><input name="Title" type="text" value='<%=Title%>' readonly="readonly"></td>
      <td>대여금액</td>
      <td><input name="RentalFee" type="text" value='<%=RentalFee%>' readonly="readonly"></td>
    </tr>
    <tr>
      <td>저자</td>
      <td><input name="Author" type="text" value='<%=Author%>' readonly="readonly"></td>
      <td>진열위치</td>
      <td><input name="Location" type="text" value='<%=Location%>' readonly="readonly"></td>
    </tr>
    <tr>
      <td>출판사</td>
      <td><input name="Publisher" type="text" value='<%=Publisher%>' readonly="readonly"></td>
      <td>구입가격</td>
      <td><input name="Price" type="text" value='<%=Price%>' readonly="readonly"></td>
    </tr>
    <tr>
      <td>장르</td>
      <td><input name="Publisher2" type="text" value='<%=Genre%>' readonly="readonly"></td>
      <td>관람등급</td>
      <td><input name="Price2" type="text" value='<%=TransGrade(Grade)%>' readonly="readonly"></td>
    </tr>
  </table>
    <a href="Book_PageViewerRenewal.jsp">목록보기</a>
</form>
</body>
</html>