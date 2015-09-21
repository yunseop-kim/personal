<%--수정용 폼--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<Title>도서관리</Title>
</head>
<body>
<H4>상품 정보 등록</H4>
<form name="form1" method="post" action="Book_Register_Write.jsp">
  <table width="0" border="1">
    <tr>
      <td>제목</td>
      <td><input type="text" name="Title"></td>
      <td>대여금액</td>
      <td>
      <input type="text" name="RentalFee"></td>
    </tr>
    <tr>
      <td>저자</td>
      <td><input type="text" name="Author"></td>
      <td>진열위치</td>
      <td>
      <input type="text" name="Location"></td>
    </tr>
    <tr>
      <td>출판사</td>
      <td><input type="text" name="Publisher"></td>
      <td>구입가격</td>
      <td>
      <input type="text" name="Price"></td>
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
      <td>겉표지</td>
      <td><input type="file" name="filename1" size=20></td>
      <td><input type="submit" value="등록"></td>
      <td>&nbsp;</td>
    </tr>
  </table>
</form>
</body>
</html>