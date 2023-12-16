import { ServiceBase } from './serviceBase';
import { TodoCondition as Condition } from '../conditions/todoCondition';
import { Todo as Entity } from '../../entities/todo';
import { TodoCollection as Collection } from '../collections/todoCollection';
import { TodoRepository as Repository } from '../repositories/todoRepository';

export class TodoService extends ServiceBase<Condition, Entity, Collection, Repository> {
}