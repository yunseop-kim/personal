#include "KHead.h"

Node* Kmeans_CreateNode(double d[])
{
	Node* NewNode = (Node*)malloc(sizeof(Node));
	for(int i = 0 ; i < MAX_DIMENSION ; i++){
		NewNode->Data[i] = d[i];
	}
	NewNode->num = -1 ;
	NewNode->weight = 1 ;
	NewNode->NextNode = NULL;	//다음 노드에 대한 포인터는 NULL로 초기화한다.

	return NewNode;				//노드의 주소를 반환한다.
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
	Node* candidateNode;	//후보 노드
	Node* CandidateList;	//후보 노드 리스트, 클러스터에 삽입된 노드를 제외한 모든 노드들
	double oldAvgDistance = 0 , newAvgDistance;	//평균 거리값 계산용 변수

	for(int i = 0 ; i < MAX_CLUSTER ; i++){
		Node* CandidateList = *Sample;

		while(CandidateList != NULL){
			candidateNode = Kmeans_getNearestCluster(Cluster[i], CandidateList);	//센터값과 가장 가까운 클러스터를 후보 카테고리에 삽입
			newAvgDistance = calcDefferent(Cluster, candidateNode, i);	//새로운 평균값 계산
			if(oldAvgDistance < newAvgDistance){	//새 평균값이 지난 평균값보다 크면
				Kmeans_ReplaceCenter(&Cluster[i], Sample, candidateNode);	//클러스터 값, 센터 값을 현재 후보 카테고리에 삽입된 클러스터와 교체)
				CandidateList = *Sample;
				oldAvgDistance = newAvgDistance;	//새로운 평균 거리값 갱신
			}
			CandidateList = CandidateList->NextNode;
		}
	}
}

Node* Kmeans_getNearestCluster(Node* Cluster, Node* Sample){
	Node* Restore;
	double newDistance , oldDistance = 1000 ;

	newDistance = Kmeans_ComputeDistance(Cluster, Sample);

	if(newDistance < oldDistance){	//oldDistance와 비교해서 그 거리 값이 작으면
		Restore = Sample;			//반환할 노드에 저장
		oldDistance = newDistance;	//최소거리값 교체
	}
	
	return Restore;	// 반환값 교체
}

double calcDefferent(Node* Cluster[], Node* candidateCategory, int k){
	double totalDist = 0.0;
	//1. 중심들간의 평균 벡터를 구한다
	double dSUM[MAX_DIMENSION];
	Node* AvgVector =  (Node*)malloc(sizeof(Node));
	//벡터의 합을 담을 변수 초기화
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
	//클러스터 값, 즉 초기 중심 센터 값을 현재 후보 카테고리에 삽입된 클러스터와 교체)
	//Current는 Cluster에 다시 넣고, candidateNode가 CandidateList(Sample)에 삽입 된다.
	//클러스터의 중심 값이 후보 리스트에 다시 등록되고
	//후보 리스트에서 선출된 노드를 후보 리스트에서 뽑아낸다.
	Node* pClusterList = *ClusterList;

	SLL_AppendNode(ClusterList, candidateNode);
	SLL_RemoveNode(CandidateList, candidateNode);
	candidateNode->NextNode = NULL;
	SLL_AppendNode(CandidateList, pClusterList);
	SLL_RemoveNode(ClusterList, pClusterList);
	pClusterList->NextNode = NULL;

}

//앞으로 만들어야 할 함수
//센터값 계산, 최단거리 삽입, 최종 클러스터링(노드별 거리 비교해서 클러스터간 이동하는거)

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
				//Centroid 값과 가장 가까운 점 p를 해당 클러스터로 이동
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
				//변동 없을 시
				{
					break;
				}
				else if(Kmeans_GetMin(dCent) == Kmeans_ComputeDistance(Centroid[k], p)){
					//변동 있을 시
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
			fprintf(fp, "%d번 클러스터링 %d차원 값\n", i, j);
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
		if(Kmeans_ExistToday(Cluster[i]) == false){	// 노드에 당일차 데이터가 없으면 -> 웨이트를 0.9를 곱한다.
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