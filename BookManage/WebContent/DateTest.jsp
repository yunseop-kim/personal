<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*, java.text.SimpleDateFormat" %>

<html>
<head>
<title>Insert title here</title>
</head>
<body>
 <%
  Date birth = new Date();   //시간과 날짜를 얻어온다.
  SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");  //날짜 형식을 지정
  String formatDate = dateFormat.format(birth);
  StringTokenizer s = new StringTokenizer(formatDate);
  String Year ="";
  String Month ="";
  String Day="";
  Year = s.nextToken("-");
	Month = s.nextToken("-");
	Day = s.nextToken("-");
  %>
  일반적인 JSP 페이지의 형태로 아래와 같이 현재 날짜를 제공합니다.<br>
  현재 날짜는 <%= formatDate %> 입니다.
<%=Year%>!!<%=Month%>!!<%=Day%>
</body>
</html>  