<%-- 초기 화면 상단 메뉴 --%>

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>도서관리 메인페이지</title>
</head>
<body>

<H3>도서관리 프로그램</H3>   
<FORM ACTION=Rental_MemberInfo.jsp METHOD=GET target="mainFrame">
  <INPUT TYPE=button VALUE='회원관리' onClick="parent.mainFrame.location.href='Member_PageViewer.jsp'">
  <INPUT TYPE=button VALUE='도서관리' onClick="parent.mainFrame.location.href='Book_PageViewerRenewal.jsp'">
  대여/반납 : <INPUT TYPE=TEXT NAME=QUERY><INPUT TYPE=SUBMIT VALUE='검색'>

</FORM>
</body>
</html>