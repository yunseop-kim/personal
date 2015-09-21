<%-- 북 마스터 폼. 책 관리 폼 --%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>도서관리</title>
</head>
<body>
<H4>회원 등록</H4>
<form name="form1" method="post" action="Member_Register_Write.jsp">
  <table width="0" border="1">
    <tr>
      <td>이름</td>
      <td><label for="Name"></label>
        <input type="text" name="Name"></td>
      <td>전화번호</td>
      <td><label for="Tel"></label>
      <input type="text" name="Tel"></td>
    </tr>
    <tr>
      <td>생년월일</td>
      <td><label for="Year"></label>
        <input name="Year" type="text" size="4" maxlength="4">
        년
  <label for="Month"></label>
  <input name="Month" type="text" size="2" maxlength="2">
        월
  <label for="Day"></label>
  <input name="Day" type="text" size="2" maxlength="2">
        일</td>
      <td>휴대전화</td>
      <td><label for="Phone"></label>
      <input type="text" name="Phone"></td>
    </tr>
    <tr>
      <td>주소</td>
      <td><label for="Address"></label>
        <input type="text" name="Address"></td>
      <td>비고</td>
      <td><label for="ETC"></label>
        <input type="text" name="ETC" id="ETC">      
    </tr>
    <tr>
      <td><input type="submit" name="Register" value="등록"></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </table>
</form>
</body>
</html>