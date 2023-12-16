import { ServiceBase } from './serviceBase';
import { TodoCondition as Condition } from '../conditions/todoCondition';
import { Todo as Entity } from '../../entities/todo';
import { TodoCollection as Collection } from '../collections/todoCollection';
import { TodoRepository as Repository } from '../repositories/todoRepository';
import { DynamodbAccessable } from '../concerns/dynamodbAccessable';

// DynamodbAccessableは、pluggableな脱着可能なmixinモジュールなのでプロジェクトの途中からでも導入可能なはず
// 気に入らなければ自前でDynamoDBとの疎通処理を作れば良い
@DynamodbAccessable
export class TodoService extends ServiceBase<Condition, Entity, Collection, Repository> {
}