/**
 * This was generated using GraphQL-codegen!
 */
import {GraphQLClient} from 'graphql-request'
import * as Dom from 'graphql-request/dist/types.dom'
import {gql} from 'graphql-request'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  bigint: any
  timestamptz: any
  uuid: any
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>
  _gt?: InputMaybe<Scalars['Int']>
  _gte?: InputMaybe<Scalars['Int']>
  _in?: InputMaybe<Array<Scalars['Int']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['Int']>
  _lte?: InputMaybe<Scalars['Int']>
  _neq?: InputMaybe<Scalars['Int']>
  _nin?: InputMaybe<Array<Scalars['Int']>>
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>
  _gt?: InputMaybe<Scalars['String']>
  _gte?: InputMaybe<Scalars['String']>
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>
  _in?: InputMaybe<Array<Scalars['String']>>
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>
  _is_null?: InputMaybe<Scalars['Boolean']>
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>
  _lt?: InputMaybe<Scalars['String']>
  _lte?: InputMaybe<Scalars['String']>
  _neq?: InputMaybe<Scalars['String']>
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>
  _nin?: InputMaybe<Array<Scalars['String']>>
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>
}

/** columns and relationships of "accounts" */
export type Accounts = {
  __typename?: 'accounts'
  access_token?: Maybe<Scalars['String']>
  expires_at?: Maybe<Scalars['bigint']>
  id: Scalars['uuid']
  id_token?: Maybe<Scalars['String']>
  oauth_token?: Maybe<Scalars['String']>
  oauth_token_secret?: Maybe<Scalars['String']>
  provider: Scalars['String']
  providerAccountId: Scalars['String']
  refresh_token?: Maybe<Scalars['String']>
  refresh_token_expires_in?: Maybe<Scalars['Int']>
  scope?: Maybe<Scalars['String']>
  session_state?: Maybe<Scalars['String']>
  token_type?: Maybe<Scalars['String']>
  type: Scalars['String']
  /** An object relationship */
  user: Users
  userId: Scalars['uuid']
}

/** aggregated selection of "accounts" */
export type Accounts_Aggregate = {
  __typename?: 'accounts_aggregate'
  aggregate?: Maybe<Accounts_Aggregate_Fields>
  nodes: Array<Accounts>
}

/** aggregate fields of "accounts" */
export type Accounts_Aggregate_Fields = {
  __typename?: 'accounts_aggregate_fields'
  avg?: Maybe<Accounts_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Accounts_Max_Fields>
  min?: Maybe<Accounts_Min_Fields>
  stddev?: Maybe<Accounts_Stddev_Fields>
  stddev_pop?: Maybe<Accounts_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Accounts_Stddev_Samp_Fields>
  sum?: Maybe<Accounts_Sum_Fields>
  var_pop?: Maybe<Accounts_Var_Pop_Fields>
  var_samp?: Maybe<Accounts_Var_Samp_Fields>
  variance?: Maybe<Accounts_Variance_Fields>
}

/** aggregate fields of "accounts" */
export type Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "accounts" */
export type Accounts_Aggregate_Order_By = {
  avg?: InputMaybe<Accounts_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Accounts_Max_Order_By>
  min?: InputMaybe<Accounts_Min_Order_By>
  stddev?: InputMaybe<Accounts_Stddev_Order_By>
  stddev_pop?: InputMaybe<Accounts_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Accounts_Stddev_Samp_Order_By>
  sum?: InputMaybe<Accounts_Sum_Order_By>
  var_pop?: InputMaybe<Accounts_Var_Pop_Order_By>
  var_samp?: InputMaybe<Accounts_Var_Samp_Order_By>
  variance?: InputMaybe<Accounts_Variance_Order_By>
}

/** input type for inserting array relation for remote table "accounts" */
export type Accounts_Arr_Rel_Insert_Input = {
  data: Array<Accounts_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_On_Conflict>
}

/** aggregate avg on columns */
export type Accounts_Avg_Fields = {
  __typename?: 'accounts_avg_fields'
  expires_at?: Maybe<Scalars['Float']>
  refresh_token_expires_in?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "accounts" */
export type Accounts_Avg_Order_By = {
  expires_at?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "accounts". All fields are combined with a logical 'AND'. */
export type Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Bool_Exp>>
  _not?: InputMaybe<Accounts_Bool_Exp>
  _or?: InputMaybe<Array<Accounts_Bool_Exp>>
  access_token?: InputMaybe<String_Comparison_Exp>
  expires_at?: InputMaybe<Bigint_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  id_token?: InputMaybe<String_Comparison_Exp>
  oauth_token?: InputMaybe<String_Comparison_Exp>
  oauth_token_secret?: InputMaybe<String_Comparison_Exp>
  provider?: InputMaybe<String_Comparison_Exp>
  providerAccountId?: InputMaybe<String_Comparison_Exp>
  refresh_token?: InputMaybe<String_Comparison_Exp>
  refresh_token_expires_in?: InputMaybe<Int_Comparison_Exp>
  scope?: InputMaybe<String_Comparison_Exp>
  session_state?: InputMaybe<String_Comparison_Exp>
  token_type?: InputMaybe<String_Comparison_Exp>
  type?: InputMaybe<String_Comparison_Exp>
  user?: InputMaybe<Users_Bool_Exp>
  userId?: InputMaybe<Uuid_Comparison_Exp>
}

/** unique or primary key constraints on table "accounts" */
export type Accounts_Constraint =
  /** unique or primary key constraint */
  'accounts_pkey'

/** input type for incrementing numeric columns in table "accounts" */
export type Accounts_Inc_Input = {
  expires_at?: InputMaybe<Scalars['bigint']>
  refresh_token_expires_in?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "accounts" */
export type Accounts_Insert_Input = {
  access_token?: InputMaybe<Scalars['String']>
  expires_at?: InputMaybe<Scalars['bigint']>
  id?: InputMaybe<Scalars['uuid']>
  id_token?: InputMaybe<Scalars['String']>
  oauth_token?: InputMaybe<Scalars['String']>
  oauth_token_secret?: InputMaybe<Scalars['String']>
  provider?: InputMaybe<Scalars['String']>
  providerAccountId?: InputMaybe<Scalars['String']>
  refresh_token?: InputMaybe<Scalars['String']>
  refresh_token_expires_in?: InputMaybe<Scalars['Int']>
  scope?: InputMaybe<Scalars['String']>
  session_state?: InputMaybe<Scalars['String']>
  token_type?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>
  userId?: InputMaybe<Scalars['uuid']>
}

/** aggregate max on columns */
export type Accounts_Max_Fields = {
  __typename?: 'accounts_max_fields'
  access_token?: Maybe<Scalars['String']>
  expires_at?: Maybe<Scalars['bigint']>
  id?: Maybe<Scalars['uuid']>
  id_token?: Maybe<Scalars['String']>
  oauth_token?: Maybe<Scalars['String']>
  oauth_token_secret?: Maybe<Scalars['String']>
  provider?: Maybe<Scalars['String']>
  providerAccountId?: Maybe<Scalars['String']>
  refresh_token?: Maybe<Scalars['String']>
  refresh_token_expires_in?: Maybe<Scalars['Int']>
  scope?: Maybe<Scalars['String']>
  session_state?: Maybe<Scalars['String']>
  token_type?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  userId?: Maybe<Scalars['uuid']>
}

/** order by max() on columns of table "accounts" */
export type Accounts_Max_Order_By = {
  access_token?: InputMaybe<Order_By>
  expires_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  id_token?: InputMaybe<Order_By>
  oauth_token?: InputMaybe<Order_By>
  oauth_token_secret?: InputMaybe<Order_By>
  provider?: InputMaybe<Order_By>
  providerAccountId?: InputMaybe<Order_By>
  refresh_token?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
  scope?: InputMaybe<Order_By>
  session_state?: InputMaybe<Order_By>
  token_type?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
  userId?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Accounts_Min_Fields = {
  __typename?: 'accounts_min_fields'
  access_token?: Maybe<Scalars['String']>
  expires_at?: Maybe<Scalars['bigint']>
  id?: Maybe<Scalars['uuid']>
  id_token?: Maybe<Scalars['String']>
  oauth_token?: Maybe<Scalars['String']>
  oauth_token_secret?: Maybe<Scalars['String']>
  provider?: Maybe<Scalars['String']>
  providerAccountId?: Maybe<Scalars['String']>
  refresh_token?: Maybe<Scalars['String']>
  refresh_token_expires_in?: Maybe<Scalars['Int']>
  scope?: Maybe<Scalars['String']>
  session_state?: Maybe<Scalars['String']>
  token_type?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  userId?: Maybe<Scalars['uuid']>
}

/** order by min() on columns of table "accounts" */
export type Accounts_Min_Order_By = {
  access_token?: InputMaybe<Order_By>
  expires_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  id_token?: InputMaybe<Order_By>
  oauth_token?: InputMaybe<Order_By>
  oauth_token_secret?: InputMaybe<Order_By>
  provider?: InputMaybe<Order_By>
  providerAccountId?: InputMaybe<Order_By>
  refresh_token?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
  scope?: InputMaybe<Order_By>
  session_state?: InputMaybe<Order_By>
  token_type?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
  userId?: InputMaybe<Order_By>
}

/** response of any mutation on the table "accounts" */
export type Accounts_Mutation_Response = {
  __typename?: 'accounts_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Accounts>
}

/** on_conflict condition type for table "accounts" */
export type Accounts_On_Conflict = {
  constraint: Accounts_Constraint
  update_columns?: Array<Accounts_Update_Column>
  where?: InputMaybe<Accounts_Bool_Exp>
}

/** Ordering options when selecting data from "accounts". */
export type Accounts_Order_By = {
  access_token?: InputMaybe<Order_By>
  expires_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  id_token?: InputMaybe<Order_By>
  oauth_token?: InputMaybe<Order_By>
  oauth_token_secret?: InputMaybe<Order_By>
  provider?: InputMaybe<Order_By>
  providerAccountId?: InputMaybe<Order_By>
  refresh_token?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
  scope?: InputMaybe<Order_By>
  session_state?: InputMaybe<Order_By>
  token_type?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
  user?: InputMaybe<Users_Order_By>
  userId?: InputMaybe<Order_By>
}

/** primary key columns input for table: accounts */
export type Accounts_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "accounts" */
export type Accounts_Select_Column =
  /** column name */
  | 'access_token'
  /** column name */
  | 'expires_at'
  /** column name */
  | 'id'
  /** column name */
  | 'id_token'
  /** column name */
  | 'oauth_token'
  /** column name */
  | 'oauth_token_secret'
  /** column name */
  | 'provider'
  /** column name */
  | 'providerAccountId'
  /** column name */
  | 'refresh_token'
  /** column name */
  | 'refresh_token_expires_in'
  /** column name */
  | 'scope'
  /** column name */
  | 'session_state'
  /** column name */
  | 'token_type'
  /** column name */
  | 'type'
  /** column name */
  | 'userId'

/** input type for updating data in table "accounts" */
export type Accounts_Set_Input = {
  access_token?: InputMaybe<Scalars['String']>
  expires_at?: InputMaybe<Scalars['bigint']>
  id?: InputMaybe<Scalars['uuid']>
  id_token?: InputMaybe<Scalars['String']>
  oauth_token?: InputMaybe<Scalars['String']>
  oauth_token_secret?: InputMaybe<Scalars['String']>
  provider?: InputMaybe<Scalars['String']>
  providerAccountId?: InputMaybe<Scalars['String']>
  refresh_token?: InputMaybe<Scalars['String']>
  refresh_token_expires_in?: InputMaybe<Scalars['Int']>
  scope?: InputMaybe<Scalars['String']>
  session_state?: InputMaybe<Scalars['String']>
  token_type?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  userId?: InputMaybe<Scalars['uuid']>
}

/** aggregate stddev on columns */
export type Accounts_Stddev_Fields = {
  __typename?: 'accounts_stddev_fields'
  expires_at?: Maybe<Scalars['Float']>
  refresh_token_expires_in?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "accounts" */
export type Accounts_Stddev_Order_By = {
  expires_at?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Accounts_Stddev_Pop_Fields = {
  __typename?: 'accounts_stddev_pop_fields'
  expires_at?: Maybe<Scalars['Float']>
  refresh_token_expires_in?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "accounts" */
export type Accounts_Stddev_Pop_Order_By = {
  expires_at?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Accounts_Stddev_Samp_Fields = {
  __typename?: 'accounts_stddev_samp_fields'
  expires_at?: Maybe<Scalars['Float']>
  refresh_token_expires_in?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "accounts" */
export type Accounts_Stddev_Samp_Order_By = {
  expires_at?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Accounts_Sum_Fields = {
  __typename?: 'accounts_sum_fields'
  expires_at?: Maybe<Scalars['bigint']>
  refresh_token_expires_in?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "accounts" */
export type Accounts_Sum_Order_By = {
  expires_at?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
}

/** update columns of table "accounts" */
export type Accounts_Update_Column =
  /** column name */
  | 'access_token'
  /** column name */
  | 'expires_at'
  /** column name */
  | 'id'
  /** column name */
  | 'id_token'
  /** column name */
  | 'oauth_token'
  /** column name */
  | 'oauth_token_secret'
  /** column name */
  | 'provider'
  /** column name */
  | 'providerAccountId'
  /** column name */
  | 'refresh_token'
  /** column name */
  | 'refresh_token_expires_in'
  /** column name */
  | 'scope'
  /** column name */
  | 'session_state'
  /** column name */
  | 'token_type'
  /** column name */
  | 'type'
  /** column name */
  | 'userId'

/** aggregate var_pop on columns */
export type Accounts_Var_Pop_Fields = {
  __typename?: 'accounts_var_pop_fields'
  expires_at?: Maybe<Scalars['Float']>
  refresh_token_expires_in?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "accounts" */
export type Accounts_Var_Pop_Order_By = {
  expires_at?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Accounts_Var_Samp_Fields = {
  __typename?: 'accounts_var_samp_fields'
  expires_at?: Maybe<Scalars['Float']>
  refresh_token_expires_in?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "accounts" */
export type Accounts_Var_Samp_Order_By = {
  expires_at?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Accounts_Variance_Fields = {
  __typename?: 'accounts_variance_fields'
  expires_at?: Maybe<Scalars['Float']>
  refresh_token_expires_in?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "accounts" */
export type Accounts_Variance_Order_By = {
  expires_at?: InputMaybe<Order_By>
  refresh_token_expires_in?: InputMaybe<Order_By>
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']>
  _gt?: InputMaybe<Scalars['bigint']>
  _gte?: InputMaybe<Scalars['bigint']>
  _in?: InputMaybe<Array<Scalars['bigint']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['bigint']>
  _lte?: InputMaybe<Scalars['bigint']>
  _neq?: InputMaybe<Scalars['bigint']>
  _nin?: InputMaybe<Array<Scalars['bigint']>>
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root'
  /** delete data from the table: "accounts" */
  delete_accounts?: Maybe<Accounts_Mutation_Response>
  /** delete single row from the table: "accounts" */
  delete_accounts_by_pk?: Maybe<Accounts>
  /** delete data from the table: "sessions" */
  delete_sessions?: Maybe<Sessions_Mutation_Response>
  /** delete single row from the table: "sessions" */
  delete_sessions_by_pk?: Maybe<Sessions>
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>
  /** delete data from the table: "verification_tokens" */
  delete_verification_tokens?: Maybe<Verification_Tokens_Mutation_Response>
  /** delete single row from the table: "verification_tokens" */
  delete_verification_tokens_by_pk?: Maybe<Verification_Tokens>
  /** insert data into the table: "accounts" */
  insert_accounts?: Maybe<Accounts_Mutation_Response>
  /** insert a single row into the table: "accounts" */
  insert_accounts_one?: Maybe<Accounts>
  /** insert data into the table: "sessions" */
  insert_sessions?: Maybe<Sessions_Mutation_Response>
  /** insert a single row into the table: "sessions" */
  insert_sessions_one?: Maybe<Sessions>
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>
  /** insert data into the table: "verification_tokens" */
  insert_verification_tokens?: Maybe<Verification_Tokens_Mutation_Response>
  /** insert a single row into the table: "verification_tokens" */
  insert_verification_tokens_one?: Maybe<Verification_Tokens>
  /** update data of the table: "accounts" */
  update_accounts?: Maybe<Accounts_Mutation_Response>
  /** update single row of the table: "accounts" */
  update_accounts_by_pk?: Maybe<Accounts>
  /** update data of the table: "sessions" */
  update_sessions?: Maybe<Sessions_Mutation_Response>
  /** update single row of the table: "sessions" */
  update_sessions_by_pk?: Maybe<Sessions>
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>
  /** update data of the table: "verification_tokens" */
  update_verification_tokens?: Maybe<Verification_Tokens_Mutation_Response>
  /** update single row of the table: "verification_tokens" */
  update_verification_tokens_by_pk?: Maybe<Verification_Tokens>
}

/** mutation root */
export type Mutation_RootDelete_AccountsArgs = {
  where: Accounts_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Accounts_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_SessionsArgs = {
  where: Sessions_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Sessions_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_Verification_TokensArgs = {
  where: Verification_Tokens_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Verification_Tokens_By_PkArgs = {
  token: Scalars['String']
}

/** mutation root */
export type Mutation_RootInsert_AccountsArgs = {
  objects: Array<Accounts_Insert_Input>
  on_conflict?: InputMaybe<Accounts_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Accounts_OneArgs = {
  object: Accounts_Insert_Input
  on_conflict?: InputMaybe<Accounts_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_SessionsArgs = {
  objects: Array<Sessions_Insert_Input>
  on_conflict?: InputMaybe<Sessions_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Sessions_OneArgs = {
  object: Sessions_Insert_Input
  on_conflict?: InputMaybe<Sessions_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>
  on_conflict?: InputMaybe<Users_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input
  on_conflict?: InputMaybe<Users_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Verification_TokensArgs = {
  objects: Array<Verification_Tokens_Insert_Input>
  on_conflict?: InputMaybe<Verification_Tokens_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Verification_Tokens_OneArgs = {
  object: Verification_Tokens_Insert_Input
  on_conflict?: InputMaybe<Verification_Tokens_On_Conflict>
}

/** mutation root */
export type Mutation_RootUpdate_AccountsArgs = {
  _inc?: InputMaybe<Accounts_Inc_Input>
  _set?: InputMaybe<Accounts_Set_Input>
  where: Accounts_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Accounts_By_PkArgs = {
  _inc?: InputMaybe<Accounts_Inc_Input>
  _set?: InputMaybe<Accounts_Set_Input>
  pk_columns: Accounts_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_SessionsArgs = {
  _set?: InputMaybe<Sessions_Set_Input>
  where: Sessions_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Sessions_By_PkArgs = {
  _set?: InputMaybe<Sessions_Set_Input>
  pk_columns: Sessions_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: InputMaybe<Users_Set_Input>
  where: Users_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: InputMaybe<Users_Set_Input>
  pk_columns: Users_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Verification_TokensArgs = {
  _set?: InputMaybe<Verification_Tokens_Set_Input>
  where: Verification_Tokens_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Verification_Tokens_By_PkArgs = {
  _set?: InputMaybe<Verification_Tokens_Set_Input>
  pk_columns: Verification_Tokens_Pk_Columns_Input
}

/** column ordering options */
export type Order_By =
  /** in ascending order, nulls last */
  | 'asc'
  /** in ascending order, nulls first */
  | 'asc_nulls_first'
  /** in ascending order, nulls last */
  | 'asc_nulls_last'
  /** in descending order, nulls first */
  | 'desc'
  /** in descending order, nulls first */
  | 'desc_nulls_first'
  /** in descending order, nulls last */
  | 'desc_nulls_last'

export type Query_Root = {
  __typename?: 'query_root'
  /** An array relationship */
  accounts: Array<Accounts>
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>
  /** fetch data from the table: "sessions" */
  sessions: Array<Sessions>
  /** An aggregate relationship */
  sessions_aggregate: Sessions_Aggregate
  /** fetch data from the table: "sessions" using primary key columns */
  sessions_by_pk?: Maybe<Sessions>
  /** fetch data from the table: "users" */
  users: Array<Users>
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>
  /** fetch data from the table: "verification_tokens" */
  verification_tokens: Array<Verification_Tokens>
  /** fetch aggregated fields from the table: "verification_tokens" */
  verification_tokens_aggregate: Verification_Tokens_Aggregate
  /** fetch data from the table: "verification_tokens" using primary key columns */
  verification_tokens_by_pk?: Maybe<Verification_Tokens>
}

export type Query_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Accounts_Order_By>>
  where?: InputMaybe<Accounts_Bool_Exp>
}

export type Query_RootAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Accounts_Order_By>>
  where?: InputMaybe<Accounts_Bool_Exp>
}

export type Query_RootAccounts_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootSessionsArgs = {
  distinct_on?: InputMaybe<Array<Sessions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Sessions_Order_By>>
  where?: InputMaybe<Sessions_Bool_Exp>
}

export type Query_RootSessions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sessions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Sessions_Order_By>>
  where?: InputMaybe<Sessions_Bool_Exp>
}

export type Query_RootSessions_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Users_Order_By>>
  where?: InputMaybe<Users_Bool_Exp>
}

export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Users_Order_By>>
  where?: InputMaybe<Users_Bool_Exp>
}

export type Query_RootUsers_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootVerification_TokensArgs = {
  distinct_on?: InputMaybe<Array<Verification_Tokens_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Verification_Tokens_Order_By>>
  where?: InputMaybe<Verification_Tokens_Bool_Exp>
}

export type Query_RootVerification_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Verification_Tokens_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Verification_Tokens_Order_By>>
  where?: InputMaybe<Verification_Tokens_Bool_Exp>
}

export type Query_RootVerification_Tokens_By_PkArgs = {
  token: Scalars['String']
}

/** columns and relationships of "sessions" */
export type Sessions = {
  __typename?: 'sessions'
  expires?: Maybe<Scalars['timestamptz']>
  id: Scalars['uuid']
  sessionToken: Scalars['String']
  /** An object relationship */
  user: Users
  userId: Scalars['uuid']
}

/** aggregated selection of "sessions" */
export type Sessions_Aggregate = {
  __typename?: 'sessions_aggregate'
  aggregate?: Maybe<Sessions_Aggregate_Fields>
  nodes: Array<Sessions>
}

/** aggregate fields of "sessions" */
export type Sessions_Aggregate_Fields = {
  __typename?: 'sessions_aggregate_fields'
  count: Scalars['Int']
  max?: Maybe<Sessions_Max_Fields>
  min?: Maybe<Sessions_Min_Fields>
}

/** aggregate fields of "sessions" */
export type Sessions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sessions_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "sessions" */
export type Sessions_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Sessions_Max_Order_By>
  min?: InputMaybe<Sessions_Min_Order_By>
}

/** input type for inserting array relation for remote table "sessions" */
export type Sessions_Arr_Rel_Insert_Input = {
  data: Array<Sessions_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Sessions_On_Conflict>
}

/** Boolean expression to filter rows from the table "sessions". All fields are combined with a logical 'AND'. */
export type Sessions_Bool_Exp = {
  _and?: InputMaybe<Array<Sessions_Bool_Exp>>
  _not?: InputMaybe<Sessions_Bool_Exp>
  _or?: InputMaybe<Array<Sessions_Bool_Exp>>
  expires?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  sessionToken?: InputMaybe<String_Comparison_Exp>
  user?: InputMaybe<Users_Bool_Exp>
  userId?: InputMaybe<Uuid_Comparison_Exp>
}

/** unique or primary key constraints on table "sessions" */
export type Sessions_Constraint =
  /** unique or primary key constraint */
  'sessions_pkey'

/** input type for inserting data into table "sessions" */
export type Sessions_Insert_Input = {
  expires?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  sessionToken?: InputMaybe<Scalars['String']>
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>
  userId?: InputMaybe<Scalars['uuid']>
}

/** aggregate max on columns */
export type Sessions_Max_Fields = {
  __typename?: 'sessions_max_fields'
  expires?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  sessionToken?: Maybe<Scalars['String']>
  userId?: Maybe<Scalars['uuid']>
}

/** order by max() on columns of table "sessions" */
export type Sessions_Max_Order_By = {
  expires?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  sessionToken?: InputMaybe<Order_By>
  userId?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Sessions_Min_Fields = {
  __typename?: 'sessions_min_fields'
  expires?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  sessionToken?: Maybe<Scalars['String']>
  userId?: Maybe<Scalars['uuid']>
}

/** order by min() on columns of table "sessions" */
export type Sessions_Min_Order_By = {
  expires?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  sessionToken?: InputMaybe<Order_By>
  userId?: InputMaybe<Order_By>
}

/** response of any mutation on the table "sessions" */
export type Sessions_Mutation_Response = {
  __typename?: 'sessions_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Sessions>
}

/** on_conflict condition type for table "sessions" */
export type Sessions_On_Conflict = {
  constraint: Sessions_Constraint
  update_columns?: Array<Sessions_Update_Column>
  where?: InputMaybe<Sessions_Bool_Exp>
}

/** Ordering options when selecting data from "sessions". */
export type Sessions_Order_By = {
  expires?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  sessionToken?: InputMaybe<Order_By>
  user?: InputMaybe<Users_Order_By>
  userId?: InputMaybe<Order_By>
}

/** primary key columns input for table: sessions */
export type Sessions_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "sessions" */
export type Sessions_Select_Column =
  /** column name */
  | 'expires'
  /** column name */
  | 'id'
  /** column name */
  | 'sessionToken'
  /** column name */
  | 'userId'

/** input type for updating data in table "sessions" */
export type Sessions_Set_Input = {
  expires?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  sessionToken?: InputMaybe<Scalars['String']>
  userId?: InputMaybe<Scalars['uuid']>
}

/** update columns of table "sessions" */
export type Sessions_Update_Column =
  /** column name */
  | 'expires'
  /** column name */
  | 'id'
  /** column name */
  | 'sessionToken'
  /** column name */
  | 'userId'

export type Subscription_Root = {
  __typename?: 'subscription_root'
  /** An array relationship */
  accounts: Array<Accounts>
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>
  /** fetch data from the table: "sessions" */
  sessions: Array<Sessions>
  /** An aggregate relationship */
  sessions_aggregate: Sessions_Aggregate
  /** fetch data from the table: "sessions" using primary key columns */
  sessions_by_pk?: Maybe<Sessions>
  /** fetch data from the table: "users" */
  users: Array<Users>
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>
  /** fetch data from the table: "verification_tokens" */
  verification_tokens: Array<Verification_Tokens>
  /** fetch aggregated fields from the table: "verification_tokens" */
  verification_tokens_aggregate: Verification_Tokens_Aggregate
  /** fetch data from the table: "verification_tokens" using primary key columns */
  verification_tokens_by_pk?: Maybe<Verification_Tokens>
}

export type Subscription_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Accounts_Order_By>>
  where?: InputMaybe<Accounts_Bool_Exp>
}

export type Subscription_RootAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Accounts_Order_By>>
  where?: InputMaybe<Accounts_Bool_Exp>
}

export type Subscription_RootAccounts_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootSessionsArgs = {
  distinct_on?: InputMaybe<Array<Sessions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Sessions_Order_By>>
  where?: InputMaybe<Sessions_Bool_Exp>
}

export type Subscription_RootSessions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sessions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Sessions_Order_By>>
  where?: InputMaybe<Sessions_Bool_Exp>
}

export type Subscription_RootSessions_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Users_Order_By>>
  where?: InputMaybe<Users_Bool_Exp>
}

export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Users_Order_By>>
  where?: InputMaybe<Users_Bool_Exp>
}

export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootVerification_TokensArgs = {
  distinct_on?: InputMaybe<Array<Verification_Tokens_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Verification_Tokens_Order_By>>
  where?: InputMaybe<Verification_Tokens_Bool_Exp>
}

export type Subscription_RootVerification_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Verification_Tokens_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Verification_Tokens_Order_By>>
  where?: InputMaybe<Verification_Tokens_Bool_Exp>
}

export type Subscription_RootVerification_Tokens_By_PkArgs = {
  token: Scalars['String']
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>
  _gt?: InputMaybe<Scalars['timestamptz']>
  _gte?: InputMaybe<Scalars['timestamptz']>
  _in?: InputMaybe<Array<Scalars['timestamptz']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['timestamptz']>
  _lte?: InputMaybe<Scalars['timestamptz']>
  _neq?: InputMaybe<Scalars['timestamptz']>
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>
}

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users'
  /** An array relationship */
  accounts: Array<Accounts>
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate
  email?: Maybe<Scalars['String']>
  emailVerified?: Maybe<Scalars['timestamptz']>
  id: Scalars['uuid']
  image?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  /** fetch data from the table: "sessions" */
  sessions: Array<Sessions>
  /** An aggregate relationship */
  sessions_aggregate: Sessions_Aggregate
}

/** columns and relationships of "users" */
export type UsersAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Accounts_Order_By>>
  where?: InputMaybe<Accounts_Bool_Exp>
}

/** columns and relationships of "users" */
export type UsersAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Accounts_Order_By>>
  where?: InputMaybe<Accounts_Bool_Exp>
}

/** columns and relationships of "users" */
export type UsersSessionsArgs = {
  distinct_on?: InputMaybe<Array<Sessions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Sessions_Order_By>>
  where?: InputMaybe<Sessions_Bool_Exp>
}

/** columns and relationships of "users" */
export type UsersSessions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sessions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Sessions_Order_By>>
  where?: InputMaybe<Sessions_Bool_Exp>
}

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate'
  aggregate?: Maybe<Users_Aggregate_Fields>
  nodes: Array<Users>
}

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields'
  count: Scalars['Int']
  max?: Maybe<Users_Max_Fields>
  min?: Maybe<Users_Min_Fields>
}

/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>
  _not?: InputMaybe<Users_Bool_Exp>
  _or?: InputMaybe<Array<Users_Bool_Exp>>
  accounts?: InputMaybe<Accounts_Bool_Exp>
  email?: InputMaybe<String_Comparison_Exp>
  emailVerified?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  image?: InputMaybe<String_Comparison_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  sessions?: InputMaybe<Sessions_Bool_Exp>
}

/** unique or primary key constraints on table "users" */
export type Users_Constraint =
  /** unique or primary key constraint */
  | 'users_email_key'
  /** unique or primary key constraint */
  | 'users_pkey'

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  accounts?: InputMaybe<Accounts_Arr_Rel_Insert_Input>
  email?: InputMaybe<Scalars['String']>
  emailVerified?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  sessions?: InputMaybe<Sessions_Arr_Rel_Insert_Input>
}

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields'
  email?: Maybe<Scalars['String']>
  emailVerified?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  image?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields'
  email?: Maybe<Scalars['String']>
  emailVerified?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  image?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Users>
}

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>
}

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint
  update_columns?: Array<Users_Update_Column>
  where?: InputMaybe<Users_Bool_Exp>
}

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  accounts_aggregate?: InputMaybe<Accounts_Aggregate_Order_By>
  email?: InputMaybe<Order_By>
  emailVerified?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  image?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  sessions_aggregate?: InputMaybe<Sessions_Aggregate_Order_By>
}

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "users" */
export type Users_Select_Column =
  /** column name */
  | 'email'
  /** column name */
  | 'emailVerified'
  /** column name */
  | 'id'
  /** column name */
  | 'image'
  /** column name */
  | 'name'

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  email?: InputMaybe<Scalars['String']>
  emailVerified?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
}

/** update columns of table "users" */
export type Users_Update_Column =
  /** column name */
  | 'email'
  /** column name */
  | 'emailVerified'
  /** column name */
  | 'id'
  /** column name */
  | 'image'
  /** column name */
  | 'name'

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>
  _gt?: InputMaybe<Scalars['uuid']>
  _gte?: InputMaybe<Scalars['uuid']>
  _in?: InputMaybe<Array<Scalars['uuid']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['uuid']>
  _lte?: InputMaybe<Scalars['uuid']>
  _neq?: InputMaybe<Scalars['uuid']>
  _nin?: InputMaybe<Array<Scalars['uuid']>>
}

/** columns and relationships of "verification_tokens" */
export type Verification_Tokens = {
  __typename?: 'verification_tokens'
  expires?: Maybe<Scalars['timestamptz']>
  identifier: Scalars['String']
  token: Scalars['String']
}

/** aggregated selection of "verification_tokens" */
export type Verification_Tokens_Aggregate = {
  __typename?: 'verification_tokens_aggregate'
  aggregate?: Maybe<Verification_Tokens_Aggregate_Fields>
  nodes: Array<Verification_Tokens>
}

/** aggregate fields of "verification_tokens" */
export type Verification_Tokens_Aggregate_Fields = {
  __typename?: 'verification_tokens_aggregate_fields'
  count: Scalars['Int']
  max?: Maybe<Verification_Tokens_Max_Fields>
  min?: Maybe<Verification_Tokens_Min_Fields>
}

/** aggregate fields of "verification_tokens" */
export type Verification_Tokens_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Verification_Tokens_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** Boolean expression to filter rows from the table "verification_tokens". All fields are combined with a logical 'AND'. */
export type Verification_Tokens_Bool_Exp = {
  _and?: InputMaybe<Array<Verification_Tokens_Bool_Exp>>
  _not?: InputMaybe<Verification_Tokens_Bool_Exp>
  _or?: InputMaybe<Array<Verification_Tokens_Bool_Exp>>
  expires?: InputMaybe<Timestamptz_Comparison_Exp>
  identifier?: InputMaybe<String_Comparison_Exp>
  token?: InputMaybe<String_Comparison_Exp>
}

/** unique or primary key constraints on table "verification_tokens" */
export type Verification_Tokens_Constraint =
  /** unique or primary key constraint */
  'verification_tokens_pkey'

/** input type for inserting data into table "verification_tokens" */
export type Verification_Tokens_Insert_Input = {
  expires?: InputMaybe<Scalars['timestamptz']>
  identifier?: InputMaybe<Scalars['String']>
  token?: InputMaybe<Scalars['String']>
}

/** aggregate max on columns */
export type Verification_Tokens_Max_Fields = {
  __typename?: 'verification_tokens_max_fields'
  expires?: Maybe<Scalars['timestamptz']>
  identifier?: Maybe<Scalars['String']>
  token?: Maybe<Scalars['String']>
}

/** aggregate min on columns */
export type Verification_Tokens_Min_Fields = {
  __typename?: 'verification_tokens_min_fields'
  expires?: Maybe<Scalars['timestamptz']>
  identifier?: Maybe<Scalars['String']>
  token?: Maybe<Scalars['String']>
}

/** response of any mutation on the table "verification_tokens" */
export type Verification_Tokens_Mutation_Response = {
  __typename?: 'verification_tokens_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Verification_Tokens>
}

/** on_conflict condition type for table "verification_tokens" */
export type Verification_Tokens_On_Conflict = {
  constraint: Verification_Tokens_Constraint
  update_columns?: Array<Verification_Tokens_Update_Column>
  where?: InputMaybe<Verification_Tokens_Bool_Exp>
}

/** Ordering options when selecting data from "verification_tokens". */
export type Verification_Tokens_Order_By = {
  expires?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  token?: InputMaybe<Order_By>
}

/** primary key columns input for table: verification_tokens */
export type Verification_Tokens_Pk_Columns_Input = {
  token: Scalars['String']
}

/** select columns of table "verification_tokens" */
export type Verification_Tokens_Select_Column =
  /** column name */
  | 'expires'
  /** column name */
  | 'identifier'
  /** column name */
  | 'token'

/** input type for updating data in table "verification_tokens" */
export type Verification_Tokens_Set_Input = {
  expires?: InputMaybe<Scalars['timestamptz']>
  identifier?: InputMaybe<Scalars['String']>
  token?: InputMaybe<Scalars['String']>
}

/** update columns of table "verification_tokens" */
export type Verification_Tokens_Update_Column =
  /** column name */
  | 'expires'
  /** column name */
  | 'identifier'
  /** column name */
  | 'token'

export type CreateUserMutationVariables = Exact<{
  data: Users_Insert_Input
}>

export type CreateUserMutation = {
  __typename?: 'mutation_root'
  insert_users_one?: {
    __typename?: 'users'
    email?: string | null
    emailVerified?: any | null
    id: any
    name?: string | null
    image?: string | null
  } | null
}

export type GetUserQueryVariables = Exact<{
  id: Scalars['uuid']
}>

export type GetUserQuery = {
  __typename?: 'query_root'
  users_by_pk?: {
    __typename?: 'users'
    id: any
    name?: string | null
    email?: string | null
    image?: string | null
    emailVerified?: any | null
  } | null
}

export type QueryUserQueryVariables = Exact<{
  where: Users_Bool_Exp
}>

export type QueryUserQuery = {
  __typename?: 'query_root'
  users: Array<{
    __typename?: 'users'
    email?: string | null
    emailVerified?: any | null
    id: any
    image?: string | null
    name?: string | null
  }>
}

export type GetSessionAndUserQueryVariables = Exact<{
  sessionToken?: InputMaybe<Scalars['String']>
}>

export type GetSessionAndUserQuery = {
  __typename?: 'query_root'
  sessions: Array<{
    __typename?: 'sessions'
    expires?: any | null
    id: any
    sessionToken: string
    userId: any
    user: {
      __typename?: 'users'
      email?: string | null
      id: any
      emailVerified?: any | null
      image?: string | null
      name?: string | null
    }
  }>
}

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['uuid']
  data: Users_Set_Input
}>

export type UpdateUserMutation = {
  __typename?: 'mutation_root'
  update_users_by_pk?: {
    __typename?: 'users'
    email?: string | null
    emailVerified?: any | null
    id: any
    image?: string | null
    name?: string | null
  } | null
}

export type LinkAccountMutationVariables = Exact<{
  data: Accounts_Insert_Input
}>

export type LinkAccountMutation = {
  __typename?: 'mutation_root'
  insert_accounts_one?: {
    __typename?: 'accounts'
    access_token?: string | null
    expires_at?: any | null
    id: any
    id_token?: string | null
    oauth_token?: string | null
    oauth_token_secret?: string | null
    provider: string
    scope?: string | null
    refresh_token?: string | null
    refresh_token_expires_in?: number | null
    providerAccountId: string
    session_state?: string | null
    token_type?: string | null
    type: string
    userId: any
  } | null
}

export type CreateSessionMutationVariables = Exact<{
  data: Sessions_Insert_Input
}>

export type CreateSessionMutation = {
  __typename?: 'mutation_root'
  insert_sessions_one?: {
    __typename?: 'sessions'
    expires?: any | null
    id: any
    sessionToken: string
    userId: any
  } | null
}

export type UpdateSessionMutationVariables = Exact<{
  sessionToken?: InputMaybe<Scalars['String']>
  data: Sessions_Set_Input
}>

export type UpdateSessionMutation = {
  __typename?: 'mutation_root'
  update_sessions?: {
    __typename?: 'sessions_mutation_response'
    returning: Array<{
      __typename?: 'sessions'
      expires?: any | null
      id: any
      sessionToken: string
      userId: any
    }>
  } | null
}

export type UnlinkAccountMutationVariables = Exact<{
  provider: Scalars['String']
  providerAccountId: Scalars['String']
}>

export type UnlinkAccountMutation = {
  __typename?: 'mutation_root'
  delete_accounts?: {
    __typename?: 'accounts_mutation_response'
    returning: Array<{
      __typename?: 'accounts'
      access_token?: string | null
      expires_at?: any | null
      id: any
      id_token?: string | null
      oauth_token_secret?: string | null
      oauth_token?: string | null
      provider: string
      providerAccountId: string
      refresh_token?: string | null
      refresh_token_expires_in?: number | null
      session_state?: string | null
      scope?: string | null
      token_type?: string | null
      type: string
      userId: any
    }>
  } | null
}

export type DeleteSessionMutationVariables = Exact<{
  sessionToken?: InputMaybe<Scalars['String']>
}>

export type DeleteSessionMutation = {
  __typename?: 'mutation_root'
  delete_sessions?: {
    __typename?: 'sessions_mutation_response'
    returning: Array<{
      __typename?: 'sessions'
      id: any
      expires?: any | null
      sessionToken: string
      userId: any
    }>
  } | null
}

export type CreateVerificationTokenMutationVariables = Exact<{
  data: Verification_Tokens_Insert_Input
}>

export type CreateVerificationTokenMutation = {
  __typename?: 'mutation_root'
  insert_verification_tokens_one?: {
    __typename?: 'verification_tokens'
    expires?: any | null
    identifier: string
    token: string
  } | null
}

export type UseVerificationTokenMutationVariables = Exact<{
  identifier: Scalars['String']
  token: Scalars['String']
}>

export type UseVerificationTokenMutation = {
  __typename?: 'mutation_root'
  delete_verification_tokens?: {
    __typename?: 'verification_tokens_mutation_response'
    returning: Array<{
      __typename?: 'verification_tokens'
      expires?: any | null
      identifier: string
      token: string
    }>
  } | null
}

export const CreateUserDocument = gql`
  mutation CreateUser($data: users_insert_input!) {
    insert_users_one(object: $data) {
      email
      emailVerified
      id
      name
      image
    }
  }
`
export const GetUserDocument = gql`
  query GetUser($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
      image
      emailVerified
    }
  }
`
export const QueryUserDocument = gql`
  query QueryUser($where: users_bool_exp!) {
    users(where: $where) {
      email
      emailVerified
      id
      image
      name
    }
  }
`
export const GetSessionAndUserDocument = gql`
  query GetSessionAndUser($sessionToken: String) {
    sessions(where: {sessionToken: {_eq: $sessionToken}}) {
      expires
      id
      sessionToken
      userId
      user {
        email
        id
        emailVerified
        image
        name
      }
    }
  }
`
export const UpdateUserDocument = gql`
  mutation UpdateUser($id: uuid!, $data: users_set_input!) {
    update_users_by_pk(_set: $data, pk_columns: {id: $id}) {
      email
      emailVerified
      id
      image
      name
    }
  }
`
export const LinkAccountDocument = gql`
  mutation LinkAccount($data: accounts_insert_input!) {
    insert_accounts_one(object: $data) {
      access_token
      expires_at
      id
      id_token
      oauth_token
      oauth_token_secret
      provider
      scope
      refresh_token
      refresh_token_expires_in
      providerAccountId
      session_state
      token_type
      type
      userId
    }
  }
`
export const CreateSessionDocument = gql`
  mutation CreateSession($data: sessions_insert_input!) {
    insert_sessions_one(object: $data) {
      expires
      id
      sessionToken
      userId
    }
  }
`
export const UpdateSessionDocument = gql`
  mutation UpdateSession($sessionToken: String, $data: sessions_set_input!) {
    update_sessions(where: {sessionToken: {_eq: $sessionToken}}, _set: $data) {
      returning {
        expires
        id
        sessionToken
        userId
      }
    }
  }
`
export const UnlinkAccountDocument = gql`
  mutation UnlinkAccount($provider: String!, $providerAccountId: String!) {
    delete_accounts(
      where: {
        provider: {_eq: $provider}
        providerAccountId: {_eq: $providerAccountId}
      }
    ) {
      returning {
        access_token
        expires_at
        id
        id_token
        oauth_token_secret
        oauth_token
        provider
        providerAccountId
        refresh_token
        refresh_token_expires_in
        session_state
        scope
        token_type
        type
        userId
      }
    }
  }
`
export const DeleteSessionDocument = gql`
  mutation DeleteSession($sessionToken: String) {
    delete_sessions(where: {sessionToken: {_eq: $sessionToken}}) {
      returning {
        id
        expires
        sessionToken
        userId
      }
    }
  }
`
export const CreateVerificationTokenDocument = gql`
  mutation CreateVerificationToken($data: verification_tokens_insert_input!) {
    insert_verification_tokens_one(object: $data) {
      expires
      identifier
      token
    }
  }
`
export const UseVerificationTokenDocument = gql`
  mutation UseVerificationToken($identifier: String!, $token: String!) {
    delete_verification_tokens(
      where: {token: {_eq: $token}, identifier: {_eq: $identifier}}
    ) {
      returning {
        expires
        identifier
        token
      }
    }
  }
`

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
) => action()

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    CreateUser(
      variables: CreateUserMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CreateUserMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateUserMutation>(CreateUserDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'CreateUser',
        'mutation',
      )
    },
    GetUser(
      variables: GetUserQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetUserQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetUserQuery>(GetUserDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetUser',
        'query',
      )
    },
    QueryUser(
      variables: QueryUserQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<QueryUserQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<QueryUserQuery>(QueryUserDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'QueryUser',
        'query',
      )
    },
    GetSessionAndUser(
      variables?: GetSessionAndUserQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetSessionAndUserQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetSessionAndUserQuery>(
            GetSessionAndUserDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'GetSessionAndUser',
        'query',
      )
    },
    UpdateUser(
      variables: UpdateUserMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<UpdateUserMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateUserMutation>(UpdateUserDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'UpdateUser',
        'mutation',
      )
    },
    LinkAccount(
      variables: LinkAccountMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<LinkAccountMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LinkAccountMutation>(LinkAccountDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'LinkAccount',
        'mutation',
      )
    },
    CreateSession(
      variables: CreateSessionMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CreateSessionMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateSessionMutation>(
            CreateSessionDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'CreateSession',
        'mutation',
      )
    },
    UpdateSession(
      variables: UpdateSessionMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<UpdateSessionMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateSessionMutation>(
            UpdateSessionDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'UpdateSession',
        'mutation',
      )
    },
    UnlinkAccount(
      variables: UnlinkAccountMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<UnlinkAccountMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UnlinkAccountMutation>(
            UnlinkAccountDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'UnlinkAccount',
        'mutation',
      )
    },
    DeleteSession(
      variables?: DeleteSessionMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<DeleteSessionMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteSessionMutation>(
            DeleteSessionDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'DeleteSession',
        'mutation',
      )
    },
    CreateVerificationToken(
      variables: CreateVerificationTokenMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CreateVerificationTokenMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateVerificationTokenMutation>(
            CreateVerificationTokenDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'CreateVerificationToken',
        'mutation',
      )
    },
    UseVerificationToken(
      variables: UseVerificationTokenMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<UseVerificationTokenMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UseVerificationTokenMutation>(
            UseVerificationTokenDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'UseVerificationToken',
        'mutation',
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
