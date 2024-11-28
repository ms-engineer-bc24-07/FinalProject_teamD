# 要件定義書

### 1. プロジェクト概要

**プロジェクト名**   
片付け間違い探しアプリ（仮）

**目的**
- 家事負担を軽減し、家庭が安定した満足度の高い場所となるようサポートすることで、女性のクオリティ・オブ・ライフを向上させ、社会でのパフォーマンス向上に繋げる。
- 家事に対して支援意欲があっても関与できない状況を解消し、円滑な家事分担と協働体制の構築を促進する。
- 家事参加の心理的ハードルを低減し、家族やメンバー全員が自発的に家事に関わる環境を提供する。
- 家事の依頼者が近くにいない状況でも、実施者が自立的に家事を完了できる環境を提供し、効率的な家事運営を実現する


**背景**  
  現代の家庭では、家事の負担が特定のメンバーに偏りがちで、家事を担当する人が増えても、家庭内でのタスクの分担がうまくいかないケースが多い。また、家事を手伝いたいと思っていても、どう関与すればよいのかが分からないという問題も発生している。  
  さらに、従来の家事管理方法では、依頼者と実施者のコミュニケーション不足や、進捗確認が手間となるため、家事を円滑に進めることが困難であった。これにより、家庭内での居心地が悪くなり、QOL（クオリティ・オブ・ライフ）の低下を招いている。  
  特に、女性にとっては家事や育児の負担が大きく、家庭内での満足度が低下すると、社会でのパフォーマンスにも影響を与える。家庭が安定して満足度の高い場所であることが、仕事や社会活動でのパフォーマンス向上に繋がるため、家庭内のタスク管理を効率化し、より多くの人が積極的に家事に関与できる仕組みが求められている。  
  このような背景の中、家事をスムーズに分担し、家事参加の心理的ハードルを下げることができるテクノロジーの導入が、女性のQOL向上や社会でのパフォーマンス向上に貢献することが期待されている。

**システム構成図**  
（システム概要図を添付する）

**ターゲットユーザ**  
家族や同居人がいるユーザー

### 2. 機能要件
| 機能カテゴリ             | サブカテゴリ               | 機能内容                                                              |
| ---------------------- | ------------------------ | -------------------------------------------------------------------- |
| ユーザ管理           　  | ユーザ登録               　| ユーザ登録               　　　　　　　　                                |
|                      　| ユーザ編集                 | ユーザ編集                                                             |
|                      　| ユーザ削除                 | ユーザ削除                                                             |
|                      　| 家族メンバー一覧表示         | 家族のメンバーを一覧表示                                                 |
|                      　| 家族メンバー招待            | 家族のメンバーとして招待する機能                                          |
|                      　| 家族メンバー削除            | 家族を招待する機能                                                      |
| ログイン /  ログアウト    | ログイン                  | ユーザ名とパスワードで認証                                                |
|                      　| ログアウト                 | ログアウト                                                             |
| 片付けカテゴリー管理      | カテゴリー一覧表示          | 家族で共有するお片付けカテゴリー（場所）の一覧表示                           |
|                      　| カテゴリー登録              | カテゴリー名とお片付けの見本画像の登録                                     |
|                      　| カテゴリー編集              | お片付けの見本の変更                                                    |
|                      　| カテゴリー削除              | カテゴリーの削除                                                       |
| 片付け管理             　| 依頼一覧表示               | お片付け依頼を一覧表示                                                  |
|                      　| 依頼登録            　     | お片付け依頼の登録                                       　　           |
|                      　| 依頼編集            　     | お片付け依頼の編集（片付け完了画像）               　　　　　　　　　　　　　  |
|                      　| 依頼削除            　     | お片付け依頼の削除                                       　　           |
| 片付け評価              | スコア表示            　    | 見本画像と片付け完了画像と比較してスコアを表示               　　            |
| メッセージ管理           |                     　    | メッセージの送受信   　　　　　　　　　　　　　            　　             |
| タイマー機能             |                      　   | タイマーの開始、終了   　　　　　　　　　　　　            　　             |

### 3. 非機能要件
| 項目 | 内容 |
| --- | --- |
| パフォーマンス |    |
| スケーラビリティ |    |
| 可用性 |    |
| セキュリティ |    |
| ユーザビリティ |     |

### 4. 技術スタック
| 項目 | 内容 |
| --- | --- |
| フロントエンド技術 | Next.js　Tailwind CSS　Typescript　axios |
| バックエンド技術   | Django OpenCV TensorFlow                |
| データベース      | PostgreSQL                              |
| 認証機能         | Firebase                                |

### 5. システムアーキテクチャ


### 6. プロジェクト管理
| 項目 | 内容 |
| --- | --- |
| プロジェクト準備と基本設計         | 2024/11/04 ~ 2024/11/10 |
| アプリ基盤作成                   | 2024/11/21 ~ 2024/11/24 |
| 基本機能の実装                   | 2024/11/21 ~ 2024/11/25 |
| 片付け後の写真登録とスコアリング機能 | 2024/11/25 ~ 2024/12/01 |
| 依頼機能とリアクション機能         | 2024/12/02 ~ 2024/12/08 |
| 全体統合とテスト                 | 2024/12/09 ~ 2024/12/15 |
| アプリ発表会                     | 2024/12/16 |

### 7.　テスト計画

### 8. 参考資料

### 9. 各種設計図
- [画面遷移図](https://www.figma.com/design/UzCCfrcj7yaBEjDEQepXvT/%E6%9C%80%E7%B5%82%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88teamD?node-id=0-1&node-type=canvas)
- [UI設計書](https://www.figma.com/design/UzCCfrcj7yaBEjDEQepXvT/%E6%9C%80%E7%B5%82%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88teamD?node-id=15-11&node-type=canvas)
- [DB設計書](https://docs.google.com/spreadsheets/d/18s9qLAAu_rFCwXT6zEJl4MGrQP_dRAaxIl-q380a_dg/edit?hl=ja&gid=0#gid=0)
- [ER図](https://drawsql.app/teams/nino-8/diagrams/image-analysis-app)

### 10. コミットメッセージのルール
| 種類 | 説明 | 使用例 |
| --- | --- | --- |
| add    | 新機能の追加           | ユーザー登録機能を追加                 |
| update | 機能修正              | ログイン画面のデザインを調整            |
| fix    | バグ修正              | ログイン時に発生する500エラーを修正      |
| docs   | ドキュメントを変更      | コミットメッセージのルールをREADMEに追加 |
| remove | ファイル削除           | 不要なテストデータファイルを削除         |
| style  | コードのフォーマット変更 | 不要なスペースと改行を削除              |
| test   | テスト追加や修正        | ユーザー登録機能の単体テストを追加       |

### 11. プルリクのテンプレート
```
## 概要
<!-- この変更の概要を簡単に記載してください -->

## 変更内容
<!-- 具体的に何を変更したか記載してください -->

## 確認事項
- [ ] テストがすべて成功していること
- [ ] コードレビューを依頼する前にセルフレビューを行ったこと

## 影響範囲
<!-- この変更が影響を与える可能性のある範囲や機能を記載してください -->

## 備考
<!-- その他、レビューする上で注意してほしいことなど -->
```

### 12. issueのテンプレート