#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <Windows.h>

// ������ ������ ���� 1���� �����ϰ� ��ȯ�ϴ� �Լ�
// n1 �� "���Ѱ�", n2 �� ���Ѱ�
int randomRange(int n1, int n2) {
  return (int) (rand() % (n2 - n1 + 1)) + n1;
}

void main(void){
	srand(GetTickCount()); // ���� �߻��� �ʱ�ȭ
	
	FILE *fp = fopen("a.txt", "w+");

	for(int i = 0 ; i < 10 ; i++){
		fprintf(fp, "(%d , %d) ", randomRange(26, 50) , randomRange(26, 50));
	}
	fclose(fp);
}