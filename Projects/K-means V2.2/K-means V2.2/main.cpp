#include "KHead.h"

void main( void )
{
	Node *Sample = NULL;
	Node *Cluster[MAX_CLUSTER];
	Node *Centroid[MAX_CLUSTER];
	Kmeans_Initialization(Cluster, Centroid);
	
	FILE *fp[3];
	fp[0] = fopen("1.txt", "r");
	fp[1] = fopen("2.txt", "r");
	fp[2] = fopen("3.txt", "r");

	// �ڷ� �б�
	Kmeans_ReadVector(&Sample, fp[0]);
	Kmeans_Numbering(Sample);
	printf("==============================\n");

	printf("���� ���� : \n");
	Kmeans_SetRandom(&Sample, Cluster);

	for(int i = 0 ; i < MAX_CLUSTER ; i++)
	{
		printf("Cluster[%d] : \n", i);
		Kmeans_PrintList(Cluster[i]);
	}
	printf("==============================\n");

	Kmeans_centerModifyByAverageDistance(&Sample, Cluster);
	printf("���� �� : \n");
	for(int i = 0 ; i < MAX_CLUSTER ; i++)
	{
		printf("Cluster[%d] : \n", i);
		Kmeans_PrintList(Cluster[i]);
	}
	printf("==============================\n");
	Kmeans_GetCentroidVector(Centroid, Cluster);
	printf("�ʱ� �߽� ��\n");
	for(int i = 0 ; i < MAX_CLUSTER ; i++)
	{
		printf("Centroid[%d] : \n", i);
		Kmeans_PrintList(Centroid[i]);
	}
	printf("==============================\n");
	printf("1�� Ŭ�����͸�\n");
	
	Kmeans_FindShortDistance(Centroid, Cluster, &Sample);
	Kmeans_AddWeight(Cluster);
	Kmeans_GetCentroidVector(Centroid, Cluster);
	Kmeans_FinalClustering(Centroid, Cluster);
	
	for(int i = 0 ; i < MAX_CLUSTER ; i++)
	{
		printf("Cluster[%d] : \n", i);
		Kmeans_PrintList(Cluster[i]);
		printf("Centroid[%d] : \n", i);
		Kmeans_PrintList(Centroid[i]);
	}
	//================================================================
	Kmeans_ReadVector(&Sample, fp[1]);
	Kmeans_Numbering(Sample);
	printf("1���� �ڷ� ����, Sample : \n");
		
	Kmeans_FindShortDistance(Centroid, Cluster, &Sample);
	Kmeans_AddWeight(Cluster);
	Kmeans_GetCentroidVector(Centroid, Cluster);
	Kmeans_FinalClustering(Centroid, Cluster);
	
	printf("==============================\n");
	for(int i = 0 ; i < MAX_CLUSTER ; i++)
	{	
		printf("Cluster[%d] : \n", i);
		Kmeans_PrintList(Cluster[i]);
		printf("Centroid[%d] : \n", i);
		Kmeans_PrintList(Centroid[i]);
	}
	printf("==============================\n");
	
	Kmeans_ReadVector(&Sample, fp[2]);
	Kmeans_Numbering(Sample);
	printf("2���� �ڷ� ����, Sample : \n");
		
	Kmeans_FindShortDistance(Centroid, Cluster, &Sample);
	Kmeans_AddWeight(Cluster);
	Kmeans_GetCentroidVector(Centroid, Cluster);
	Kmeans_FinalClustering(Centroid, Cluster);
	
	printf("==============================\n");
	for(int i = 0 ; i < MAX_CLUSTER ; i++)
	{	
		printf("Cluster[%d] : \n", i);
		Kmeans_PrintList(Cluster[i]);
		printf("Centroid[%d] : \n", i);
		Kmeans_PrintList(Centroid[i]);
	}
	printf("==============================\n");
		
}