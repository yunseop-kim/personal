#ifndef KHEAD_H
#define KHEAD_H

#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define MAX_CLUSTER 3 //클러스터의 개수
#define MAX_COLS 32767
#define MAX_DIMENSION 2

typedef struct tagNode{
	int num;	int day;	double weight;
	double Data[MAX_DIMENSION];
	struct tagNode* NextNode ;
} Node;

static int CurrentDays = 1;

/* 함수 원형 선언 */
//Node* SLL_CreateNode(ElementType NewData);
void  SLL_DestroyNode(Node* Node);
void  SLL_AppendNode(Node** Head, Node* NewNode);
void  SLL_InsertAfter(Node* Current, Node* NewNode);
void  SLL_InsertNewHead(Node** Head, Node* NewHead);
void  SLL_RemoveNode(Node** Head, Node* Remove);
Node* SLL_GetNodeAt(Node* Head, int Location);
int   SLL_GetNodeCount(Node* Head);

Node* Kmeans_CreateNode(double d[]);
void Kmeans_Initialization(Node* Cluster[], Node* Centroid[]);
void Kmeans_Numbering(Node *Sample);
void Kmeans_PrintList(Node* List);
void Kmeans_PrintListwithAverage(Node* List);
void Kmeans_TransferNode(Node** List, Node** List2, Node* TransferNode);
void Kmeans_ReadVector(Node** Sample, FILE *fp);
void Kmeans_GetRandom(Node** Sample, Node* Cluster[]);
void Kmeans_SetRandom(Node** Sample, Node* Cluster[]);
double Kmeans_ComputeDistance(Node* p, Node* q);
void Kmeans_centerModifyByAverageDistance(Node** Sample, Node* Cluster[]);
Node* Kmeans_getNearestCluster(Node* Centroid, Node* Sample);
double calcDefferent(Node* Cluster[], Node* candidateCategory, int k);
void Kmeans_ReplaceCenter(Node** ClusterList, Node** CandidateList, Node* candidateCategory);

void Kmeans_GetCentroidVector(Node** Centroid , Node** Cluster);
double Kmeans_GetMin(double pArr[]);
void Kmeans_FindShortDistance(Node *Centroid[], Node *Cluster[], Node **Sample);
void Kmeans_FinalClustering(Node *Centroid[], Node *Cluster[]);

void Kmeans_FilePrintf(Node *Cluster[], FILE* fp);

void Kmeans_AddWeight(Node* Cluster[]);
bool Kmeans_ExistToday(Node* Cluster);

#endif