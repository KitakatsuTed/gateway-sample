import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';

// https://qiita.com/yamato1491038/items/f388afa3aa4f701321f5
const defaultOptions: Partial<dynamodb.TableProps> = {
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  // オンデマンド請求
  pointInTimeRecovery: true, // PITRを有効化
  timeToLiveAttribute: 'expired', // TTLの設定
  removalPolicy: cdk.RemovalPolicy.DESTROY, // cdk destroyでDB削除可
}

export const dynamoTables = (scope: Construct) => {
  const todosTalbe = new dynamodb.Table(scope, 'Sample-table', { // 'Sample-table'はStack内で一意
    ...defaultOptions,
    tableName: "todos", // テーブル名の定義
    partitionKey: { //パーティションキーの定義
      name: 'id',
      type: dynamodb.AttributeType.STRING, // typeはあとNumberとbinary
    },
    sortKey: { // ソートキーの定義
      name: 'name',
      type: dynamodb.AttributeType.STRING,
    },
  });

  return { todosTalbe }
}