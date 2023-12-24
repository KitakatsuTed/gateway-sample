import { Construct } from 'constructs';
import { buildTodosTable } from './todosTable';
import { buildSequenceTable } from './sequenceTable';

export const dynamoTables = (scope: Construct) => {
  const sequenceTable = buildSequenceTable(scope);
  const todosTable = buildTodosTable(scope);

  return { sequenceTable, todosTable }
}