<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<%@ page import="org.apache.commons.lang3.StringUtils"%>
<%@ page import="org.apache.http.impl.client.BasicResponseHandler"%>
<%@ page import="org.apache.http.impl.client.DefaultHttpClient"%>
<%@ page import="org.apache.http.client.methods.HttpGet"%>
<%
	String appKey = "your app key";
	String appSecret = "your app secret";
	String code 			= request.getParameter("code");
	String errorReason 		= request.getParameter("error_reason");
	String error 			= request.getParameter("error");
	String errorDescription = request.getParameter("error_description");
	
	String accesstoken = "";
	String result	   = "";

	if( StringUtils.isNotEmpty(code) ) {
		HttpGet get = new HttpGet("https://graph.facebook.com/oauth/access_token"+
        		"?client_id="+appKey+
        		"&client_secret="+appSecret+
        		"&redirect_uri=http://www.hellowd.com/snslink/facebook_step2.jsp" +
        		"&code="+code);
		
		DefaultHttpClient http = new DefaultHttpClient();
        result = http.execute(get, new BasicResponseHandler());
		
        accesstoken = result.substring(result.indexOf("=")+1);
	}
%>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>facebook</title>
</head>
<body>
access token : <%= accesstoken %>
</body>
</html>