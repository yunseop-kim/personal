#include "KHead.h"

Node* Kmeans_CreateNode(double d[])
{
	Node* NewNode = (Node*)malloc(sizeof(Node));
	for(int i = 0 ; i < MAX_DIMENSION ; i++){
		NewNode->Data[i] = d[i];
	}
	NewNode->num = -1 ;
	NewNode->weight = 1 ;
	NewNode->NextNode = NULL;	//���� ��忡 ���� �����ʹ� NULL�� �ʱ�ȭ�Ѵ�.

	return NewNode;				//����� �ּҸ� ��ȯ�Ѵ�.
}

void Kmeans_Initialization(Node* Cluster[], Node* Centroid[]){
	for(int i = 0 ; i < MAX_CLUSTER ; i++){
		Cluster[i] = NULL;
		Centroid[i] = (Node*)malloc(sizeof(Node));
		Centroid[i]->num = -1 ;
		Centroid[i]->NextNode = NULL;
	}
}

void Kmeans_Numbering(Node *Sample){
	Node *p = Sample;
	int num = 1;

	while(p != NULL){
		p->num = num;
		p->day = CurrentDays;
		num++;
		p = p->NextNode;
	}
}

void Kmeans_PrintList(Node* List)
{

	Node* Current = List;

	while (Current != NULL)
	{
		printf("No. %d : \t", Current->num);
		printf("Days : %d \t", Current->day);
		printf("Weight : %.1f \t", Current->weight);
		for(int i = 0 ; i < MAX_DIMENSION ; i++){
			printf("|%.3f	", Current->Data[i]);
		}
		Current = Current->NextNode;
	printf("\n");
	
	}
}

void Kmeans_PrintListwithAverage(Node* List)
{

	Node* Current = List;

	while (Current != NULL)
	{
		for(int i = 0 ; i < MAX_DIMENSION ; i++){
			printf("|%.3f	", Current->Data[i]);
		}

		//Kmeans_PrintAverage(Current);
		Current = Current->NextNode;
	printf("\n");
	
	}
}

void Kmeans_TransferNode(Node** List, Node** List2, Node* TransferNode){
	//Node* pList1 = *List;
	//Node* pList2 = *List2;

	SLL_RemoveNode(List, TransferNode);
	TransferNode->NextNode = NULL;
	SLL_AppendNode(List2, TransferNode);
}

void Kmeans_ReadVector(Node** Sample, FILE *fp){
	
	char s[MAX_COLS] ;
	char seps[] = "(), |\t\n";
	char *token;
	double data[MAX_DIMENSION];

	while(fgets(s, MAX_COLS, fp) != NULL){

		token = strtok(s, seps);

		while(token != NULL){
			for(int i = 0 ; i < MAX_DIMENSION ; i ++){
				data[i] = atof(token);
				token = strtok(NULL, seps);
			}
			SLL_AppendNode(Sample, Kmeans_CreateNode(data));
		}
	
	}
	fclose(fp);
}

void Kmeans_GetRandom(Node** Sample, Node* Cluster[]){
	srand(time(NULL));
	int getRand ;
	
	Node* Current = *Sample;
	Node* getCentroid[MAX_CLUSTER];
	int Count = SLL_GetNodeCount(Current);
	
	for(int i = 0 ; i < MAX_CLUSTER ; i++){
		getRand = rand() % Count-- ;
		getCentroid[i] = SLL_GetNodeAt(Current, getRand);
		SLL_RemoveNode(Sample, getCentroid[i]);
		getCentroid[i]->NextNode = NULL;
		Cluster[i] = getCentroid[i];
	}
}
void Kmeans_SetRandom(Node** Sample, Node* Cluster[]){
	int setnum[3] = {28, 80, 4};
	Node* Current = *Sample;
	Node* getCentroid[MAX_CLUSTER];
	int Count = SLL_GetNodeCount(Current);
	
	for(int i = 0 ; i < MAX_CLUSTER ; i++){
		getCentroid[i] = SLL_GetNodeAt(Current, setnum[i]);
		SLL_RemoveNode(Sample, getCentroid[i]);
		getCentroid[i]->NextNode = NULL;
		Cluster[i] = getCentroid[i];
	}
}
double Kmeans_ComputeDistance(Node* p, Node* q){
	double distance;
	double dData[MAX_DIMENSION];
	double sum = 0 ;

	for(int i = 0 ; i < MAX_DIMENSION ; i++){
		dData[i] = p->Data[i] - q->Data[i];
		sum += dData[i] * dData[i] ;
	}
	
	distance = sqrt(sum);

	return distance;
}

void Kmeans_centerModifyByAverageDistance(Node** Sample, Node* Cluster[]){
	Node* candidateNode;	//�ĺ� ���
	Node* CandidateList;	//�ĺ� ��� ����Ʈ, Ŭ�����Ϳ� ���Ե� ��带 ������ ��� ����
	double oldAvgDistance = 0 , newAvgDistance;	//��� �Ÿ��� ���� ����

	for(int i = 0 ; i < MAX_CLUSTER ; i++){
		Node* CandidateList = *Sample;

		while(CandidateList != NULL){
			candidateNode = Kmeans_getNearestCluster(Cluster[i], CandidateList);	//���Ͱ��� ���� ����� Ŭ�����͸� �ĺ� ī�װ����� ����
			newAvgDistance = calcDefferent(Cluster, candidateNode, i);	//���ο� ��հ� ���
			if(oldAvgDistance < newAvgDistance){	//�� ��հ��� ���� ��հ����� ũ��
				Kmeans_ReplaceCenter(&Cluster[i], Sample, candidateNode);	//Ŭ������ ��, ���� ���� ���� �ĺ� ī�װ����� ���Ե� Ŭ�����Ϳ� ��ü)
				CandidateList = *Sample;
				oldAvgDistance = newAvgDistance;	//���ο� ��� �Ÿ��� ����
			}
			CandidateList = CandidateList->NextNode;
		}
	}
}

Node* Kmeans_getNearestCluster(Node* Cluster, Node* Sample){
	Node* Restore;
	double newDistance , oldDistance = 1000 ;

	newDistance = Kmeans_ComputeDistance(Cluster, Sample);

	if(newDistance < oldDistance){	//oldDistance�� ���ؼ� �� �Ÿ� ���� ������
		Restore = Sample;			//��ȯ�� ��忡 ����
		oldDistance = newDistance;	//�ּҰŸ��� ��ü
	}
	
	return Restore;	// ��ȯ�� ��ü
}

double calcDefferent(Node* Cluster[], Node* candidateCategory, int k){
	double totalDist = 0.0;
	//1. �߽ɵ鰣�� ��� ���͸� ���Ѵ�
	double dSUM[MAX_DIMENSION];
	Node* AvgVector =  (Node*)malloc(sizeof(Node));
	//������ ���� ���� ���� �ʱ�ȭ
	for(int i = 0 ; i < MAX_DIMENSION ; i++){
		dSUM[i] = 0 ;
	}
	
	for(int i = 0 ; i < MAX_CLUSTER ; i++){
		for(int j = 0 ; j < MAX_DIMENSION ; j++){
			dSUM[j] += Cluster[i]->Data[j];
		}
	}
	for(int i = 0 ; i < MAX_DIMENSION ; i++){
		dSUM[i] /= MAX_CLUSTER;
		AvgVector->Data[i] = dSUM[i];
	}

	for(int i = 0 ; i < MAX_CLUSTER ; i++){
		totalDist += Kmeans_ComputeDistance(Cluster[i], AvgVector);
	}
	totalDist -= Kmeans_ComputeDistance(Cluster[k], AvgVector);
	totalDist += Kmeans_ComputeDistance(candidateCategory, AvgVector);

	free(AvgVector);

	return totalDist / MAX_CLUSTER ;
}

void Kmeans_ReplaceCenter(Node** ClusterList, Node** CandidateList, Node* candidateNode){
	//Ŭ������ ��, �� �ʱ� �߽� ���� ���� ���� �ĺ� ī�װ����� ���Ե� Ŭ�����Ϳ� ��ü)
	//Current�� Cluster�� �ٽ� �ְ�, candidateNode�� CandidateList(Sample)�� ���� �ȴ�.
	//Ŭ�������� �߽� ���� �ĺ� ����Ʈ�� �ٽ� ��ϵǰ�
	//�ĺ� ����Ʈ���� ����� ��带 �ĺ� ����Ʈ���� �̾Ƴ���.
	Node* pClusterList = *ClusterList;

	SLL_AppendNode(ClusterList, candidateNode);
	SLL_RemoveNode(CandidateList, candidateNode);
	candidateNode->NextNode = NULL;
	SLL_AppendNode(CandidateList, pClusterList);
	SLL_RemoveNode(ClusterList, pClusterList);
	pClusterList->NextNode = NULL;

}

//������ ������ �� �Լ�
//���Ͱ� ���, �ִܰŸ� ����, ���� Ŭ�����͸�(��庰 �Ÿ� ���ؼ� Ŭ�����Ͱ� �̵��ϴ°�)

void Kmeans_GetCentroidVector(Node** Centroid , Node** Cluster){
	Node *pCluster = NULL ;
	Node *pCentroid;
	
	double dSUM[MAX_DIMENSION];
	for(int cnt = 0 ; cnt < MAX_CLUSTER ; cnt++){
		pCentroid = Centroid[cnt];
		pCluster = Cluster[cnt] ;
		for(int i = 0 ; i < MAX_DIMENSION ; i++){
			dSUM[i] = 0 ;
		}

		double divSum = 0;

		while(pCluster != NULL){
			for(int i = 0 ; i < MAX_DIMENSION ; i++){
				dSUM[i] += pCluster->Data[i];
			}
			divSum += pCluster->weight;
			pCluster = pCluster->NextNode;
		}


		for(int i = 0 ; i < MAX_DIMENSION ; i++){
			dSUM[i] /= divSum;
			pCentroid->Data[i] = dSUM[i];
			pCentroid->weight = divSum;
		}	
	}
}
double Kmeans_GetMin(double pArr[])
{
	double min;
	
	min = pArr[0];
	
	for (int i = 1; i < MAX_CLUSTER ; i++)
	{
		if ( min > pArr[i] )
		{
			min = pArr[i];
		}
	}
	
	return min;
}
//#define min(a, b) (((a)>(b))?(a):(b))
void Kmeans_FindShortDistance(Node *Centroid[], Node *Cluster[], Node **Sample){
	Node *pSample = (*Sample);
	double dCent[MAX_CLUSTER];

	while(pSample != NULL){
		for(int i = 0 ; i < MAX_CLUSTER ; i++){
			dCent[i] = Kmeans_ComputeDistance(Centroid[i] , pSample);
		}
		for(int i = 0 ; i < MAX_CLUSTER ; i++){
			if(Kmeans_GetMin(dCent) == Kmeans_ComputeDistance(Centroid[i], pSample)){
				//Centroid ���� ���� ����� �� p�� �ش� Ŭ�����ͷ� �̵�
				Kmeans_TransferNode(Sample, &Cluster[i], pSample);
				Kmeans_GetCentroidVector(Centroid, Cluster);
			}
		}

		pSample = (*Sample);
	}
}

void Kmeans_FinalClustering(Node *Centroid[], Node *Cluster[]){
	
	double dCent[MAX_CLUSTER];

	for(int i = 0 ; i < MAX_CLUSTER ; i++){
		Node *p = Cluster[i];

		while(p != NULL){
			for(int j = 0 ; j < MAX_CLUSTER ; j++){
				dCent[j] = Kmeans_ComputeDistance(Centroid[j] , p);
			}
		
			for(int k = 0 ; k < MAX_CLUSTER ; k++){
				if((Kmeans_GetMin(dCent) == dCent[k]) && (Centroid[k] == Centroid[i]))
				//���� ���� ��
				{
					break;
				}
				else if(Kmeans_GetMin(dCent) == Kmeans_ComputeDistance(Centroid[k], p)){
					//���� ���� ��
					Kmeans_TransferNode(&Cluster[i], &Cluster[k], p);
					Kmeans_GetCentroidVector(Centroid, Cluster);
					break;
				}
				
			}
			p = p->NextNode;
		}
	}
}

void Kmeans_FilePrintf(Node *Cluster[], FILE* fp){
	Node *p;

	for(int j = 0 ; j < MAX_DIMENSION ; j++){
		for(int i = 0 ; i < MAX_CLUSTER ; i++){
			p = Cluster[i];
			fprintf(fp, "%d�� Ŭ�����͸� %d���� ��\n", i, j);
			while(p != NULL){
				fprintf(fp, "%f\n", p->Data[j]);
				p = p->NextNode;
			}
		}
	}
}

void Kmeans_AddWeight(Node* Cluster[]){
	Node *Current;

	for(int i = 0 ; i < MAX_CLUSTER ; i++){
		if(Kmeans_ExistToday(Cluster[i]) == false){	// ��忡 ������ �����Ͱ� ������ -> ����Ʈ�� 0.9�� ���Ѵ�.
			Current = Cluster[i];
			while(Current != NULL){
				if(Current->day < CurrentDays){
					Current->weight *= 0.9;
					for(int j = 0 ; j < MAX_DIMENSION ; j++){
						Current->Data[j] *= 0.9;
					}
				}
				Current = Current->NextNode;
			}
		}
	}
	CurrentDays++;
}

bool Kmeans_ExistToday(Node* Cluster){
	while(Cluster != NULL){
		if(Cluster->day == CurrentDays){
			return true;
		}else{
			Cluster = Cluster->NextNode;
		}
	}
	return false;
}