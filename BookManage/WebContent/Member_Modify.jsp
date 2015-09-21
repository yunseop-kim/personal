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
	String Name ="" ;
	String Tel ="" ;
	String Birth = "";
	String Phone ="" ;
	String Address ="" ;
	String Etc ="" ;
	String Year ="";
	String Month ="";
	String Day ="";
	
	String Str_IDNO = request.getParameter( "Radio" );
	if(Str_IDNO == null){
		out.println("<SCRIPT LANGUAGE='JavaScript'>alert('수정할 회원을 고르세요');");
		out.print("location.href = 'Member_PageViewer.jsp';</SCRIPT>");
	}else{
		
		try {
			stmt = conn.createStatement();
			String sql = "select NAME, Tel, Birth, Phone, Address, Etc from idinfo where IDNO=" + Str_IDNO;
			rs = stmt.executeQuery( sql );
			if( rs.next() ) {
				Name = rs.getString(1);
				Tel = rs.getString(2);
				Birth = rs.getString(3);  //Date 값을 받아서 
				Phone = rs.getString(4);
				Address = rs.getString(5);
				Etc = rs.getString(6);
			}
			stmt.close();
			rs.close();
			conn.close();
		} catch( Exception e ) {
			out.println( e.toString() );
			return;
		}
		StringTokenizer st = new StringTokenizer(Birth);
		Year = st.nextToken("-");
		Month = st.nextToken("-");
		Day = st.nextToken("-");
	}
%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>도서관리</title>
</head>
<body>
<form name="form1" method="post" action="Member_Modify_Write.jsp?IDNO=<%=Str_IDNO%>">
  <table width="0" border="1">
    <tr>
      <td>이름</td>
      <td><label for="Name"></label>
        <input type="text" name="Name" value='<%=Name%>'></td>
      <td>전화번호</td>
      <td><label for="Tel"></label>
      <input type="text" name="Tel" value='<%=Tel%>'></td>
    </tr>
    <tr>
      <td>생년월일</td>
      <td><label for="Year"></label>
        <input name="Year" type="text" size="4" maxlength="4" value='<%=Year%>'>
        년
  <label for="Month"></label>
  <input name="Month" type="text" size="2" maxlength="2" value='<%=Month%>'>
        월
  <label for="Day"></label>
  <input name="Day" type="text" size="2" maxlength="2" value='<%=Day%>'>
        일</td>
      <td>휴대전화</td>
      <td><label for="Phone"></label>
      <input type="text" name="Phone" value='<%=Phone%>'></td>
    </tr>
    <tr>
      <td>주소</td>
      <td><label for="Address"></label>
        <input type="text" name="Address" value='<%=Address%>'></td>
      <td>비고</td>
      <td><label for="ETC"></label>
        <input type="text" name="ETC" id="ETC" value='<%=Etc%>'>      
    </tr>
    <tr>
      <td><input type="submit" name="Register" value="수정"></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </table>
</form>
</body>
</html>