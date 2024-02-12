import { UserAccountService } from '../userAccountService';
import { UserService } from '../userService';
import { NotFoundException } from 'src/lib/exceptions/NotFoundException';

interface IDeleteUserAccountParams {
  userAccountId: string;
}

// 確認用メールの送信なども含めそうなのでServiceクラスとして実装する
export class DeleteUserAccountService {
  public async execute(params: IDeleteUserAccountParams): Promise<void> {
    const userAccountService = new UserAccountService();
    const userService = new UserService();
    const userAccount = await userAccountService.findBy({
      id: params.userAccountId,
    });
    const user = await userService.findBy({ id: userAccount?.id });

    if (userAccount === undefined) {
      throw new NotFoundException(
        `Couldn't find UserAccount with ${params.userAccountId}`,
      );
    }
    if (user === undefined) {
      throw new NotFoundException(`Couldn't find User with ${userAccount.id}`);
    }

    const userAccountDeleteQuery = userAccountService.buildDeleteQuery(userAccount);
    const userDeleteQuery = userService.buildDeleteQuery(user);

    await userAccountService.transactWrite(
      {
        TransactItems: [
          {
            Delete: userAccountDeleteQuery,
          },
          {
            Delete: userDeleteQuery,
          },
        ],
      }
    )
  }
}
