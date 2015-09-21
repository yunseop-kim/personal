#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <Windows.h>

// 지정된 범위의 정수 1개를 램덤하게 반환하는 함수
// n1 은 "하한값", n2 는 상한값
int randomRange(int n1, int n2) {
  return (int) (rand() % (n2 - n1 + 1)) + n1;
}

void main(void){
	srand(GetTickCount()); // 난수 발생기 초기화
	
	FILE *fp = fopen("a.txt", "w+");

	for(int i = 0 ; i < 10 ; i++){
		fprintf(fp, "(%d , %d) ", randomRange(26, 50) , randomRange(26, 50));
	}
	fclose(fp);
}