<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<%
	String appKey 		= "160941607418292";
	String appSecret 	= "548be1aeb0520452c1fa0d2327c1efe7";
	
	String url = "http://www.facebook.com/dialog/oauth?client_id="+
		appKey+"&redirect_uri=http://www.hellowd.com/snslink/facebook_step2.jsp&scope=publish_stream,offline_access";
%>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>facebook</title>
<script type="text/javascript">
	function go() {
		window.location.href = '<%=url%>'
	}
</script>
</head>
<body>
<a href="#" onclick="go();">페이스북 OAuth 인증 시작 하기</a>
</body>
</html>