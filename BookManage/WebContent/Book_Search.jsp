<%@page import="java.util.regex.Pattern"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
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
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Insert title here</title>
</head>
<body>
<%
String Query = request.getParameter("QUERY");
request.setCharacterEncoding("UTF-8");
int totCnt = 0; // 게시물 전체 수
int totalPage = 0; // 총 페이지수
int pageCnt = 10;  // 한페이지에 보여질 게시물수
int pageGroup = 10; // 한페이지에 보여질 페이지 수
//int pageNo = 0;  // 현재페이지
int currentPage = (request.getParameter("pageNo")) == null ? 1 : Integer.parseInt(request.getParameter("pageNo"));
//현재 화면에서 보여질 페이지의 스타트 번호
int startPageNum = currentPage % pageGroup == 0 ? (currentPage / pageGroup -1) * pageGroup + 1 : (currentPage / pageGroup) * pageGroup + 1;
int endPageNum = startPageNum + pageGroup; //현재 화면에서 보여질 페이지의 마지막 번호

int startRow = currentPage * pageCnt - pageCnt;   // Limit 시작
int endRow = pageCnt;   // Limit 끝
//sql = "SELECT * FROM content ORDER BY idx DESC LIMIT " + startRow + "," + endRow ;
Statement stmt_list;
ResultSet result_list;

Class.forName("com.mysql.jdbc.Driver");
Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bookdb","root","anyang");
stmt_list = conn.createStatement();

String query_list = "select * from bookinfo where Title like '%" + Query + "%' or Author like '%" + Query + "%' order by BookNO desc";

result_list = stmt_list.executeQuery(query_list);
// 게시물 전체수 받아오기
if( result_list.next() ) {
 totCnt = result_list.getInt(1);
}

%>
    <h1>검색 결과</h1>                        <!-- 헤드라인 글씨를 표현하는 태그입니다. -->
    <form method="get">
    <table border=1>                        <!-- 표 형식의 데이터를 표현하는 태그입니다. -->
        <tr>
          <th>
            <input type="radio" name="radio"></th>
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
result_list = stmt_list.executeQuery("SELECT * FROM bookinfo where Title like '%" + Query + "%' or Author like '%" + Query + "%' ORDER BY BOOKNO DESC LIMIT " + startRow + "," + endRow);
		while(result_list.next()){
		    out.print("<tr>");
		    out.print("<td><input type=\"radio\" name=\"Radio\" value=\""+ result_list.getString(1) +"\"></td>");
		    out.print("<td>" + result_list.getString(1) + "</td>");
		    out.print("<td>" + "<a href=\"Book_View.jsp?BookNo=" + result_list.getString(1) + "\">" + result_list.getString(2) + "</a></td>");
		    out.print("<td>" + result_list.getString(3) + "</td>");
		    out.print("<td>" + result_list.getString(4) + "</td>");
		    out.print("<td>" + result_list.getString(6) + "</td>");
		    out.print("<td>" + TransGrade (result_list.getInt(7)) + "</td>");	
		    out.print("<td>" + result_list.getString(5) + "</td>");
		    out.print("<td>" + result_list.getString(11) + "</td>");
		    out.print("<td>" + result_list.getString(9) + "</td>");
		    out.print("<td>" + result_list.getString(10) + "</td>");
		    out.print("</tr>");
		}
%>
    </table>
    <button formaction="Book_Modify.jsp">수정</button>
    <button formaction="Book_Delete.jsp">삭제</button>
    <button onClick="location.href='Book_PageViewerRenewal.jsp'">목록으로 돌아가기</button></form>
<%      

		//총 페이지 수 계산.
		totalPage = totCnt / pageCnt + (totCnt % pageCnt == 0 ? 0:1 );
		
		if( startPageNum - pageGroup > 0 )
			//out.println(startPageNum - pageGroup);
			out.println("<a href=./Book_Search.jsp?pageNo=" + (startPageNum - 1) + ">[prev]</a>&nbsp;" );
		for(int i=startPageNum;i<endPageNum;i++) {
			if( i <= totalPage) {
				if( i != currentPage )
					out.println("<a href=./Book_Search.jsp?pageNo=" + i + ">[" + i + "]</a>&nbsp;" );
				else
					out.println("<b>[" + i + "]</b>&nbsp;" );
			}
		}
		if( endPageNum < totalPage ) {
			out.println("<a href=./Book_Search.jsp?pageNo=" + endPageNum + ">[next]</a>&nbsp;" );
		}

        conn.close();

%>
</body>
</html>