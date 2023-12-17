import { defaultOptions } from "./shared/defautlOptions";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

// テーブル名の定義
export const SEQUENCE_TABLE_NAME = 'sequence'

export const buildSequenceTable = (scope: Construct) => {
  // 第２引数はStack内で一意
  new dynamodb.Table(scope, 'sequence-table', {
    ...defaultOptions,
    tableName: SEQUENCE_TABLE_NAME,
    partitionKey: { //パーティションキーの定義
      name: 'id',
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: { // ソートキーの定義
      name: 'name',
      type: dynamodb.AttributeType.STRING,
    },
  });
} 