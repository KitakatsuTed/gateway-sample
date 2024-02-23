# 環境構築
1. AWS CDKをダウンロード(https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/getting_started.html)
2. AWSアカウントを用意
3. githubからコードをcloneする

```
git clone xxxx
```
4. パッケージインストール

```
npm install
```

5. cdkコマンドを実行。./lib以下を参照に自動で環境が構築されます
```
cdk deproy
```

コンソールに従ってコマンドを入力するとAWS上に以下のリソースができます
- DynamoDB
- Lambda
- Api Gateway
- Iamロール(Lambdaにあてがうサービスロール)
- CloudWatchロググループ(Lambdaの実行ログはこちらからチェック可能)

## 役立ちコマンド
- `npm run test` テスト実行(--silentオプションを使えばログ出力をなしで実行)
- `npm run lint` lint実行(--fixオプションを使えば自動修正)

## デプロイ

```
cdk deploy
```

## 実装詳細
### ミドルウェア

ミドルウェアに特化したmiddyというライブラリを利用。さらに横断的に利用するミドルウェア群を一元管理するためのmiddyfyという関数を用意。 
リクエストボディとレスポンスボディのバリデーション制御、リクエストボディのログ出力、エラーハンドリングを定義。

`src/lib/middleware/middy` 参照のこと。


### DBアクセス関数群のモジュール 

`src/lib/dynamodb/concerns/dynamodbAccessable.ts`

一般的に利用するCRUD操作をする際に、DynamoDBのクエリを構築する手間を省くためのライブラリ、ミックスインしてCRUD操作を拡張する。

#### 利用方法
1. 以下を用意する(todoやuserが接頭辞についたファイルを参照のこと)
`src/lib/dynamodb` にそれぞれ規定クラスがあるのでそれを継承すること
- テーブルスキーマを表現するEntityクラス
- DynamoDBとやりとりさせるRepositoryクラス 
- DynamoDBから取得した一覧データの格納するCollectionクラス
- リソースに対する業務ロジックを定義するServiceクラス

2. Serviceクラスに対してDynamodbAccessableをミックスインする

以下のようなイメージ。これでServiceクラスのインスタンスからDynamoDBへのクエリを自動で構築する処理が拡張される。

```Typescript
export class UserService extends DynamodbAccessable(
  ServiceBase<Entity, Collection, Repository> as Constructor<
    ServiceBase<Entity, Collection, Repository>
  >,
) {
  constructor(repository: Repository = new Repository(dynamodbClient)) {
    super(repository);
  }
}
```

3. 利用する

定義が済んだらあとは呼び出すだけ、Todoリソースならこんな感じでEntityクラスのインスタンスを用意して同じServiceクラスの関数に渡す。

この時createやupdateなどDB操作のクエリの場合は、内部で自動的にバリデーションをコールする。なお、バリデーションはEntityクラスで実装することになります。バリデーションに失敗した場合は、Entityクラスのerrorsプロパティにエラー内容がセットされます。

createやupdateのDB操作系については操作内容はEntityクラスのプロパティ値とEntityの規定クラスで定義されている、id、createdAt、updatedAtがそのままDynamoDBに反映されるイメージ感になります。(name:string, age:numberとかならこの2つがDBのカラムとして保存される)
idは自動採番、createdAtは保存時の時間、updatedAtは更新時の時間が自動で保存されるようになります。

つまりEntityクラスのプロパティ値がそのままテーブルスキーマとして定義される前提になります。(DynamoDBはスキーマレスが売りですが、それでもある程度のスキーマがあると嬉しいはず)

```
  const todo = new Todo(
    undefined,
    request.pathParameters.userId,
    request.body.status,
    request.body.title,
    request.body.describe,
    undefined,
  );
  const todoService = new TodoService();
  const res = await todoService.create(todo);
```

4. 他にも色々実装する

すでに実装されているuser、todoなどを参考に作成すると良いです。また、ミックスインしたくない場合は、そのまま自前での実装が可能です。
