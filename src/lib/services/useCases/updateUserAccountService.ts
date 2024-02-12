import { UserAccount } from 'src/lib/entities/userAccount';
import { UserAccountService } from '../userAccountService';
import { UnprocessableEntityException } from 'src/lib/exceptions/UnprocessableEntityException';
import { NotFoundException } from 'src/lib/exceptions/NotFoundException';

interface IUpdateUserAccountParams {
  userAccountId: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

// 確認用メールの送信なども含めそうなのでServiceクラスとして実装する
export class UpdateUserAccountService {
  public async execute(params: IUpdateUserAccountParams): Promise<UserAccount> {
    if (params.password !== params.passwordConfirmation) {
      throw new UnprocessableEntityException('確認用のパスワードが違います');
    }

    const userAccountService = new UserAccountService();
    const userAccount = await userAccountService.findBy({
      id: params.userAccountId,
    });

    if (userAccount === undefined) {
      throw new NotFoundException(
        `Couldn't find UserAccount with ${params.userAccountId}`,
      );
    }

    userAccount.assignAttribute({
      email: params.email,
      password: params.password,
    });

    const res = await userAccountService.update(userAccount);

    if (res.entity.hasError()) {
      throw new UnprocessableEntityException(undefined, res.entity.errors);
    }

    return res.entity;
  }
}
