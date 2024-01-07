import { Construct } from 'constructs';
import { buildTodosTable } from './todosTable';
import { buildSequenceTable } from './sequenceTable';
import { buildUsersTable } from './usersTable';

export const dynamoTables = (scope: Construct) => {
  const sequenceTable = buildSequenceTable(scope);
  const todosTable = buildTodosTable(scope);
  const usersTable = buildUsersTable(scope);

  return { 
    sequenceTable, 
    todosTable,
    usersTable,
   }
}