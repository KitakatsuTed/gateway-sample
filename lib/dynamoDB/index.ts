import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { buildTodosTable } from './todosTable';
import { buildSequenceTable } from './sequenceTable';

export const dynamoTables = (scope: Construct) => {
  const sequenceTable = buildSequenceTable(scope);
  const todosTable = buildTodosTable(scope);

  return { sequenceTable, todosTable }
}