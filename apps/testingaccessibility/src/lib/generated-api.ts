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
  numeric: any
  timestamptz: any
  uuid: any
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

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>
  _gt?: InputMaybe<Scalars['Boolean']>
  _gte?: InputMaybe<Scalars['Boolean']>
  _in?: InputMaybe<Array<Scalars['Boolean']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['Boolean']>
  _lte?: InputMaybe<Scalars['Boolean']>
  _neq?: InputMaybe<Scalars['Boolean']>
  _nin?: InputMaybe<Array<Scalars['Boolean']>>
}

/** columns and relationships of "coupons" */
export type Coupons = {
  __typename?: 'coupons'
  code?: Maybe<Scalars['String']>
  created_at: Scalars['timestamptz']
  default: Scalars['Boolean']
  expires?: Maybe<Scalars['timestamptz']>
  id: Scalars['uuid']
  max_uses: Scalars['Int']
  /** An object relationship */
  merchant_coupon?: Maybe<Merchant_Coupons>
  merchant_coupon_id?: Maybe<Scalars['uuid']>
  percentage_discount: Scalars['numeric']
  /** An array relationship */
  purchases: Array<Purchases>
  /** An aggregate relationship */
  purchases_aggregate: Purchases_Aggregate
  /** An object relationship */
  restricted_to_product?: Maybe<Products>
  restricted_to_product_id?: Maybe<Scalars['uuid']>
  status: Scalars['Int']
  used_count: Scalars['Int']
}

/** columns and relationships of "coupons" */
export type CouponsPurchasesArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** columns and relationships of "coupons" */
export type CouponsPurchases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** aggregated selection of "coupons" */
export type Coupons_Aggregate = {
  __typename?: 'coupons_aggregate'
  aggregate?: Maybe<Coupons_Aggregate_Fields>
  nodes: Array<Coupons>
}

/** aggregate fields of "coupons" */
export type Coupons_Aggregate_Fields = {
  __typename?: 'coupons_aggregate_fields'
  avg?: Maybe<Coupons_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Coupons_Max_Fields>
  min?: Maybe<Coupons_Min_Fields>
  stddev?: Maybe<Coupons_Stddev_Fields>
  stddev_pop?: Maybe<Coupons_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Coupons_Stddev_Samp_Fields>
  sum?: Maybe<Coupons_Sum_Fields>
  var_pop?: Maybe<Coupons_Var_Pop_Fields>
  var_samp?: Maybe<Coupons_Var_Samp_Fields>
  variance?: Maybe<Coupons_Variance_Fields>
}

/** aggregate fields of "coupons" */
export type Coupons_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Coupons_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "coupons" */
export type Coupons_Aggregate_Order_By = {
  avg?: InputMaybe<Coupons_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Coupons_Max_Order_By>
  min?: InputMaybe<Coupons_Min_Order_By>
  stddev?: InputMaybe<Coupons_Stddev_Order_By>
  stddev_pop?: InputMaybe<Coupons_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Coupons_Stddev_Samp_Order_By>
  sum?: InputMaybe<Coupons_Sum_Order_By>
  var_pop?: InputMaybe<Coupons_Var_Pop_Order_By>
  var_samp?: InputMaybe<Coupons_Var_Samp_Order_By>
  variance?: InputMaybe<Coupons_Variance_Order_By>
}

/** input type for inserting array relation for remote table "coupons" */
export type Coupons_Arr_Rel_Insert_Input = {
  data: Array<Coupons_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Coupons_On_Conflict>
}

/** aggregate avg on columns */
export type Coupons_Avg_Fields = {
  __typename?: 'coupons_avg_fields'
  max_uses?: Maybe<Scalars['Float']>
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
  used_count?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "coupons" */
export type Coupons_Avg_Order_By = {
  max_uses?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "coupons". All fields are combined with a logical 'AND'. */
export type Coupons_Bool_Exp = {
  _and?: InputMaybe<Array<Coupons_Bool_Exp>>
  _not?: InputMaybe<Coupons_Bool_Exp>
  _or?: InputMaybe<Array<Coupons_Bool_Exp>>
  code?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  default?: InputMaybe<Boolean_Comparison_Exp>
  expires?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  max_uses?: InputMaybe<Int_Comparison_Exp>
  merchant_coupon?: InputMaybe<Merchant_Coupons_Bool_Exp>
  merchant_coupon_id?: InputMaybe<Uuid_Comparison_Exp>
  percentage_discount?: InputMaybe<Numeric_Comparison_Exp>
  purchases?: InputMaybe<Purchases_Bool_Exp>
  restricted_to_product?: InputMaybe<Products_Bool_Exp>
  restricted_to_product_id?: InputMaybe<Uuid_Comparison_Exp>
  status?: InputMaybe<Int_Comparison_Exp>
  used_count?: InputMaybe<Int_Comparison_Exp>
}

/** unique or primary key constraints on table "coupons" */
export type Coupons_Constraint =
  /** unique or primary key constraint */
  | 'coupons_code_key'
  /** unique or primary key constraint */
  | 'coupons_pkey'

/** input type for incrementing numeric columns in table "coupons" */
export type Coupons_Inc_Input = {
  max_uses?: InputMaybe<Scalars['Int']>
  percentage_discount?: InputMaybe<Scalars['numeric']>
  status?: InputMaybe<Scalars['Int']>
  used_count?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "coupons" */
export type Coupons_Insert_Input = {
  code?: InputMaybe<Scalars['String']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  default?: InputMaybe<Scalars['Boolean']>
  expires?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  max_uses?: InputMaybe<Scalars['Int']>
  merchant_coupon?: InputMaybe<Merchant_Coupons_Obj_Rel_Insert_Input>
  merchant_coupon_id?: InputMaybe<Scalars['uuid']>
  percentage_discount?: InputMaybe<Scalars['numeric']>
  purchases?: InputMaybe<Purchases_Arr_Rel_Insert_Input>
  restricted_to_product?: InputMaybe<Products_Obj_Rel_Insert_Input>
  restricted_to_product_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['Int']>
  used_count?: InputMaybe<Scalars['Int']>
}

/** aggregate max on columns */
export type Coupons_Max_Fields = {
  __typename?: 'coupons_max_fields'
  code?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  expires?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  max_uses?: Maybe<Scalars['Int']>
  merchant_coupon_id?: Maybe<Scalars['uuid']>
  percentage_discount?: Maybe<Scalars['numeric']>
  restricted_to_product_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
  used_count?: Maybe<Scalars['Int']>
}

/** order by max() on columns of table "coupons" */
export type Coupons_Max_Order_By = {
  code?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  expires?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  max_uses?: InputMaybe<Order_By>
  merchant_coupon_id?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  restricted_to_product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Coupons_Min_Fields = {
  __typename?: 'coupons_min_fields'
  code?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  expires?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  max_uses?: Maybe<Scalars['Int']>
  merchant_coupon_id?: Maybe<Scalars['uuid']>
  percentage_discount?: Maybe<Scalars['numeric']>
  restricted_to_product_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
  used_count?: Maybe<Scalars['Int']>
}

/** order by min() on columns of table "coupons" */
export type Coupons_Min_Order_By = {
  code?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  expires?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  max_uses?: InputMaybe<Order_By>
  merchant_coupon_id?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  restricted_to_product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** response of any mutation on the table "coupons" */
export type Coupons_Mutation_Response = {
  __typename?: 'coupons_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Coupons>
}

/** input type for inserting object relation for remote table "coupons" */
export type Coupons_Obj_Rel_Insert_Input = {
  data: Coupons_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Coupons_On_Conflict>
}

/** on_conflict condition type for table "coupons" */
export type Coupons_On_Conflict = {
  constraint: Coupons_Constraint
  update_columns?: Array<Coupons_Update_Column>
  where?: InputMaybe<Coupons_Bool_Exp>
}

/** Ordering options when selecting data from "coupons". */
export type Coupons_Order_By = {
  code?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  default?: InputMaybe<Order_By>
  expires?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  max_uses?: InputMaybe<Order_By>
  merchant_coupon?: InputMaybe<Merchant_Coupons_Order_By>
  merchant_coupon_id?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  purchases_aggregate?: InputMaybe<Purchases_Aggregate_Order_By>
  restricted_to_product?: InputMaybe<Products_Order_By>
  restricted_to_product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** primary key columns input for table: coupons */
export type Coupons_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "coupons" */
export type Coupons_Select_Column =
  /** column name */
  | 'code'
  /** column name */
  | 'created_at'
  /** column name */
  | 'default'
  /** column name */
  | 'expires'
  /** column name */
  | 'id'
  /** column name */
  | 'max_uses'
  /** column name */
  | 'merchant_coupon_id'
  /** column name */
  | 'percentage_discount'
  /** column name */
  | 'restricted_to_product_id'
  /** column name */
  | 'status'
  /** column name */
  | 'used_count'

/** input type for updating data in table "coupons" */
export type Coupons_Set_Input = {
  code?: InputMaybe<Scalars['String']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  default?: InputMaybe<Scalars['Boolean']>
  expires?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  max_uses?: InputMaybe<Scalars['Int']>
  merchant_coupon_id?: InputMaybe<Scalars['uuid']>
  percentage_discount?: InputMaybe<Scalars['numeric']>
  restricted_to_product_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['Int']>
  used_count?: InputMaybe<Scalars['Int']>
}

/** aggregate stddev on columns */
export type Coupons_Stddev_Fields = {
  __typename?: 'coupons_stddev_fields'
  max_uses?: Maybe<Scalars['Float']>
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
  used_count?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "coupons" */
export type Coupons_Stddev_Order_By = {
  max_uses?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Coupons_Stddev_Pop_Fields = {
  __typename?: 'coupons_stddev_pop_fields'
  max_uses?: Maybe<Scalars['Float']>
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
  used_count?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "coupons" */
export type Coupons_Stddev_Pop_Order_By = {
  max_uses?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Coupons_Stddev_Samp_Fields = {
  __typename?: 'coupons_stddev_samp_fields'
  max_uses?: Maybe<Scalars['Float']>
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
  used_count?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "coupons" */
export type Coupons_Stddev_Samp_Order_By = {
  max_uses?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Coupons_Sum_Fields = {
  __typename?: 'coupons_sum_fields'
  max_uses?: Maybe<Scalars['Int']>
  percentage_discount?: Maybe<Scalars['numeric']>
  status?: Maybe<Scalars['Int']>
  used_count?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "coupons" */
export type Coupons_Sum_Order_By = {
  max_uses?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** update columns of table "coupons" */
export type Coupons_Update_Column =
  /** column name */
  | 'code'
  /** column name */
  | 'created_at'
  /** column name */
  | 'default'
  /** column name */
  | 'expires'
  /** column name */
  | 'id'
  /** column name */
  | 'max_uses'
  /** column name */
  | 'merchant_coupon_id'
  /** column name */
  | 'percentage_discount'
  /** column name */
  | 'restricted_to_product_id'
  /** column name */
  | 'status'
  /** column name */
  | 'used_count'

/** aggregate var_pop on columns */
export type Coupons_Var_Pop_Fields = {
  __typename?: 'coupons_var_pop_fields'
  max_uses?: Maybe<Scalars['Float']>
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
  used_count?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "coupons" */
export type Coupons_Var_Pop_Order_By = {
  max_uses?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Coupons_Var_Samp_Fields = {
  __typename?: 'coupons_var_samp_fields'
  max_uses?: Maybe<Scalars['Float']>
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
  used_count?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "coupons" */
export type Coupons_Var_Samp_Order_By = {
  max_uses?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Coupons_Variance_Fields = {
  __typename?: 'coupons_variance_fields'
  max_uses?: Maybe<Scalars['Float']>
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
  used_count?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "coupons" */
export type Coupons_Variance_Order_By = {
  max_uses?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  used_count?: InputMaybe<Order_By>
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

/** columns and relationships of "merchant_accounts" */
export type Merchant_Accounts = {
  __typename?: 'merchant_accounts'
  created_at: Scalars['timestamptz']
  id: Scalars['uuid']
  /** An array relationship */
  merchant_charges: Array<Merchant_Charges>
  /** An aggregate relationship */
  merchant_charges_aggregate: Merchant_Charges_Aggregate
  /** An array relationship */
  merchant_coupons: Array<Merchant_Coupons>
  /** An aggregate relationship */
  merchant_coupons_aggregate: Merchant_Coupons_Aggregate
  /** An array relationship */
  merchant_customers: Array<Merchant_Customers>
  /** An aggregate relationship */
  merchant_customers_aggregate: Merchant_Customers_Aggregate
  /** An array relationship */
  merchant_prices: Array<Merchant_Prices>
  /** An aggregate relationship */
  merchant_prices_aggregate: Merchant_Prices_Aggregate
  /** An array relationship */
  merchant_products: Array<Merchant_Products>
  /** An aggregate relationship */
  merchant_products_aggregate: Merchant_Products_Aggregate
  payment_processor_id: Scalars['String']
  status: Scalars['Int']
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_ChargesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_Charges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_CouponsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Coupons_Order_By>>
  where?: InputMaybe<Merchant_Coupons_Bool_Exp>
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_Coupons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Coupons_Order_By>>
  where?: InputMaybe<Merchant_Coupons_Bool_Exp>
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_CustomersArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Customers_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Customers_Order_By>>
  where?: InputMaybe<Merchant_Customers_Bool_Exp>
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_Customers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Customers_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Customers_Order_By>>
  where?: InputMaybe<Merchant_Customers_Bool_Exp>
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_PricesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_Prices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_ProductsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Products_Order_By>>
  where?: InputMaybe<Merchant_Products_Bool_Exp>
}

/** columns and relationships of "merchant_accounts" */
export type Merchant_AccountsMerchant_Products_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Products_Order_By>>
  where?: InputMaybe<Merchant_Products_Bool_Exp>
}

/** aggregated selection of "merchant_accounts" */
export type Merchant_Accounts_Aggregate = {
  __typename?: 'merchant_accounts_aggregate'
  aggregate?: Maybe<Merchant_Accounts_Aggregate_Fields>
  nodes: Array<Merchant_Accounts>
}

/** aggregate fields of "merchant_accounts" */
export type Merchant_Accounts_Aggregate_Fields = {
  __typename?: 'merchant_accounts_aggregate_fields'
  avg?: Maybe<Merchant_Accounts_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Merchant_Accounts_Max_Fields>
  min?: Maybe<Merchant_Accounts_Min_Fields>
  stddev?: Maybe<Merchant_Accounts_Stddev_Fields>
  stddev_pop?: Maybe<Merchant_Accounts_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Merchant_Accounts_Stddev_Samp_Fields>
  sum?: Maybe<Merchant_Accounts_Sum_Fields>
  var_pop?: Maybe<Merchant_Accounts_Var_Pop_Fields>
  var_samp?: Maybe<Merchant_Accounts_Var_Samp_Fields>
  variance?: Maybe<Merchant_Accounts_Variance_Fields>
}

/** aggregate fields of "merchant_accounts" */
export type Merchant_Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Merchant_Accounts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** aggregate avg on columns */
export type Merchant_Accounts_Avg_Fields = {
  __typename?: 'merchant_accounts_avg_fields'
  status?: Maybe<Scalars['Float']>
}

/** Boolean expression to filter rows from the table "merchant_accounts". All fields are combined with a logical 'AND'. */
export type Merchant_Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Merchant_Accounts_Bool_Exp>>
  _not?: InputMaybe<Merchant_Accounts_Bool_Exp>
  _or?: InputMaybe<Array<Merchant_Accounts_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  merchant_charges?: InputMaybe<Merchant_Charges_Bool_Exp>
  merchant_coupons?: InputMaybe<Merchant_Coupons_Bool_Exp>
  merchant_customers?: InputMaybe<Merchant_Customers_Bool_Exp>
  merchant_prices?: InputMaybe<Merchant_Prices_Bool_Exp>
  merchant_products?: InputMaybe<Merchant_Products_Bool_Exp>
  payment_processor_id?: InputMaybe<String_Comparison_Exp>
  status?: InputMaybe<Int_Comparison_Exp>
}

/** unique or primary key constraints on table "merchant_accounts" */
export type Merchant_Accounts_Constraint =
  /** unique or primary key constraint */
  'merchant_accounts_pkey'

/** input type for incrementing numeric columns in table "merchant_accounts" */
export type Merchant_Accounts_Inc_Input = {
  status?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "merchant_accounts" */
export type Merchant_Accounts_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  merchant_charges?: InputMaybe<Merchant_Charges_Arr_Rel_Insert_Input>
  merchant_coupons?: InputMaybe<Merchant_Coupons_Arr_Rel_Insert_Input>
  merchant_customers?: InputMaybe<Merchant_Customers_Arr_Rel_Insert_Input>
  merchant_prices?: InputMaybe<Merchant_Prices_Arr_Rel_Insert_Input>
  merchant_products?: InputMaybe<Merchant_Products_Arr_Rel_Insert_Input>
  payment_processor_id?: InputMaybe<Scalars['String']>
  status?: InputMaybe<Scalars['Int']>
}

/** aggregate max on columns */
export type Merchant_Accounts_Max_Fields = {
  __typename?: 'merchant_accounts_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  payment_processor_id?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['Int']>
}

/** aggregate min on columns */
export type Merchant_Accounts_Min_Fields = {
  __typename?: 'merchant_accounts_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  payment_processor_id?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['Int']>
}

/** response of any mutation on the table "merchant_accounts" */
export type Merchant_Accounts_Mutation_Response = {
  __typename?: 'merchant_accounts_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Merchant_Accounts>
}

/** input type for inserting object relation for remote table "merchant_accounts" */
export type Merchant_Accounts_Obj_Rel_Insert_Input = {
  data: Merchant_Accounts_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Accounts_On_Conflict>
}

/** on_conflict condition type for table "merchant_accounts" */
export type Merchant_Accounts_On_Conflict = {
  constraint: Merchant_Accounts_Constraint
  update_columns?: Array<Merchant_Accounts_Update_Column>
  where?: InputMaybe<Merchant_Accounts_Bool_Exp>
}

/** Ordering options when selecting data from "merchant_accounts". */
export type Merchant_Accounts_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  merchant_charges_aggregate?: InputMaybe<Merchant_Charges_Aggregate_Order_By>
  merchant_coupons_aggregate?: InputMaybe<Merchant_Coupons_Aggregate_Order_By>
  merchant_customers_aggregate?: InputMaybe<Merchant_Customers_Aggregate_Order_By>
  merchant_prices_aggregate?: InputMaybe<Merchant_Prices_Aggregate_Order_By>
  merchant_products_aggregate?: InputMaybe<Merchant_Products_Aggregate_Order_By>
  payment_processor_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** primary key columns input for table: merchant_accounts */
export type Merchant_Accounts_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "merchant_accounts" */
export type Merchant_Accounts_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'payment_processor_id'
  /** column name */
  | 'status'

/** input type for updating data in table "merchant_accounts" */
export type Merchant_Accounts_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  payment_processor_id?: InputMaybe<Scalars['String']>
  status?: InputMaybe<Scalars['Int']>
}

/** aggregate stddev on columns */
export type Merchant_Accounts_Stddev_Fields = {
  __typename?: 'merchant_accounts_stddev_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate stddev_pop on columns */
export type Merchant_Accounts_Stddev_Pop_Fields = {
  __typename?: 'merchant_accounts_stddev_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate stddev_samp on columns */
export type Merchant_Accounts_Stddev_Samp_Fields = {
  __typename?: 'merchant_accounts_stddev_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate sum on columns */
export type Merchant_Accounts_Sum_Fields = {
  __typename?: 'merchant_accounts_sum_fields'
  status?: Maybe<Scalars['Int']>
}

/** update columns of table "merchant_accounts" */
export type Merchant_Accounts_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'payment_processor_id'
  /** column name */
  | 'status'

/** aggregate var_pop on columns */
export type Merchant_Accounts_Var_Pop_Fields = {
  __typename?: 'merchant_accounts_var_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate var_samp on columns */
export type Merchant_Accounts_Var_Samp_Fields = {
  __typename?: 'merchant_accounts_var_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate variance on columns */
export type Merchant_Accounts_Variance_Fields = {
  __typename?: 'merchant_accounts_variance_fields'
  status?: Maybe<Scalars['Float']>
}

/** columns and relationships of "merchant_charges" */
export type Merchant_Charges = {
  __typename?: 'merchant_charges'
  created_at: Scalars['timestamptz']
  id: Scalars['uuid']
  identifier?: Maybe<Scalars['String']>
  /** An object relationship */
  merchant_account: Merchant_Accounts
  merchant_account_id: Scalars['uuid']
  /** An object relationship */
  merchant_customer?: Maybe<Merchant_Customers>
  merchant_customer_id?: Maybe<Scalars['uuid']>
  /** An object relationship */
  merchant_product: Merchant_Products
  merchant_product_id: Scalars['uuid']
  /** An array relationship */
  purchases: Array<Purchases>
  /** An aggregate relationship */
  purchases_aggregate: Purchases_Aggregate
  status: Scalars['Int']
  /** An object relationship */
  user: Users
  user_id: Scalars['uuid']
}

/** columns and relationships of "merchant_charges" */
export type Merchant_ChargesPurchasesArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** columns and relationships of "merchant_charges" */
export type Merchant_ChargesPurchases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** aggregated selection of "merchant_charges" */
export type Merchant_Charges_Aggregate = {
  __typename?: 'merchant_charges_aggregate'
  aggregate?: Maybe<Merchant_Charges_Aggregate_Fields>
  nodes: Array<Merchant_Charges>
}

/** aggregate fields of "merchant_charges" */
export type Merchant_Charges_Aggregate_Fields = {
  __typename?: 'merchant_charges_aggregate_fields'
  avg?: Maybe<Merchant_Charges_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Merchant_Charges_Max_Fields>
  min?: Maybe<Merchant_Charges_Min_Fields>
  stddev?: Maybe<Merchant_Charges_Stddev_Fields>
  stddev_pop?: Maybe<Merchant_Charges_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Merchant_Charges_Stddev_Samp_Fields>
  sum?: Maybe<Merchant_Charges_Sum_Fields>
  var_pop?: Maybe<Merchant_Charges_Var_Pop_Fields>
  var_samp?: Maybe<Merchant_Charges_Var_Samp_Fields>
  variance?: Maybe<Merchant_Charges_Variance_Fields>
}

/** aggregate fields of "merchant_charges" */
export type Merchant_Charges_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "merchant_charges" */
export type Merchant_Charges_Aggregate_Order_By = {
  avg?: InputMaybe<Merchant_Charges_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Merchant_Charges_Max_Order_By>
  min?: InputMaybe<Merchant_Charges_Min_Order_By>
  stddev?: InputMaybe<Merchant_Charges_Stddev_Order_By>
  stddev_pop?: InputMaybe<Merchant_Charges_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Merchant_Charges_Stddev_Samp_Order_By>
  sum?: InputMaybe<Merchant_Charges_Sum_Order_By>
  var_pop?: InputMaybe<Merchant_Charges_Var_Pop_Order_By>
  var_samp?: InputMaybe<Merchant_Charges_Var_Samp_Order_By>
  variance?: InputMaybe<Merchant_Charges_Variance_Order_By>
}

/** input type for inserting array relation for remote table "merchant_charges" */
export type Merchant_Charges_Arr_Rel_Insert_Input = {
  data: Array<Merchant_Charges_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Charges_On_Conflict>
}

/** aggregate avg on columns */
export type Merchant_Charges_Avg_Fields = {
  __typename?: 'merchant_charges_avg_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "merchant_charges" */
export type Merchant_Charges_Avg_Order_By = {
  status?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "merchant_charges". All fields are combined with a logical 'AND'. */
export type Merchant_Charges_Bool_Exp = {
  _and?: InputMaybe<Array<Merchant_Charges_Bool_Exp>>
  _not?: InputMaybe<Merchant_Charges_Bool_Exp>
  _or?: InputMaybe<Array<Merchant_Charges_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  identifier?: InputMaybe<String_Comparison_Exp>
  merchant_account?: InputMaybe<Merchant_Accounts_Bool_Exp>
  merchant_account_id?: InputMaybe<Uuid_Comparison_Exp>
  merchant_customer?: InputMaybe<Merchant_Customers_Bool_Exp>
  merchant_customer_id?: InputMaybe<Uuid_Comparison_Exp>
  merchant_product?: InputMaybe<Merchant_Products_Bool_Exp>
  merchant_product_id?: InputMaybe<Uuid_Comparison_Exp>
  purchases?: InputMaybe<Purchases_Bool_Exp>
  status?: InputMaybe<Int_Comparison_Exp>
  user?: InputMaybe<Users_Bool_Exp>
  user_id?: InputMaybe<Uuid_Comparison_Exp>
}

/** unique or primary key constraints on table "merchant_charges" */
export type Merchant_Charges_Constraint =
  /** unique or primary key constraint */
  'merchant_charges_pkey'

/** input type for incrementing numeric columns in table "merchant_charges" */
export type Merchant_Charges_Inc_Input = {
  status?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "merchant_charges" */
export type Merchant_Charges_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account?: InputMaybe<Merchant_Accounts_Obj_Rel_Insert_Input>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  merchant_customer?: InputMaybe<Merchant_Customers_Obj_Rel_Insert_Input>
  merchant_customer_id?: InputMaybe<Scalars['uuid']>
  merchant_product?: InputMaybe<Merchant_Products_Obj_Rel_Insert_Input>
  merchant_product_id?: InputMaybe<Scalars['uuid']>
  purchases?: InputMaybe<Purchases_Arr_Rel_Insert_Input>
  status?: InputMaybe<Scalars['Int']>
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** aggregate max on columns */
export type Merchant_Charges_Max_Fields = {
  __typename?: 'merchant_charges_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  merchant_customer_id?: Maybe<Scalars['uuid']>
  merchant_product_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
  user_id?: Maybe<Scalars['uuid']>
}

/** order by max() on columns of table "merchant_charges" */
export type Merchant_Charges_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  merchant_customer_id?: InputMaybe<Order_By>
  merchant_product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Merchant_Charges_Min_Fields = {
  __typename?: 'merchant_charges_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  merchant_customer_id?: Maybe<Scalars['uuid']>
  merchant_product_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
  user_id?: Maybe<Scalars['uuid']>
}

/** order by min() on columns of table "merchant_charges" */
export type Merchant_Charges_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  merchant_customer_id?: InputMaybe<Order_By>
  merchant_product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** response of any mutation on the table "merchant_charges" */
export type Merchant_Charges_Mutation_Response = {
  __typename?: 'merchant_charges_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Merchant_Charges>
}

/** input type for inserting object relation for remote table "merchant_charges" */
export type Merchant_Charges_Obj_Rel_Insert_Input = {
  data: Merchant_Charges_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Charges_On_Conflict>
}

/** on_conflict condition type for table "merchant_charges" */
export type Merchant_Charges_On_Conflict = {
  constraint: Merchant_Charges_Constraint
  update_columns?: Array<Merchant_Charges_Update_Column>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

/** Ordering options when selecting data from "merchant_charges". */
export type Merchant_Charges_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account?: InputMaybe<Merchant_Accounts_Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  merchant_customer?: InputMaybe<Merchant_Customers_Order_By>
  merchant_customer_id?: InputMaybe<Order_By>
  merchant_product?: InputMaybe<Merchant_Products_Order_By>
  merchant_product_id?: InputMaybe<Order_By>
  purchases_aggregate?: InputMaybe<Purchases_Aggregate_Order_By>
  status?: InputMaybe<Order_By>
  user?: InputMaybe<Users_Order_By>
  user_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: merchant_charges */
export type Merchant_Charges_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "merchant_charges" */
export type Merchant_Charges_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'merchant_customer_id'
  /** column name */
  | 'merchant_product_id'
  /** column name */
  | 'status'
  /** column name */
  | 'user_id'

/** input type for updating data in table "merchant_charges" */
export type Merchant_Charges_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  merchant_customer_id?: InputMaybe<Scalars['uuid']>
  merchant_product_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['Int']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** aggregate stddev on columns */
export type Merchant_Charges_Stddev_Fields = {
  __typename?: 'merchant_charges_stddev_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "merchant_charges" */
export type Merchant_Charges_Stddev_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Merchant_Charges_Stddev_Pop_Fields = {
  __typename?: 'merchant_charges_stddev_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "merchant_charges" */
export type Merchant_Charges_Stddev_Pop_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Merchant_Charges_Stddev_Samp_Fields = {
  __typename?: 'merchant_charges_stddev_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "merchant_charges" */
export type Merchant_Charges_Stddev_Samp_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Merchant_Charges_Sum_Fields = {
  __typename?: 'merchant_charges_sum_fields'
  status?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "merchant_charges" */
export type Merchant_Charges_Sum_Order_By = {
  status?: InputMaybe<Order_By>
}

/** update columns of table "merchant_charges" */
export type Merchant_Charges_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'merchant_customer_id'
  /** column name */
  | 'merchant_product_id'
  /** column name */
  | 'status'
  /** column name */
  | 'user_id'

/** aggregate var_pop on columns */
export type Merchant_Charges_Var_Pop_Fields = {
  __typename?: 'merchant_charges_var_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "merchant_charges" */
export type Merchant_Charges_Var_Pop_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Merchant_Charges_Var_Samp_Fields = {
  __typename?: 'merchant_charges_var_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "merchant_charges" */
export type Merchant_Charges_Var_Samp_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Merchant_Charges_Variance_Fields = {
  __typename?: 'merchant_charges_variance_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "merchant_charges" */
export type Merchant_Charges_Variance_Order_By = {
  status?: InputMaybe<Order_By>
}

/** columns and relationships of "merchant_coupons" */
export type Merchant_Coupons = {
  __typename?: 'merchant_coupons'
  /** An array relationship */
  coupons: Array<Coupons>
  /** An aggregate relationship */
  coupons_aggregate: Coupons_Aggregate
  id: Scalars['uuid']
  identifier?: Maybe<Scalars['String']>
  /** An object relationship */
  merchant_account: Merchant_Accounts
  merchant_account_id: Scalars['uuid']
  percentage_discount: Scalars['numeric']
  status: Scalars['Int']
  type?: Maybe<Scalars['String']>
}

/** columns and relationships of "merchant_coupons" */
export type Merchant_CouponsCouponsArgs = {
  distinct_on?: InputMaybe<Array<Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Coupons_Order_By>>
  where?: InputMaybe<Coupons_Bool_Exp>
}

/** columns and relationships of "merchant_coupons" */
export type Merchant_CouponsCoupons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Coupons_Order_By>>
  where?: InputMaybe<Coupons_Bool_Exp>
}

/** aggregated selection of "merchant_coupons" */
export type Merchant_Coupons_Aggregate = {
  __typename?: 'merchant_coupons_aggregate'
  aggregate?: Maybe<Merchant_Coupons_Aggregate_Fields>
  nodes: Array<Merchant_Coupons>
}

/** aggregate fields of "merchant_coupons" */
export type Merchant_Coupons_Aggregate_Fields = {
  __typename?: 'merchant_coupons_aggregate_fields'
  avg?: Maybe<Merchant_Coupons_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Merchant_Coupons_Max_Fields>
  min?: Maybe<Merchant_Coupons_Min_Fields>
  stddev?: Maybe<Merchant_Coupons_Stddev_Fields>
  stddev_pop?: Maybe<Merchant_Coupons_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Merchant_Coupons_Stddev_Samp_Fields>
  sum?: Maybe<Merchant_Coupons_Sum_Fields>
  var_pop?: Maybe<Merchant_Coupons_Var_Pop_Fields>
  var_samp?: Maybe<Merchant_Coupons_Var_Samp_Fields>
  variance?: Maybe<Merchant_Coupons_Variance_Fields>
}

/** aggregate fields of "merchant_coupons" */
export type Merchant_Coupons_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Merchant_Coupons_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "merchant_coupons" */
export type Merchant_Coupons_Aggregate_Order_By = {
  avg?: InputMaybe<Merchant_Coupons_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Merchant_Coupons_Max_Order_By>
  min?: InputMaybe<Merchant_Coupons_Min_Order_By>
  stddev?: InputMaybe<Merchant_Coupons_Stddev_Order_By>
  stddev_pop?: InputMaybe<Merchant_Coupons_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Merchant_Coupons_Stddev_Samp_Order_By>
  sum?: InputMaybe<Merchant_Coupons_Sum_Order_By>
  var_pop?: InputMaybe<Merchant_Coupons_Var_Pop_Order_By>
  var_samp?: InputMaybe<Merchant_Coupons_Var_Samp_Order_By>
  variance?: InputMaybe<Merchant_Coupons_Variance_Order_By>
}

/** input type for inserting array relation for remote table "merchant_coupons" */
export type Merchant_Coupons_Arr_Rel_Insert_Input = {
  data: Array<Merchant_Coupons_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Coupons_On_Conflict>
}

/** aggregate avg on columns */
export type Merchant_Coupons_Avg_Fields = {
  __typename?: 'merchant_coupons_avg_fields'
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Avg_Order_By = {
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "merchant_coupons". All fields are combined with a logical 'AND'. */
export type Merchant_Coupons_Bool_Exp = {
  _and?: InputMaybe<Array<Merchant_Coupons_Bool_Exp>>
  _not?: InputMaybe<Merchant_Coupons_Bool_Exp>
  _or?: InputMaybe<Array<Merchant_Coupons_Bool_Exp>>
  coupons?: InputMaybe<Coupons_Bool_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  identifier?: InputMaybe<String_Comparison_Exp>
  merchant_account?: InputMaybe<Merchant_Accounts_Bool_Exp>
  merchant_account_id?: InputMaybe<Uuid_Comparison_Exp>
  percentage_discount?: InputMaybe<Numeric_Comparison_Exp>
  status?: InputMaybe<Int_Comparison_Exp>
  type?: InputMaybe<String_Comparison_Exp>
}

/** unique or primary key constraints on table "merchant_coupons" */
export type Merchant_Coupons_Constraint =
  /** unique or primary key constraint */
  'merchant_coupons_pkey'

/** input type for incrementing numeric columns in table "merchant_coupons" */
export type Merchant_Coupons_Inc_Input = {
  percentage_discount?: InputMaybe<Scalars['numeric']>
  status?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "merchant_coupons" */
export type Merchant_Coupons_Insert_Input = {
  coupons?: InputMaybe<Coupons_Arr_Rel_Insert_Input>
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account?: InputMaybe<Merchant_Accounts_Obj_Rel_Insert_Input>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  percentage_discount?: InputMaybe<Scalars['numeric']>
  status?: InputMaybe<Scalars['Int']>
  type?: InputMaybe<Scalars['String']>
}

/** aggregate max on columns */
export type Merchant_Coupons_Max_Fields = {
  __typename?: 'merchant_coupons_max_fields'
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  percentage_discount?: Maybe<Scalars['numeric']>
  status?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Max_Order_By = {
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Merchant_Coupons_Min_Fields = {
  __typename?: 'merchant_coupons_min_fields'
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  percentage_discount?: Maybe<Scalars['numeric']>
  status?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Min_Order_By = {
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
}

/** response of any mutation on the table "merchant_coupons" */
export type Merchant_Coupons_Mutation_Response = {
  __typename?: 'merchant_coupons_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Merchant_Coupons>
}

/** input type for inserting object relation for remote table "merchant_coupons" */
export type Merchant_Coupons_Obj_Rel_Insert_Input = {
  data: Merchant_Coupons_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Coupons_On_Conflict>
}

/** on_conflict condition type for table "merchant_coupons" */
export type Merchant_Coupons_On_Conflict = {
  constraint: Merchant_Coupons_Constraint
  update_columns?: Array<Merchant_Coupons_Update_Column>
  where?: InputMaybe<Merchant_Coupons_Bool_Exp>
}

/** Ordering options when selecting data from "merchant_coupons". */
export type Merchant_Coupons_Order_By = {
  coupons_aggregate?: InputMaybe<Coupons_Aggregate_Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account?: InputMaybe<Merchant_Accounts_Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
}

/** primary key columns input for table: merchant_coupons */
export type Merchant_Coupons_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "merchant_coupons" */
export type Merchant_Coupons_Select_Column =
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'percentage_discount'
  /** column name */
  | 'status'
  /** column name */
  | 'type'

/** input type for updating data in table "merchant_coupons" */
export type Merchant_Coupons_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  percentage_discount?: InputMaybe<Scalars['numeric']>
  status?: InputMaybe<Scalars['Int']>
  type?: InputMaybe<Scalars['String']>
}

/** aggregate stddev on columns */
export type Merchant_Coupons_Stddev_Fields = {
  __typename?: 'merchant_coupons_stddev_fields'
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Stddev_Order_By = {
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Merchant_Coupons_Stddev_Pop_Fields = {
  __typename?: 'merchant_coupons_stddev_pop_fields'
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Stddev_Pop_Order_By = {
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Merchant_Coupons_Stddev_Samp_Fields = {
  __typename?: 'merchant_coupons_stddev_samp_fields'
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Stddev_Samp_Order_By = {
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Merchant_Coupons_Sum_Fields = {
  __typename?: 'merchant_coupons_sum_fields'
  percentage_discount?: Maybe<Scalars['numeric']>
  status?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Sum_Order_By = {
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** update columns of table "merchant_coupons" */
export type Merchant_Coupons_Update_Column =
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'percentage_discount'
  /** column name */
  | 'status'
  /** column name */
  | 'type'

/** aggregate var_pop on columns */
export type Merchant_Coupons_Var_Pop_Fields = {
  __typename?: 'merchant_coupons_var_pop_fields'
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Var_Pop_Order_By = {
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Merchant_Coupons_Var_Samp_Fields = {
  __typename?: 'merchant_coupons_var_samp_fields'
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Var_Samp_Order_By = {
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Merchant_Coupons_Variance_Fields = {
  __typename?: 'merchant_coupons_variance_fields'
  percentage_discount?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "merchant_coupons" */
export type Merchant_Coupons_Variance_Order_By = {
  percentage_discount?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** columns and relationships of "merchant_customers" */
export type Merchant_Customers = {
  __typename?: 'merchant_customers'
  created_at: Scalars['timestamptz']
  id: Scalars['uuid']
  identifier: Scalars['String']
  /** An object relationship */
  merchant_account: Merchant_Accounts
  merchant_account_id: Scalars['uuid']
  /** An array relationship */
  merchant_charges: Array<Merchant_Charges>
  /** An aggregate relationship */
  merchant_charges_aggregate: Merchant_Charges_Aggregate
  status?: Maybe<Scalars['Int']>
  /** An object relationship */
  user: Users
  user_id: Scalars['uuid']
}

/** columns and relationships of "merchant_customers" */
export type Merchant_CustomersMerchant_ChargesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

/** columns and relationships of "merchant_customers" */
export type Merchant_CustomersMerchant_Charges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

/** aggregated selection of "merchant_customers" */
export type Merchant_Customers_Aggregate = {
  __typename?: 'merchant_customers_aggregate'
  aggregate?: Maybe<Merchant_Customers_Aggregate_Fields>
  nodes: Array<Merchant_Customers>
}

/** aggregate fields of "merchant_customers" */
export type Merchant_Customers_Aggregate_Fields = {
  __typename?: 'merchant_customers_aggregate_fields'
  avg?: Maybe<Merchant_Customers_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Merchant_Customers_Max_Fields>
  min?: Maybe<Merchant_Customers_Min_Fields>
  stddev?: Maybe<Merchant_Customers_Stddev_Fields>
  stddev_pop?: Maybe<Merchant_Customers_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Merchant_Customers_Stddev_Samp_Fields>
  sum?: Maybe<Merchant_Customers_Sum_Fields>
  var_pop?: Maybe<Merchant_Customers_Var_Pop_Fields>
  var_samp?: Maybe<Merchant_Customers_Var_Samp_Fields>
  variance?: Maybe<Merchant_Customers_Variance_Fields>
}

/** aggregate fields of "merchant_customers" */
export type Merchant_Customers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Merchant_Customers_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "merchant_customers" */
export type Merchant_Customers_Aggregate_Order_By = {
  avg?: InputMaybe<Merchant_Customers_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Merchant_Customers_Max_Order_By>
  min?: InputMaybe<Merchant_Customers_Min_Order_By>
  stddev?: InputMaybe<Merchant_Customers_Stddev_Order_By>
  stddev_pop?: InputMaybe<Merchant_Customers_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Merchant_Customers_Stddev_Samp_Order_By>
  sum?: InputMaybe<Merchant_Customers_Sum_Order_By>
  var_pop?: InputMaybe<Merchant_Customers_Var_Pop_Order_By>
  var_samp?: InputMaybe<Merchant_Customers_Var_Samp_Order_By>
  variance?: InputMaybe<Merchant_Customers_Variance_Order_By>
}

/** input type for inserting array relation for remote table "merchant_customers" */
export type Merchant_Customers_Arr_Rel_Insert_Input = {
  data: Array<Merchant_Customers_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Customers_On_Conflict>
}

/** aggregate avg on columns */
export type Merchant_Customers_Avg_Fields = {
  __typename?: 'merchant_customers_avg_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "merchant_customers" */
export type Merchant_Customers_Avg_Order_By = {
  status?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "merchant_customers". All fields are combined with a logical 'AND'. */
export type Merchant_Customers_Bool_Exp = {
  _and?: InputMaybe<Array<Merchant_Customers_Bool_Exp>>
  _not?: InputMaybe<Merchant_Customers_Bool_Exp>
  _or?: InputMaybe<Array<Merchant_Customers_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  identifier?: InputMaybe<String_Comparison_Exp>
  merchant_account?: InputMaybe<Merchant_Accounts_Bool_Exp>
  merchant_account_id?: InputMaybe<Uuid_Comparison_Exp>
  merchant_charges?: InputMaybe<Merchant_Charges_Bool_Exp>
  status?: InputMaybe<Int_Comparison_Exp>
  user?: InputMaybe<Users_Bool_Exp>
  user_id?: InputMaybe<Uuid_Comparison_Exp>
}

/** unique or primary key constraints on table "merchant_customers" */
export type Merchant_Customers_Constraint =
  /** unique or primary key constraint */
  'merchant_customers_pkey'

/** input type for incrementing numeric columns in table "merchant_customers" */
export type Merchant_Customers_Inc_Input = {
  status?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "merchant_customers" */
export type Merchant_Customers_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account?: InputMaybe<Merchant_Accounts_Obj_Rel_Insert_Input>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  merchant_charges?: InputMaybe<Merchant_Charges_Arr_Rel_Insert_Input>
  status?: InputMaybe<Scalars['Int']>
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** aggregate max on columns */
export type Merchant_Customers_Max_Fields = {
  __typename?: 'merchant_customers_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
  user_id?: Maybe<Scalars['uuid']>
}

/** order by max() on columns of table "merchant_customers" */
export type Merchant_Customers_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Merchant_Customers_Min_Fields = {
  __typename?: 'merchant_customers_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
  user_id?: Maybe<Scalars['uuid']>
}

/** order by min() on columns of table "merchant_customers" */
export type Merchant_Customers_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** response of any mutation on the table "merchant_customers" */
export type Merchant_Customers_Mutation_Response = {
  __typename?: 'merchant_customers_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Merchant_Customers>
}

/** input type for inserting object relation for remote table "merchant_customers" */
export type Merchant_Customers_Obj_Rel_Insert_Input = {
  data: Merchant_Customers_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Customers_On_Conflict>
}

/** on_conflict condition type for table "merchant_customers" */
export type Merchant_Customers_On_Conflict = {
  constraint: Merchant_Customers_Constraint
  update_columns?: Array<Merchant_Customers_Update_Column>
  where?: InputMaybe<Merchant_Customers_Bool_Exp>
}

/** Ordering options when selecting data from "merchant_customers". */
export type Merchant_Customers_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account?: InputMaybe<Merchant_Accounts_Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  merchant_charges_aggregate?: InputMaybe<Merchant_Charges_Aggregate_Order_By>
  status?: InputMaybe<Order_By>
  user?: InputMaybe<Users_Order_By>
  user_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: merchant_customers */
export type Merchant_Customers_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "merchant_customers" */
export type Merchant_Customers_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'status'
  /** column name */
  | 'user_id'

/** input type for updating data in table "merchant_customers" */
export type Merchant_Customers_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['Int']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** aggregate stddev on columns */
export type Merchant_Customers_Stddev_Fields = {
  __typename?: 'merchant_customers_stddev_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "merchant_customers" */
export type Merchant_Customers_Stddev_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Merchant_Customers_Stddev_Pop_Fields = {
  __typename?: 'merchant_customers_stddev_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "merchant_customers" */
export type Merchant_Customers_Stddev_Pop_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Merchant_Customers_Stddev_Samp_Fields = {
  __typename?: 'merchant_customers_stddev_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "merchant_customers" */
export type Merchant_Customers_Stddev_Samp_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Merchant_Customers_Sum_Fields = {
  __typename?: 'merchant_customers_sum_fields'
  status?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "merchant_customers" */
export type Merchant_Customers_Sum_Order_By = {
  status?: InputMaybe<Order_By>
}

/** update columns of table "merchant_customers" */
export type Merchant_Customers_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'status'
  /** column name */
  | 'user_id'

/** aggregate var_pop on columns */
export type Merchant_Customers_Var_Pop_Fields = {
  __typename?: 'merchant_customers_var_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "merchant_customers" */
export type Merchant_Customers_Var_Pop_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Merchant_Customers_Var_Samp_Fields = {
  __typename?: 'merchant_customers_var_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "merchant_customers" */
export type Merchant_Customers_Var_Samp_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Merchant_Customers_Variance_Fields = {
  __typename?: 'merchant_customers_variance_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "merchant_customers" */
export type Merchant_Customers_Variance_Order_By = {
  status?: InputMaybe<Order_By>
}

/** columns and relationships of "merchant_prices" */
export type Merchant_Prices = {
  __typename?: 'merchant_prices'
  created_at: Scalars['timestamptz']
  id: Scalars['uuid']
  identifier?: Maybe<Scalars['String']>
  /** An object relationship */
  merchant_account: Merchant_Accounts
  merchant_account_id: Scalars['uuid']
  /** An object relationship */
  merchant_product: Merchant_Products
  merchant_product_id: Scalars['uuid']
  /** An object relationship */
  price: Prices
  price_id: Scalars['uuid']
  status: Scalars['numeric']
}

/** aggregated selection of "merchant_prices" */
export type Merchant_Prices_Aggregate = {
  __typename?: 'merchant_prices_aggregate'
  aggregate?: Maybe<Merchant_Prices_Aggregate_Fields>
  nodes: Array<Merchant_Prices>
}

/** aggregate fields of "merchant_prices" */
export type Merchant_Prices_Aggregate_Fields = {
  __typename?: 'merchant_prices_aggregate_fields'
  avg?: Maybe<Merchant_Prices_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Merchant_Prices_Max_Fields>
  min?: Maybe<Merchant_Prices_Min_Fields>
  stddev?: Maybe<Merchant_Prices_Stddev_Fields>
  stddev_pop?: Maybe<Merchant_Prices_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Merchant_Prices_Stddev_Samp_Fields>
  sum?: Maybe<Merchant_Prices_Sum_Fields>
  var_pop?: Maybe<Merchant_Prices_Var_Pop_Fields>
  var_samp?: Maybe<Merchant_Prices_Var_Samp_Fields>
  variance?: Maybe<Merchant_Prices_Variance_Fields>
}

/** aggregate fields of "merchant_prices" */
export type Merchant_Prices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "merchant_prices" */
export type Merchant_Prices_Aggregate_Order_By = {
  avg?: InputMaybe<Merchant_Prices_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Merchant_Prices_Max_Order_By>
  min?: InputMaybe<Merchant_Prices_Min_Order_By>
  stddev?: InputMaybe<Merchant_Prices_Stddev_Order_By>
  stddev_pop?: InputMaybe<Merchant_Prices_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Merchant_Prices_Stddev_Samp_Order_By>
  sum?: InputMaybe<Merchant_Prices_Sum_Order_By>
  var_pop?: InputMaybe<Merchant_Prices_Var_Pop_Order_By>
  var_samp?: InputMaybe<Merchant_Prices_Var_Samp_Order_By>
  variance?: InputMaybe<Merchant_Prices_Variance_Order_By>
}

/** input type for inserting array relation for remote table "merchant_prices" */
export type Merchant_Prices_Arr_Rel_Insert_Input = {
  data: Array<Merchant_Prices_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Prices_On_Conflict>
}

/** aggregate avg on columns */
export type Merchant_Prices_Avg_Fields = {
  __typename?: 'merchant_prices_avg_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "merchant_prices" */
export type Merchant_Prices_Avg_Order_By = {
  status?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "merchant_prices". All fields are combined with a logical 'AND'. */
export type Merchant_Prices_Bool_Exp = {
  _and?: InputMaybe<Array<Merchant_Prices_Bool_Exp>>
  _not?: InputMaybe<Merchant_Prices_Bool_Exp>
  _or?: InputMaybe<Array<Merchant_Prices_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  identifier?: InputMaybe<String_Comparison_Exp>
  merchant_account?: InputMaybe<Merchant_Accounts_Bool_Exp>
  merchant_account_id?: InputMaybe<Uuid_Comparison_Exp>
  merchant_product?: InputMaybe<Merchant_Products_Bool_Exp>
  merchant_product_id?: InputMaybe<Uuid_Comparison_Exp>
  price?: InputMaybe<Prices_Bool_Exp>
  price_id?: InputMaybe<Uuid_Comparison_Exp>
  status?: InputMaybe<Numeric_Comparison_Exp>
}

/** unique or primary key constraints on table "merchant_prices" */
export type Merchant_Prices_Constraint =
  /** unique or primary key constraint */
  'merchant_prices_pkey'

/** input type for incrementing numeric columns in table "merchant_prices" */
export type Merchant_Prices_Inc_Input = {
  status?: InputMaybe<Scalars['numeric']>
}

/** input type for inserting data into table "merchant_prices" */
export type Merchant_Prices_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account?: InputMaybe<Merchant_Accounts_Obj_Rel_Insert_Input>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  merchant_product?: InputMaybe<Merchant_Products_Obj_Rel_Insert_Input>
  merchant_product_id?: InputMaybe<Scalars['uuid']>
  price?: InputMaybe<Prices_Obj_Rel_Insert_Input>
  price_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['numeric']>
}

/** aggregate max on columns */
export type Merchant_Prices_Max_Fields = {
  __typename?: 'merchant_prices_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  merchant_product_id?: Maybe<Scalars['uuid']>
  price_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['numeric']>
}

/** order by max() on columns of table "merchant_prices" */
export type Merchant_Prices_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  merchant_product_id?: InputMaybe<Order_By>
  price_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Merchant_Prices_Min_Fields = {
  __typename?: 'merchant_prices_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  merchant_product_id?: Maybe<Scalars['uuid']>
  price_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['numeric']>
}

/** order by min() on columns of table "merchant_prices" */
export type Merchant_Prices_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  merchant_product_id?: InputMaybe<Order_By>
  price_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** response of any mutation on the table "merchant_prices" */
export type Merchant_Prices_Mutation_Response = {
  __typename?: 'merchant_prices_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Merchant_Prices>
}

/** on_conflict condition type for table "merchant_prices" */
export type Merchant_Prices_On_Conflict = {
  constraint: Merchant_Prices_Constraint
  update_columns?: Array<Merchant_Prices_Update_Column>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

/** Ordering options when selecting data from "merchant_prices". */
export type Merchant_Prices_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account?: InputMaybe<Merchant_Accounts_Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  merchant_product?: InputMaybe<Merchant_Products_Order_By>
  merchant_product_id?: InputMaybe<Order_By>
  price?: InputMaybe<Prices_Order_By>
  price_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** primary key columns input for table: merchant_prices */
export type Merchant_Prices_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "merchant_prices" */
export type Merchant_Prices_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'merchant_product_id'
  /** column name */
  | 'price_id'
  /** column name */
  | 'status'

/** input type for updating data in table "merchant_prices" */
export type Merchant_Prices_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  merchant_product_id?: InputMaybe<Scalars['uuid']>
  price_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['numeric']>
}

/** aggregate stddev on columns */
export type Merchant_Prices_Stddev_Fields = {
  __typename?: 'merchant_prices_stddev_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "merchant_prices" */
export type Merchant_Prices_Stddev_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Merchant_Prices_Stddev_Pop_Fields = {
  __typename?: 'merchant_prices_stddev_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "merchant_prices" */
export type Merchant_Prices_Stddev_Pop_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Merchant_Prices_Stddev_Samp_Fields = {
  __typename?: 'merchant_prices_stddev_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "merchant_prices" */
export type Merchant_Prices_Stddev_Samp_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Merchant_Prices_Sum_Fields = {
  __typename?: 'merchant_prices_sum_fields'
  status?: Maybe<Scalars['numeric']>
}

/** order by sum() on columns of table "merchant_prices" */
export type Merchant_Prices_Sum_Order_By = {
  status?: InputMaybe<Order_By>
}

/** update columns of table "merchant_prices" */
export type Merchant_Prices_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'merchant_product_id'
  /** column name */
  | 'price_id'
  /** column name */
  | 'status'

/** aggregate var_pop on columns */
export type Merchant_Prices_Var_Pop_Fields = {
  __typename?: 'merchant_prices_var_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "merchant_prices" */
export type Merchant_Prices_Var_Pop_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Merchant_Prices_Var_Samp_Fields = {
  __typename?: 'merchant_prices_var_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "merchant_prices" */
export type Merchant_Prices_Var_Samp_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Merchant_Prices_Variance_Fields = {
  __typename?: 'merchant_prices_variance_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "merchant_prices" */
export type Merchant_Prices_Variance_Order_By = {
  status?: InputMaybe<Order_By>
}

/** columns and relationships of "merchant_products" */
export type Merchant_Products = {
  __typename?: 'merchant_products'
  created_at: Scalars['timestamptz']
  id: Scalars['uuid']
  identifier?: Maybe<Scalars['String']>
  /** An object relationship */
  merchant_account: Merchant_Accounts
  merchant_account_id: Scalars['uuid']
  /** An array relationship */
  merchant_charges: Array<Merchant_Charges>
  /** An aggregate relationship */
  merchant_charges_aggregate: Merchant_Charges_Aggregate
  /** An array relationship */
  merchant_prices: Array<Merchant_Prices>
  /** An aggregate relationship */
  merchant_prices_aggregate: Merchant_Prices_Aggregate
  /** An object relationship */
  product: Products
  product_id: Scalars['uuid']
  status: Scalars['Int']
}

/** columns and relationships of "merchant_products" */
export type Merchant_ProductsMerchant_ChargesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

/** columns and relationships of "merchant_products" */
export type Merchant_ProductsMerchant_Charges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

/** columns and relationships of "merchant_products" */
export type Merchant_ProductsMerchant_PricesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

/** columns and relationships of "merchant_products" */
export type Merchant_ProductsMerchant_Prices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

/** aggregated selection of "merchant_products" */
export type Merchant_Products_Aggregate = {
  __typename?: 'merchant_products_aggregate'
  aggregate?: Maybe<Merchant_Products_Aggregate_Fields>
  nodes: Array<Merchant_Products>
}

/** aggregate fields of "merchant_products" */
export type Merchant_Products_Aggregate_Fields = {
  __typename?: 'merchant_products_aggregate_fields'
  avg?: Maybe<Merchant_Products_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Merchant_Products_Max_Fields>
  min?: Maybe<Merchant_Products_Min_Fields>
  stddev?: Maybe<Merchant_Products_Stddev_Fields>
  stddev_pop?: Maybe<Merchant_Products_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Merchant_Products_Stddev_Samp_Fields>
  sum?: Maybe<Merchant_Products_Sum_Fields>
  var_pop?: Maybe<Merchant_Products_Var_Pop_Fields>
  var_samp?: Maybe<Merchant_Products_Var_Samp_Fields>
  variance?: Maybe<Merchant_Products_Variance_Fields>
}

/** aggregate fields of "merchant_products" */
export type Merchant_Products_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Merchant_Products_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "merchant_products" */
export type Merchant_Products_Aggregate_Order_By = {
  avg?: InputMaybe<Merchant_Products_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Merchant_Products_Max_Order_By>
  min?: InputMaybe<Merchant_Products_Min_Order_By>
  stddev?: InputMaybe<Merchant_Products_Stddev_Order_By>
  stddev_pop?: InputMaybe<Merchant_Products_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Merchant_Products_Stddev_Samp_Order_By>
  sum?: InputMaybe<Merchant_Products_Sum_Order_By>
  var_pop?: InputMaybe<Merchant_Products_Var_Pop_Order_By>
  var_samp?: InputMaybe<Merchant_Products_Var_Samp_Order_By>
  variance?: InputMaybe<Merchant_Products_Variance_Order_By>
}

/** input type for inserting array relation for remote table "merchant_products" */
export type Merchant_Products_Arr_Rel_Insert_Input = {
  data: Array<Merchant_Products_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Products_On_Conflict>
}

/** aggregate avg on columns */
export type Merchant_Products_Avg_Fields = {
  __typename?: 'merchant_products_avg_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "merchant_products" */
export type Merchant_Products_Avg_Order_By = {
  status?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "merchant_products". All fields are combined with a logical 'AND'. */
export type Merchant_Products_Bool_Exp = {
  _and?: InputMaybe<Array<Merchant_Products_Bool_Exp>>
  _not?: InputMaybe<Merchant_Products_Bool_Exp>
  _or?: InputMaybe<Array<Merchant_Products_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  identifier?: InputMaybe<String_Comparison_Exp>
  merchant_account?: InputMaybe<Merchant_Accounts_Bool_Exp>
  merchant_account_id?: InputMaybe<Uuid_Comparison_Exp>
  merchant_charges?: InputMaybe<Merchant_Charges_Bool_Exp>
  merchant_prices?: InputMaybe<Merchant_Prices_Bool_Exp>
  product?: InputMaybe<Products_Bool_Exp>
  product_id?: InputMaybe<Uuid_Comparison_Exp>
  status?: InputMaybe<Int_Comparison_Exp>
}

/** unique or primary key constraints on table "merchant_products" */
export type Merchant_Products_Constraint =
  /** unique or primary key constraint */
  'merchant_products_pkey'

/** input type for incrementing numeric columns in table "merchant_products" */
export type Merchant_Products_Inc_Input = {
  status?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "merchant_products" */
export type Merchant_Products_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account?: InputMaybe<Merchant_Accounts_Obj_Rel_Insert_Input>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  merchant_charges?: InputMaybe<Merchant_Charges_Arr_Rel_Insert_Input>
  merchant_prices?: InputMaybe<Merchant_Prices_Arr_Rel_Insert_Input>
  product?: InputMaybe<Products_Obj_Rel_Insert_Input>
  product_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['Int']>
}

/** aggregate max on columns */
export type Merchant_Products_Max_Fields = {
  __typename?: 'merchant_products_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  product_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
}

/** order by max() on columns of table "merchant_products" */
export type Merchant_Products_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Merchant_Products_Min_Fields = {
  __typename?: 'merchant_products_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  identifier?: Maybe<Scalars['String']>
  merchant_account_id?: Maybe<Scalars['uuid']>
  product_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
}

/** order by min() on columns of table "merchant_products" */
export type Merchant_Products_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** response of any mutation on the table "merchant_products" */
export type Merchant_Products_Mutation_Response = {
  __typename?: 'merchant_products_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Merchant_Products>
}

/** input type for inserting object relation for remote table "merchant_products" */
export type Merchant_Products_Obj_Rel_Insert_Input = {
  data: Merchant_Products_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Products_On_Conflict>
}

/** on_conflict condition type for table "merchant_products" */
export type Merchant_Products_On_Conflict = {
  constraint: Merchant_Products_Constraint
  update_columns?: Array<Merchant_Products_Update_Column>
  where?: InputMaybe<Merchant_Products_Bool_Exp>
}

/** Ordering options when selecting data from "merchant_products". */
export type Merchant_Products_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  identifier?: InputMaybe<Order_By>
  merchant_account?: InputMaybe<Merchant_Accounts_Order_By>
  merchant_account_id?: InputMaybe<Order_By>
  merchant_charges_aggregate?: InputMaybe<Merchant_Charges_Aggregate_Order_By>
  merchant_prices_aggregate?: InputMaybe<Merchant_Prices_Aggregate_Order_By>
  product?: InputMaybe<Products_Order_By>
  product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
}

/** primary key columns input for table: merchant_products */
export type Merchant_Products_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "merchant_products" */
export type Merchant_Products_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'product_id'
  /** column name */
  | 'status'

/** input type for updating data in table "merchant_products" */
export type Merchant_Products_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  identifier?: InputMaybe<Scalars['String']>
  merchant_account_id?: InputMaybe<Scalars['uuid']>
  product_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['Int']>
}

/** aggregate stddev on columns */
export type Merchant_Products_Stddev_Fields = {
  __typename?: 'merchant_products_stddev_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "merchant_products" */
export type Merchant_Products_Stddev_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Merchant_Products_Stddev_Pop_Fields = {
  __typename?: 'merchant_products_stddev_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "merchant_products" */
export type Merchant_Products_Stddev_Pop_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Merchant_Products_Stddev_Samp_Fields = {
  __typename?: 'merchant_products_stddev_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "merchant_products" */
export type Merchant_Products_Stddev_Samp_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Merchant_Products_Sum_Fields = {
  __typename?: 'merchant_products_sum_fields'
  status?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "merchant_products" */
export type Merchant_Products_Sum_Order_By = {
  status?: InputMaybe<Order_By>
}

/** update columns of table "merchant_products" */
export type Merchant_Products_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier'
  /** column name */
  | 'merchant_account_id'
  /** column name */
  | 'product_id'
  /** column name */
  | 'status'

/** aggregate var_pop on columns */
export type Merchant_Products_Var_Pop_Fields = {
  __typename?: 'merchant_products_var_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "merchant_products" */
export type Merchant_Products_Var_Pop_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Merchant_Products_Var_Samp_Fields = {
  __typename?: 'merchant_products_var_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "merchant_products" */
export type Merchant_Products_Var_Samp_Order_By = {
  status?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Merchant_Products_Variance_Fields = {
  __typename?: 'merchant_products_variance_fields'
  status?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "merchant_products" */
export type Merchant_Products_Variance_Order_By = {
  status?: InputMaybe<Order_By>
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root'
  /** delete data from the table: "accounts" */
  delete_accounts?: Maybe<Accounts_Mutation_Response>
  /** delete single row from the table: "accounts" */
  delete_accounts_by_pk?: Maybe<Accounts>
  /** delete data from the table: "coupons" */
  delete_coupons?: Maybe<Coupons_Mutation_Response>
  /** delete single row from the table: "coupons" */
  delete_coupons_by_pk?: Maybe<Coupons>
  /** delete data from the table: "merchant_accounts" */
  delete_merchant_accounts?: Maybe<Merchant_Accounts_Mutation_Response>
  /** delete single row from the table: "merchant_accounts" */
  delete_merchant_accounts_by_pk?: Maybe<Merchant_Accounts>
  /** delete data from the table: "merchant_charges" */
  delete_merchant_charges?: Maybe<Merchant_Charges_Mutation_Response>
  /** delete single row from the table: "merchant_charges" */
  delete_merchant_charges_by_pk?: Maybe<Merchant_Charges>
  /** delete data from the table: "merchant_coupons" */
  delete_merchant_coupons?: Maybe<Merchant_Coupons_Mutation_Response>
  /** delete single row from the table: "merchant_coupons" */
  delete_merchant_coupons_by_pk?: Maybe<Merchant_Coupons>
  /** delete data from the table: "merchant_customers" */
  delete_merchant_customers?: Maybe<Merchant_Customers_Mutation_Response>
  /** delete single row from the table: "merchant_customers" */
  delete_merchant_customers_by_pk?: Maybe<Merchant_Customers>
  /** delete data from the table: "merchant_prices" */
  delete_merchant_prices?: Maybe<Merchant_Prices_Mutation_Response>
  /** delete single row from the table: "merchant_prices" */
  delete_merchant_prices_by_pk?: Maybe<Merchant_Prices>
  /** delete data from the table: "merchant_products" */
  delete_merchant_products?: Maybe<Merchant_Products_Mutation_Response>
  /** delete single row from the table: "merchant_products" */
  delete_merchant_products_by_pk?: Maybe<Merchant_Products>
  /** delete data from the table: "prices" */
  delete_prices?: Maybe<Prices_Mutation_Response>
  /** delete single row from the table: "prices" */
  delete_prices_by_pk?: Maybe<Prices>
  /** delete data from the table: "products" */
  delete_products?: Maybe<Products_Mutation_Response>
  /** delete single row from the table: "products" */
  delete_products_by_pk?: Maybe<Products>
  /** delete data from the table: "purchases" */
  delete_purchases?: Maybe<Purchases_Mutation_Response>
  /** delete single row from the table: "purchases" */
  delete_purchases_by_pk?: Maybe<Purchases>
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
  /** insert data into the table: "coupons" */
  insert_coupons?: Maybe<Coupons_Mutation_Response>
  /** insert a single row into the table: "coupons" */
  insert_coupons_one?: Maybe<Coupons>
  /** insert data into the table: "merchant_accounts" */
  insert_merchant_accounts?: Maybe<Merchant_Accounts_Mutation_Response>
  /** insert a single row into the table: "merchant_accounts" */
  insert_merchant_accounts_one?: Maybe<Merchant_Accounts>
  /** insert data into the table: "merchant_charges" */
  insert_merchant_charges?: Maybe<Merchant_Charges_Mutation_Response>
  /** insert a single row into the table: "merchant_charges" */
  insert_merchant_charges_one?: Maybe<Merchant_Charges>
  /** insert data into the table: "merchant_coupons" */
  insert_merchant_coupons?: Maybe<Merchant_Coupons_Mutation_Response>
  /** insert a single row into the table: "merchant_coupons" */
  insert_merchant_coupons_one?: Maybe<Merchant_Coupons>
  /** insert data into the table: "merchant_customers" */
  insert_merchant_customers?: Maybe<Merchant_Customers_Mutation_Response>
  /** insert a single row into the table: "merchant_customers" */
  insert_merchant_customers_one?: Maybe<Merchant_Customers>
  /** insert data into the table: "merchant_prices" */
  insert_merchant_prices?: Maybe<Merchant_Prices_Mutation_Response>
  /** insert a single row into the table: "merchant_prices" */
  insert_merchant_prices_one?: Maybe<Merchant_Prices>
  /** insert data into the table: "merchant_products" */
  insert_merchant_products?: Maybe<Merchant_Products_Mutation_Response>
  /** insert a single row into the table: "merchant_products" */
  insert_merchant_products_one?: Maybe<Merchant_Products>
  /** insert data into the table: "prices" */
  insert_prices?: Maybe<Prices_Mutation_Response>
  /** insert a single row into the table: "prices" */
  insert_prices_one?: Maybe<Prices>
  /** insert data into the table: "products" */
  insert_products?: Maybe<Products_Mutation_Response>
  /** insert a single row into the table: "products" */
  insert_products_one?: Maybe<Products>
  /** insert data into the table: "purchases" */
  insert_purchases?: Maybe<Purchases_Mutation_Response>
  /** insert a single row into the table: "purchases" */
  insert_purchases_one?: Maybe<Purchases>
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
  /** update data of the table: "coupons" */
  update_coupons?: Maybe<Coupons_Mutation_Response>
  /** update single row of the table: "coupons" */
  update_coupons_by_pk?: Maybe<Coupons>
  /** update data of the table: "merchant_accounts" */
  update_merchant_accounts?: Maybe<Merchant_Accounts_Mutation_Response>
  /** update single row of the table: "merchant_accounts" */
  update_merchant_accounts_by_pk?: Maybe<Merchant_Accounts>
  /** update data of the table: "merchant_charges" */
  update_merchant_charges?: Maybe<Merchant_Charges_Mutation_Response>
  /** update single row of the table: "merchant_charges" */
  update_merchant_charges_by_pk?: Maybe<Merchant_Charges>
  /** update data of the table: "merchant_coupons" */
  update_merchant_coupons?: Maybe<Merchant_Coupons_Mutation_Response>
  /** update single row of the table: "merchant_coupons" */
  update_merchant_coupons_by_pk?: Maybe<Merchant_Coupons>
  /** update data of the table: "merchant_customers" */
  update_merchant_customers?: Maybe<Merchant_Customers_Mutation_Response>
  /** update single row of the table: "merchant_customers" */
  update_merchant_customers_by_pk?: Maybe<Merchant_Customers>
  /** update data of the table: "merchant_prices" */
  update_merchant_prices?: Maybe<Merchant_Prices_Mutation_Response>
  /** update single row of the table: "merchant_prices" */
  update_merchant_prices_by_pk?: Maybe<Merchant_Prices>
  /** update data of the table: "merchant_products" */
  update_merchant_products?: Maybe<Merchant_Products_Mutation_Response>
  /** update single row of the table: "merchant_products" */
  update_merchant_products_by_pk?: Maybe<Merchant_Products>
  /** update data of the table: "prices" */
  update_prices?: Maybe<Prices_Mutation_Response>
  /** update single row of the table: "prices" */
  update_prices_by_pk?: Maybe<Prices>
  /** update data of the table: "products" */
  update_products?: Maybe<Products_Mutation_Response>
  /** update single row of the table: "products" */
  update_products_by_pk?: Maybe<Products>
  /** update data of the table: "purchases" */
  update_purchases?: Maybe<Purchases_Mutation_Response>
  /** update single row of the table: "purchases" */
  update_purchases_by_pk?: Maybe<Purchases>
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
export type Mutation_RootDelete_CouponsArgs = {
  where: Coupons_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Coupons_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_Merchant_AccountsArgs = {
  where: Merchant_Accounts_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Merchant_Accounts_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_Merchant_ChargesArgs = {
  where: Merchant_Charges_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Merchant_Charges_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_Merchant_CouponsArgs = {
  where: Merchant_Coupons_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Merchant_Coupons_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_Merchant_CustomersArgs = {
  where: Merchant_Customers_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Merchant_Customers_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_Merchant_PricesArgs = {
  where: Merchant_Prices_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Merchant_Prices_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_Merchant_ProductsArgs = {
  where: Merchant_Products_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Merchant_Products_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_PricesArgs = {
  where: Prices_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Prices_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_ProductsArgs = {
  where: Products_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Products_By_PkArgs = {
  id: Scalars['uuid']
}

/** mutation root */
export type Mutation_RootDelete_PurchasesArgs = {
  where: Purchases_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Purchases_By_PkArgs = {
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
export type Mutation_RootInsert_CouponsArgs = {
  objects: Array<Coupons_Insert_Input>
  on_conflict?: InputMaybe<Coupons_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Coupons_OneArgs = {
  object: Coupons_Insert_Input
  on_conflict?: InputMaybe<Coupons_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_AccountsArgs = {
  objects: Array<Merchant_Accounts_Insert_Input>
  on_conflict?: InputMaybe<Merchant_Accounts_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_Accounts_OneArgs = {
  object: Merchant_Accounts_Insert_Input
  on_conflict?: InputMaybe<Merchant_Accounts_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_ChargesArgs = {
  objects: Array<Merchant_Charges_Insert_Input>
  on_conflict?: InputMaybe<Merchant_Charges_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_Charges_OneArgs = {
  object: Merchant_Charges_Insert_Input
  on_conflict?: InputMaybe<Merchant_Charges_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_CouponsArgs = {
  objects: Array<Merchant_Coupons_Insert_Input>
  on_conflict?: InputMaybe<Merchant_Coupons_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_Coupons_OneArgs = {
  object: Merchant_Coupons_Insert_Input
  on_conflict?: InputMaybe<Merchant_Coupons_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_CustomersArgs = {
  objects: Array<Merchant_Customers_Insert_Input>
  on_conflict?: InputMaybe<Merchant_Customers_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_Customers_OneArgs = {
  object: Merchant_Customers_Insert_Input
  on_conflict?: InputMaybe<Merchant_Customers_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_PricesArgs = {
  objects: Array<Merchant_Prices_Insert_Input>
  on_conflict?: InputMaybe<Merchant_Prices_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_Prices_OneArgs = {
  object: Merchant_Prices_Insert_Input
  on_conflict?: InputMaybe<Merchant_Prices_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_ProductsArgs = {
  objects: Array<Merchant_Products_Insert_Input>
  on_conflict?: InputMaybe<Merchant_Products_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Merchant_Products_OneArgs = {
  object: Merchant_Products_Insert_Input
  on_conflict?: InputMaybe<Merchant_Products_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_PricesArgs = {
  objects: Array<Prices_Insert_Input>
  on_conflict?: InputMaybe<Prices_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Prices_OneArgs = {
  object: Prices_Insert_Input
  on_conflict?: InputMaybe<Prices_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_ProductsArgs = {
  objects: Array<Products_Insert_Input>
  on_conflict?: InputMaybe<Products_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Products_OneArgs = {
  object: Products_Insert_Input
  on_conflict?: InputMaybe<Products_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_PurchasesArgs = {
  objects: Array<Purchases_Insert_Input>
  on_conflict?: InputMaybe<Purchases_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Purchases_OneArgs = {
  object: Purchases_Insert_Input
  on_conflict?: InputMaybe<Purchases_On_Conflict>
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
export type Mutation_RootUpdate_CouponsArgs = {
  _inc?: InputMaybe<Coupons_Inc_Input>
  _set?: InputMaybe<Coupons_Set_Input>
  where: Coupons_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Coupons_By_PkArgs = {
  _inc?: InputMaybe<Coupons_Inc_Input>
  _set?: InputMaybe<Coupons_Set_Input>
  pk_columns: Coupons_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_AccountsArgs = {
  _inc?: InputMaybe<Merchant_Accounts_Inc_Input>
  _set?: InputMaybe<Merchant_Accounts_Set_Input>
  where: Merchant_Accounts_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_Accounts_By_PkArgs = {
  _inc?: InputMaybe<Merchant_Accounts_Inc_Input>
  _set?: InputMaybe<Merchant_Accounts_Set_Input>
  pk_columns: Merchant_Accounts_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_ChargesArgs = {
  _inc?: InputMaybe<Merchant_Charges_Inc_Input>
  _set?: InputMaybe<Merchant_Charges_Set_Input>
  where: Merchant_Charges_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_Charges_By_PkArgs = {
  _inc?: InputMaybe<Merchant_Charges_Inc_Input>
  _set?: InputMaybe<Merchant_Charges_Set_Input>
  pk_columns: Merchant_Charges_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_CouponsArgs = {
  _inc?: InputMaybe<Merchant_Coupons_Inc_Input>
  _set?: InputMaybe<Merchant_Coupons_Set_Input>
  where: Merchant_Coupons_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_Coupons_By_PkArgs = {
  _inc?: InputMaybe<Merchant_Coupons_Inc_Input>
  _set?: InputMaybe<Merchant_Coupons_Set_Input>
  pk_columns: Merchant_Coupons_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_CustomersArgs = {
  _inc?: InputMaybe<Merchant_Customers_Inc_Input>
  _set?: InputMaybe<Merchant_Customers_Set_Input>
  where: Merchant_Customers_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_Customers_By_PkArgs = {
  _inc?: InputMaybe<Merchant_Customers_Inc_Input>
  _set?: InputMaybe<Merchant_Customers_Set_Input>
  pk_columns: Merchant_Customers_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_PricesArgs = {
  _inc?: InputMaybe<Merchant_Prices_Inc_Input>
  _set?: InputMaybe<Merchant_Prices_Set_Input>
  where: Merchant_Prices_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_Prices_By_PkArgs = {
  _inc?: InputMaybe<Merchant_Prices_Inc_Input>
  _set?: InputMaybe<Merchant_Prices_Set_Input>
  pk_columns: Merchant_Prices_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_ProductsArgs = {
  _inc?: InputMaybe<Merchant_Products_Inc_Input>
  _set?: InputMaybe<Merchant_Products_Set_Input>
  where: Merchant_Products_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Merchant_Products_By_PkArgs = {
  _inc?: InputMaybe<Merchant_Products_Inc_Input>
  _set?: InputMaybe<Merchant_Products_Set_Input>
  pk_columns: Merchant_Products_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_PricesArgs = {
  _inc?: InputMaybe<Prices_Inc_Input>
  _set?: InputMaybe<Prices_Set_Input>
  where: Prices_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Prices_By_PkArgs = {
  _inc?: InputMaybe<Prices_Inc_Input>
  _set?: InputMaybe<Prices_Set_Input>
  pk_columns: Prices_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_ProductsArgs = {
  _inc?: InputMaybe<Products_Inc_Input>
  _set?: InputMaybe<Products_Set_Input>
  where: Products_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Products_By_PkArgs = {
  _inc?: InputMaybe<Products_Inc_Input>
  _set?: InputMaybe<Products_Set_Input>
  pk_columns: Products_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_PurchasesArgs = {
  _set?: InputMaybe<Purchases_Set_Input>
  where: Purchases_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Purchases_By_PkArgs = {
  _set?: InputMaybe<Purchases_Set_Input>
  pk_columns: Purchases_Pk_Columns_Input
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

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']>
  _gt?: InputMaybe<Scalars['numeric']>
  _gte?: InputMaybe<Scalars['numeric']>
  _in?: InputMaybe<Array<Scalars['numeric']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['numeric']>
  _lte?: InputMaybe<Scalars['numeric']>
  _neq?: InputMaybe<Scalars['numeric']>
  _nin?: InputMaybe<Array<Scalars['numeric']>>
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

/** columns and relationships of "prices" */
export type Prices = {
  __typename?: 'prices'
  created_at: Scalars['timestamptz']
  id: Scalars['uuid']
  /** An array relationship */
  merchant_prices: Array<Merchant_Prices>
  /** An aggregate relationship */
  merchant_prices_aggregate: Merchant_Prices_Aggregate
  nickname?: Maybe<Scalars['String']>
  /** An object relationship */
  product: Products
  product_id: Scalars['uuid']
  status: Scalars['Int']
  unit_amount: Scalars['numeric']
}

/** columns and relationships of "prices" */
export type PricesMerchant_PricesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

/** columns and relationships of "prices" */
export type PricesMerchant_Prices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

/** aggregated selection of "prices" */
export type Prices_Aggregate = {
  __typename?: 'prices_aggregate'
  aggregate?: Maybe<Prices_Aggregate_Fields>
  nodes: Array<Prices>
}

/** aggregate fields of "prices" */
export type Prices_Aggregate_Fields = {
  __typename?: 'prices_aggregate_fields'
  avg?: Maybe<Prices_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Prices_Max_Fields>
  min?: Maybe<Prices_Min_Fields>
  stddev?: Maybe<Prices_Stddev_Fields>
  stddev_pop?: Maybe<Prices_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Prices_Stddev_Samp_Fields>
  sum?: Maybe<Prices_Sum_Fields>
  var_pop?: Maybe<Prices_Var_Pop_Fields>
  var_samp?: Maybe<Prices_Var_Samp_Fields>
  variance?: Maybe<Prices_Variance_Fields>
}

/** aggregate fields of "prices" */
export type Prices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Prices_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "prices" */
export type Prices_Aggregate_Order_By = {
  avg?: InputMaybe<Prices_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Prices_Max_Order_By>
  min?: InputMaybe<Prices_Min_Order_By>
  stddev?: InputMaybe<Prices_Stddev_Order_By>
  stddev_pop?: InputMaybe<Prices_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Prices_Stddev_Samp_Order_By>
  sum?: InputMaybe<Prices_Sum_Order_By>
  var_pop?: InputMaybe<Prices_Var_Pop_Order_By>
  var_samp?: InputMaybe<Prices_Var_Samp_Order_By>
  variance?: InputMaybe<Prices_Variance_Order_By>
}

/** input type for inserting array relation for remote table "prices" */
export type Prices_Arr_Rel_Insert_Input = {
  data: Array<Prices_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Prices_On_Conflict>
}

/** aggregate avg on columns */
export type Prices_Avg_Fields = {
  __typename?: 'prices_avg_fields'
  status?: Maybe<Scalars['Float']>
  unit_amount?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "prices" */
export type Prices_Avg_Order_By = {
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "prices". All fields are combined with a logical 'AND'. */
export type Prices_Bool_Exp = {
  _and?: InputMaybe<Array<Prices_Bool_Exp>>
  _not?: InputMaybe<Prices_Bool_Exp>
  _or?: InputMaybe<Array<Prices_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  merchant_prices?: InputMaybe<Merchant_Prices_Bool_Exp>
  nickname?: InputMaybe<String_Comparison_Exp>
  product?: InputMaybe<Products_Bool_Exp>
  product_id?: InputMaybe<Uuid_Comparison_Exp>
  status?: InputMaybe<Int_Comparison_Exp>
  unit_amount?: InputMaybe<Numeric_Comparison_Exp>
}

/** unique or primary key constraints on table "prices" */
export type Prices_Constraint =
  /** unique or primary key constraint */
  'prices_pkey'

/** input type for incrementing numeric columns in table "prices" */
export type Prices_Inc_Input = {
  status?: InputMaybe<Scalars['Int']>
  unit_amount?: InputMaybe<Scalars['numeric']>
}

/** input type for inserting data into table "prices" */
export type Prices_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  merchant_prices?: InputMaybe<Merchant_Prices_Arr_Rel_Insert_Input>
  nickname?: InputMaybe<Scalars['String']>
  product?: InputMaybe<Products_Obj_Rel_Insert_Input>
  product_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['Int']>
  unit_amount?: InputMaybe<Scalars['numeric']>
}

/** aggregate max on columns */
export type Prices_Max_Fields = {
  __typename?: 'prices_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  nickname?: Maybe<Scalars['String']>
  product_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
  unit_amount?: Maybe<Scalars['numeric']>
}

/** order by max() on columns of table "prices" */
export type Prices_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nickname?: InputMaybe<Order_By>
  product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Prices_Min_Fields = {
  __typename?: 'prices_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  nickname?: Maybe<Scalars['String']>
  product_id?: Maybe<Scalars['uuid']>
  status?: Maybe<Scalars['Int']>
  unit_amount?: Maybe<Scalars['numeric']>
}

/** order by min() on columns of table "prices" */
export type Prices_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nickname?: InputMaybe<Order_By>
  product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** response of any mutation on the table "prices" */
export type Prices_Mutation_Response = {
  __typename?: 'prices_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Prices>
}

/** input type for inserting object relation for remote table "prices" */
export type Prices_Obj_Rel_Insert_Input = {
  data: Prices_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Prices_On_Conflict>
}

/** on_conflict condition type for table "prices" */
export type Prices_On_Conflict = {
  constraint: Prices_Constraint
  update_columns?: Array<Prices_Update_Column>
  where?: InputMaybe<Prices_Bool_Exp>
}

/** Ordering options when selecting data from "prices". */
export type Prices_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  merchant_prices_aggregate?: InputMaybe<Merchant_Prices_Aggregate_Order_By>
  nickname?: InputMaybe<Order_By>
  product?: InputMaybe<Products_Order_By>
  product_id?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** primary key columns input for table: prices */
export type Prices_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "prices" */
export type Prices_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'nickname'
  /** column name */
  | 'product_id'
  /** column name */
  | 'status'
  /** column name */
  | 'unit_amount'

/** input type for updating data in table "prices" */
export type Prices_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  nickname?: InputMaybe<Scalars['String']>
  product_id?: InputMaybe<Scalars['uuid']>
  status?: InputMaybe<Scalars['Int']>
  unit_amount?: InputMaybe<Scalars['numeric']>
}

/** aggregate stddev on columns */
export type Prices_Stddev_Fields = {
  __typename?: 'prices_stddev_fields'
  status?: Maybe<Scalars['Float']>
  unit_amount?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "prices" */
export type Prices_Stddev_Order_By = {
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Prices_Stddev_Pop_Fields = {
  __typename?: 'prices_stddev_pop_fields'
  status?: Maybe<Scalars['Float']>
  unit_amount?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "prices" */
export type Prices_Stddev_Pop_Order_By = {
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Prices_Stddev_Samp_Fields = {
  __typename?: 'prices_stddev_samp_fields'
  status?: Maybe<Scalars['Float']>
  unit_amount?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "prices" */
export type Prices_Stddev_Samp_Order_By = {
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Prices_Sum_Fields = {
  __typename?: 'prices_sum_fields'
  status?: Maybe<Scalars['Int']>
  unit_amount?: Maybe<Scalars['numeric']>
}

/** order by sum() on columns of table "prices" */
export type Prices_Sum_Order_By = {
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** update columns of table "prices" */
export type Prices_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'nickname'
  /** column name */
  | 'product_id'
  /** column name */
  | 'status'
  /** column name */
  | 'unit_amount'

/** aggregate var_pop on columns */
export type Prices_Var_Pop_Fields = {
  __typename?: 'prices_var_pop_fields'
  status?: Maybe<Scalars['Float']>
  unit_amount?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "prices" */
export type Prices_Var_Pop_Order_By = {
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Prices_Var_Samp_Fields = {
  __typename?: 'prices_var_samp_fields'
  status?: Maybe<Scalars['Float']>
  unit_amount?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "prices" */
export type Prices_Var_Samp_Order_By = {
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Prices_Variance_Fields = {
  __typename?: 'prices_variance_fields'
  status?: Maybe<Scalars['Float']>
  unit_amount?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "prices" */
export type Prices_Variance_Order_By = {
  status?: InputMaybe<Order_By>
  unit_amount?: InputMaybe<Order_By>
}

/** columns and relationships of "products" */
export type Products = {
  __typename?: 'products'
  /** An array relationship */
  coupons: Array<Coupons>
  /** An aggregate relationship */
  coupons_aggregate: Coupons_Aggregate
  created_at: Scalars['timestamptz']
  id: Scalars['uuid']
  key?: Maybe<Scalars['String']>
  /** An array relationship */
  merchant_products: Array<Merchant_Products>
  /** An aggregate relationship */
  merchant_products_aggregate: Merchant_Products_Aggregate
  name?: Maybe<Scalars['String']>
  /** An array relationship */
  prices: Array<Prices>
  /** An aggregate relationship */
  prices_aggregate: Prices_Aggregate
  /** An array relationship */
  purchases: Array<Purchases>
  /** An aggregate relationship */
  purchases_aggregate: Purchases_Aggregate
  status: Scalars['Int']
}

/** columns and relationships of "products" */
export type ProductsCouponsArgs = {
  distinct_on?: InputMaybe<Array<Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Coupons_Order_By>>
  where?: InputMaybe<Coupons_Bool_Exp>
}

/** columns and relationships of "products" */
export type ProductsCoupons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Coupons_Order_By>>
  where?: InputMaybe<Coupons_Bool_Exp>
}

/** columns and relationships of "products" */
export type ProductsMerchant_ProductsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Products_Order_By>>
  where?: InputMaybe<Merchant_Products_Bool_Exp>
}

/** columns and relationships of "products" */
export type ProductsMerchant_Products_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Products_Order_By>>
  where?: InputMaybe<Merchant_Products_Bool_Exp>
}

/** columns and relationships of "products" */
export type ProductsPricesArgs = {
  distinct_on?: InputMaybe<Array<Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Prices_Order_By>>
  where?: InputMaybe<Prices_Bool_Exp>
}

/** columns and relationships of "products" */
export type ProductsPrices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Prices_Order_By>>
  where?: InputMaybe<Prices_Bool_Exp>
}

/** columns and relationships of "products" */
export type ProductsPurchasesArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** columns and relationships of "products" */
export type ProductsPurchases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** aggregated selection of "products" */
export type Products_Aggregate = {
  __typename?: 'products_aggregate'
  aggregate?: Maybe<Products_Aggregate_Fields>
  nodes: Array<Products>
}

/** aggregate fields of "products" */
export type Products_Aggregate_Fields = {
  __typename?: 'products_aggregate_fields'
  avg?: Maybe<Products_Avg_Fields>
  count: Scalars['Int']
  max?: Maybe<Products_Max_Fields>
  min?: Maybe<Products_Min_Fields>
  stddev?: Maybe<Products_Stddev_Fields>
  stddev_pop?: Maybe<Products_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Products_Stddev_Samp_Fields>
  sum?: Maybe<Products_Sum_Fields>
  var_pop?: Maybe<Products_Var_Pop_Fields>
  var_samp?: Maybe<Products_Var_Samp_Fields>
  variance?: Maybe<Products_Variance_Fields>
}

/** aggregate fields of "products" */
export type Products_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Products_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** aggregate avg on columns */
export type Products_Avg_Fields = {
  __typename?: 'products_avg_fields'
  status?: Maybe<Scalars['Float']>
}

/** Boolean expression to filter rows from the table "products". All fields are combined with a logical 'AND'. */
export type Products_Bool_Exp = {
  _and?: InputMaybe<Array<Products_Bool_Exp>>
  _not?: InputMaybe<Products_Bool_Exp>
  _or?: InputMaybe<Array<Products_Bool_Exp>>
  coupons?: InputMaybe<Coupons_Bool_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  key?: InputMaybe<String_Comparison_Exp>
  merchant_products?: InputMaybe<Merchant_Products_Bool_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  prices?: InputMaybe<Prices_Bool_Exp>
  purchases?: InputMaybe<Purchases_Bool_Exp>
  status?: InputMaybe<Int_Comparison_Exp>
}

/** unique or primary key constraints on table "products" */
export type Products_Constraint =
  /** unique or primary key constraint */
  'products_pkey'

/** input type for incrementing numeric columns in table "products" */
export type Products_Inc_Input = {
  status?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "products" */
export type Products_Insert_Input = {
  coupons?: InputMaybe<Coupons_Arr_Rel_Insert_Input>
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  key?: InputMaybe<Scalars['String']>
  merchant_products?: InputMaybe<Merchant_Products_Arr_Rel_Insert_Input>
  name?: InputMaybe<Scalars['String']>
  prices?: InputMaybe<Prices_Arr_Rel_Insert_Input>
  purchases?: InputMaybe<Purchases_Arr_Rel_Insert_Input>
  status?: InputMaybe<Scalars['Int']>
}

/** aggregate max on columns */
export type Products_Max_Fields = {
  __typename?: 'products_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  key?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['Int']>
}

/** aggregate min on columns */
export type Products_Min_Fields = {
  __typename?: 'products_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  key?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['Int']>
}

/** response of any mutation on the table "products" */
export type Products_Mutation_Response = {
  __typename?: 'products_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Products>
}

/** input type for inserting object relation for remote table "products" */
export type Products_Obj_Rel_Insert_Input = {
  data: Products_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Products_On_Conflict>
}

/** on_conflict condition type for table "products" */
export type Products_On_Conflict = {
  constraint: Products_Constraint
  update_columns?: Array<Products_Update_Column>
  where?: InputMaybe<Products_Bool_Exp>
}

/** Ordering options when selecting data from "products". */
export type Products_Order_By = {
  coupons_aggregate?: InputMaybe<Coupons_Aggregate_Order_By>
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  key?: InputMaybe<Order_By>
  merchant_products_aggregate?: InputMaybe<Merchant_Products_Aggregate_Order_By>
  name?: InputMaybe<Order_By>
  prices_aggregate?: InputMaybe<Prices_Aggregate_Order_By>
  purchases_aggregate?: InputMaybe<Purchases_Aggregate_Order_By>
  status?: InputMaybe<Order_By>
}

/** primary key columns input for table: products */
export type Products_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "products" */
export type Products_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'key'
  /** column name */
  | 'name'
  /** column name */
  | 'status'

/** input type for updating data in table "products" */
export type Products_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  key?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  status?: InputMaybe<Scalars['Int']>
}

/** aggregate stddev on columns */
export type Products_Stddev_Fields = {
  __typename?: 'products_stddev_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate stddev_pop on columns */
export type Products_Stddev_Pop_Fields = {
  __typename?: 'products_stddev_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate stddev_samp on columns */
export type Products_Stddev_Samp_Fields = {
  __typename?: 'products_stddev_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate sum on columns */
export type Products_Sum_Fields = {
  __typename?: 'products_sum_fields'
  status?: Maybe<Scalars['Int']>
}

/** update columns of table "products" */
export type Products_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'key'
  /** column name */
  | 'name'
  /** column name */
  | 'status'

/** aggregate var_pop on columns */
export type Products_Var_Pop_Fields = {
  __typename?: 'products_var_pop_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate var_samp on columns */
export type Products_Var_Samp_Fields = {
  __typename?: 'products_var_samp_fields'
  status?: Maybe<Scalars['Float']>
}

/** aggregate variance on columns */
export type Products_Variance_Fields = {
  __typename?: 'products_variance_fields'
  status?: Maybe<Scalars['Float']>
}

/** columns and relationships of "purchases" */
export type Purchases = {
  __typename?: 'purchases'
  city?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  /** An object relationship */
  coupon?: Maybe<Coupons>
  coupon_id?: Maybe<Scalars['uuid']>
  created_at: Scalars['timestamptz']
  id: Scalars['uuid']
  ip_address?: Maybe<Scalars['String']>
  /** An object relationship */
  merchant_charge?: Maybe<Merchant_Charges>
  merchant_charge_id?: Maybe<Scalars['uuid']>
  /** An object relationship */
  product?: Maybe<Products>
  product_id?: Maybe<Scalars['uuid']>
  /** An object relationship */
  purchase?: Maybe<Purchases>
  state?: Maybe<Scalars['String']>
  upgraded_from_purchase_id?: Maybe<Scalars['uuid']>
  /** An array relationship */
  upgraded_purchases: Array<Purchases>
  /** An aggregate relationship */
  upgraded_purchases_aggregate: Purchases_Aggregate
  /** An object relationship */
  user?: Maybe<Users>
  user_id?: Maybe<Scalars['uuid']>
}

/** columns and relationships of "purchases" */
export type PurchasesUpgraded_PurchasesArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** columns and relationships of "purchases" */
export type PurchasesUpgraded_Purchases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** aggregated selection of "purchases" */
export type Purchases_Aggregate = {
  __typename?: 'purchases_aggregate'
  aggregate?: Maybe<Purchases_Aggregate_Fields>
  nodes: Array<Purchases>
}

/** aggregate fields of "purchases" */
export type Purchases_Aggregate_Fields = {
  __typename?: 'purchases_aggregate_fields'
  count: Scalars['Int']
  max?: Maybe<Purchases_Max_Fields>
  min?: Maybe<Purchases_Min_Fields>
}

/** aggregate fields of "purchases" */
export type Purchases_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Purchases_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "purchases" */
export type Purchases_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Purchases_Max_Order_By>
  min?: InputMaybe<Purchases_Min_Order_By>
}

/** input type for inserting array relation for remote table "purchases" */
export type Purchases_Arr_Rel_Insert_Input = {
  data: Array<Purchases_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Purchases_On_Conflict>
}

/** Boolean expression to filter rows from the table "purchases". All fields are combined with a logical 'AND'. */
export type Purchases_Bool_Exp = {
  _and?: InputMaybe<Array<Purchases_Bool_Exp>>
  _not?: InputMaybe<Purchases_Bool_Exp>
  _or?: InputMaybe<Array<Purchases_Bool_Exp>>
  city?: InputMaybe<String_Comparison_Exp>
  country?: InputMaybe<String_Comparison_Exp>
  coupon?: InputMaybe<Coupons_Bool_Exp>
  coupon_id?: InputMaybe<Uuid_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  ip_address?: InputMaybe<String_Comparison_Exp>
  merchant_charge?: InputMaybe<Merchant_Charges_Bool_Exp>
  merchant_charge_id?: InputMaybe<Uuid_Comparison_Exp>
  product?: InputMaybe<Products_Bool_Exp>
  product_id?: InputMaybe<Uuid_Comparison_Exp>
  purchase?: InputMaybe<Purchases_Bool_Exp>
  state?: InputMaybe<String_Comparison_Exp>
  upgraded_from_purchase_id?: InputMaybe<Uuid_Comparison_Exp>
  upgraded_purchases?: InputMaybe<Purchases_Bool_Exp>
  user?: InputMaybe<Users_Bool_Exp>
  user_id?: InputMaybe<Uuid_Comparison_Exp>
}

/** unique or primary key constraints on table "purchases" */
export type Purchases_Constraint =
  /** unique or primary key constraint */
  'purchases_pkey'

/** input type for inserting data into table "purchases" */
export type Purchases_Insert_Input = {
  city?: InputMaybe<Scalars['String']>
  country?: InputMaybe<Scalars['String']>
  coupon?: InputMaybe<Coupons_Obj_Rel_Insert_Input>
  coupon_id?: InputMaybe<Scalars['uuid']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  ip_address?: InputMaybe<Scalars['String']>
  merchant_charge?: InputMaybe<Merchant_Charges_Obj_Rel_Insert_Input>
  merchant_charge_id?: InputMaybe<Scalars['uuid']>
  product?: InputMaybe<Products_Obj_Rel_Insert_Input>
  product_id?: InputMaybe<Scalars['uuid']>
  purchase?: InputMaybe<Purchases_Obj_Rel_Insert_Input>
  state?: InputMaybe<Scalars['String']>
  upgraded_from_purchase_id?: InputMaybe<Scalars['uuid']>
  upgraded_purchases?: InputMaybe<Purchases_Arr_Rel_Insert_Input>
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** aggregate max on columns */
export type Purchases_Max_Fields = {
  __typename?: 'purchases_max_fields'
  city?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  coupon_id?: Maybe<Scalars['uuid']>
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  ip_address?: Maybe<Scalars['String']>
  merchant_charge_id?: Maybe<Scalars['uuid']>
  product_id?: Maybe<Scalars['uuid']>
  state?: Maybe<Scalars['String']>
  upgraded_from_purchase_id?: Maybe<Scalars['uuid']>
  user_id?: Maybe<Scalars['uuid']>
}

/** order by max() on columns of table "purchases" */
export type Purchases_Max_Order_By = {
  city?: InputMaybe<Order_By>
  country?: InputMaybe<Order_By>
  coupon_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  ip_address?: InputMaybe<Order_By>
  merchant_charge_id?: InputMaybe<Order_By>
  product_id?: InputMaybe<Order_By>
  state?: InputMaybe<Order_By>
  upgraded_from_purchase_id?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Purchases_Min_Fields = {
  __typename?: 'purchases_min_fields'
  city?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  coupon_id?: Maybe<Scalars['uuid']>
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  ip_address?: Maybe<Scalars['String']>
  merchant_charge_id?: Maybe<Scalars['uuid']>
  product_id?: Maybe<Scalars['uuid']>
  state?: Maybe<Scalars['String']>
  upgraded_from_purchase_id?: Maybe<Scalars['uuid']>
  user_id?: Maybe<Scalars['uuid']>
}

/** order by min() on columns of table "purchases" */
export type Purchases_Min_Order_By = {
  city?: InputMaybe<Order_By>
  country?: InputMaybe<Order_By>
  coupon_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  ip_address?: InputMaybe<Order_By>
  merchant_charge_id?: InputMaybe<Order_By>
  product_id?: InputMaybe<Order_By>
  state?: InputMaybe<Order_By>
  upgraded_from_purchase_id?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** response of any mutation on the table "purchases" */
export type Purchases_Mutation_Response = {
  __typename?: 'purchases_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']
  /** data from the rows affected by the mutation */
  returning: Array<Purchases>
}

/** input type for inserting object relation for remote table "purchases" */
export type Purchases_Obj_Rel_Insert_Input = {
  data: Purchases_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Purchases_On_Conflict>
}

/** on_conflict condition type for table "purchases" */
export type Purchases_On_Conflict = {
  constraint: Purchases_Constraint
  update_columns?: Array<Purchases_Update_Column>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** Ordering options when selecting data from "purchases". */
export type Purchases_Order_By = {
  city?: InputMaybe<Order_By>
  country?: InputMaybe<Order_By>
  coupon?: InputMaybe<Coupons_Order_By>
  coupon_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  ip_address?: InputMaybe<Order_By>
  merchant_charge?: InputMaybe<Merchant_Charges_Order_By>
  merchant_charge_id?: InputMaybe<Order_By>
  product?: InputMaybe<Products_Order_By>
  product_id?: InputMaybe<Order_By>
  purchase?: InputMaybe<Purchases_Order_By>
  state?: InputMaybe<Order_By>
  upgraded_from_purchase_id?: InputMaybe<Order_By>
  upgraded_purchases_aggregate?: InputMaybe<Purchases_Aggregate_Order_By>
  user?: InputMaybe<Users_Order_By>
  user_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: purchases */
export type Purchases_Pk_Columns_Input = {
  id: Scalars['uuid']
}

/** select columns of table "purchases" */
export type Purchases_Select_Column =
  /** column name */
  | 'city'
  /** column name */
  | 'country'
  /** column name */
  | 'coupon_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'ip_address'
  /** column name */
  | 'merchant_charge_id'
  /** column name */
  | 'product_id'
  /** column name */
  | 'state'
  /** column name */
  | 'upgraded_from_purchase_id'
  /** column name */
  | 'user_id'

/** input type for updating data in table "purchases" */
export type Purchases_Set_Input = {
  city?: InputMaybe<Scalars['String']>
  country?: InputMaybe<Scalars['String']>
  coupon_id?: InputMaybe<Scalars['uuid']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  ip_address?: InputMaybe<Scalars['String']>
  merchant_charge_id?: InputMaybe<Scalars['uuid']>
  product_id?: InputMaybe<Scalars['uuid']>
  state?: InputMaybe<Scalars['String']>
  upgraded_from_purchase_id?: InputMaybe<Scalars['uuid']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** update columns of table "purchases" */
export type Purchases_Update_Column =
  /** column name */
  | 'city'
  /** column name */
  | 'country'
  /** column name */
  | 'coupon_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'ip_address'
  /** column name */
  | 'merchant_charge_id'
  /** column name */
  | 'product_id'
  /** column name */
  | 'state'
  /** column name */
  | 'upgraded_from_purchase_id'
  /** column name */
  | 'user_id'

export type Query_Root = {
  __typename?: 'query_root'
  /** An array relationship */
  accounts: Array<Accounts>
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>
  /** An array relationship */
  coupons: Array<Coupons>
  /** An aggregate relationship */
  coupons_aggregate: Coupons_Aggregate
  /** fetch data from the table: "coupons" using primary key columns */
  coupons_by_pk?: Maybe<Coupons>
  /** fetch data from the table: "merchant_accounts" */
  merchant_accounts: Array<Merchant_Accounts>
  /** fetch aggregated fields from the table: "merchant_accounts" */
  merchant_accounts_aggregate: Merchant_Accounts_Aggregate
  /** fetch data from the table: "merchant_accounts" using primary key columns */
  merchant_accounts_by_pk?: Maybe<Merchant_Accounts>
  /** An array relationship */
  merchant_charges: Array<Merchant_Charges>
  /** An aggregate relationship */
  merchant_charges_aggregate: Merchant_Charges_Aggregate
  /** fetch data from the table: "merchant_charges" using primary key columns */
  merchant_charges_by_pk?: Maybe<Merchant_Charges>
  /** An array relationship */
  merchant_coupons: Array<Merchant_Coupons>
  /** An aggregate relationship */
  merchant_coupons_aggregate: Merchant_Coupons_Aggregate
  /** fetch data from the table: "merchant_coupons" using primary key columns */
  merchant_coupons_by_pk?: Maybe<Merchant_Coupons>
  /** An array relationship */
  merchant_customers: Array<Merchant_Customers>
  /** An aggregate relationship */
  merchant_customers_aggregate: Merchant_Customers_Aggregate
  /** fetch data from the table: "merchant_customers" using primary key columns */
  merchant_customers_by_pk?: Maybe<Merchant_Customers>
  /** An array relationship */
  merchant_prices: Array<Merchant_Prices>
  /** An aggregate relationship */
  merchant_prices_aggregate: Merchant_Prices_Aggregate
  /** fetch data from the table: "merchant_prices" using primary key columns */
  merchant_prices_by_pk?: Maybe<Merchant_Prices>
  /** An array relationship */
  merchant_products: Array<Merchant_Products>
  /** An aggregate relationship */
  merchant_products_aggregate: Merchant_Products_Aggregate
  /** fetch data from the table: "merchant_products" using primary key columns */
  merchant_products_by_pk?: Maybe<Merchant_Products>
  /** An array relationship */
  prices: Array<Prices>
  /** An aggregate relationship */
  prices_aggregate: Prices_Aggregate
  /** fetch data from the table: "prices" using primary key columns */
  prices_by_pk?: Maybe<Prices>
  /** fetch data from the table: "products" */
  products: Array<Products>
  /** fetch aggregated fields from the table: "products" */
  products_aggregate: Products_Aggregate
  /** fetch data from the table: "products" using primary key columns */
  products_by_pk?: Maybe<Products>
  /** An array relationship */
  purchases: Array<Purchases>
  /** An aggregate relationship */
  purchases_aggregate: Purchases_Aggregate
  /** fetch data from the table: "purchases" using primary key columns */
  purchases_by_pk?: Maybe<Purchases>
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

export type Query_RootCouponsArgs = {
  distinct_on?: InputMaybe<Array<Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Coupons_Order_By>>
  where?: InputMaybe<Coupons_Bool_Exp>
}

export type Query_RootCoupons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Coupons_Order_By>>
  where?: InputMaybe<Coupons_Bool_Exp>
}

export type Query_RootCoupons_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootMerchant_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Accounts_Order_By>>
  where?: InputMaybe<Merchant_Accounts_Bool_Exp>
}

export type Query_RootMerchant_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Accounts_Order_By>>
  where?: InputMaybe<Merchant_Accounts_Bool_Exp>
}

export type Query_RootMerchant_Accounts_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootMerchant_ChargesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

export type Query_RootMerchant_Charges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

export type Query_RootMerchant_Charges_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootMerchant_CouponsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Coupons_Order_By>>
  where?: InputMaybe<Merchant_Coupons_Bool_Exp>
}

export type Query_RootMerchant_Coupons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Coupons_Order_By>>
  where?: InputMaybe<Merchant_Coupons_Bool_Exp>
}

export type Query_RootMerchant_Coupons_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootMerchant_CustomersArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Customers_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Customers_Order_By>>
  where?: InputMaybe<Merchant_Customers_Bool_Exp>
}

export type Query_RootMerchant_Customers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Customers_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Customers_Order_By>>
  where?: InputMaybe<Merchant_Customers_Bool_Exp>
}

export type Query_RootMerchant_Customers_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootMerchant_PricesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

export type Query_RootMerchant_Prices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

export type Query_RootMerchant_Prices_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootMerchant_ProductsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Products_Order_By>>
  where?: InputMaybe<Merchant_Products_Bool_Exp>
}

export type Query_RootMerchant_Products_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Products_Order_By>>
  where?: InputMaybe<Merchant_Products_Bool_Exp>
}

export type Query_RootMerchant_Products_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootPricesArgs = {
  distinct_on?: InputMaybe<Array<Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Prices_Order_By>>
  where?: InputMaybe<Prices_Bool_Exp>
}

export type Query_RootPrices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Prices_Order_By>>
  where?: InputMaybe<Prices_Bool_Exp>
}

export type Query_RootPrices_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootProductsArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Products_Order_By>>
  where?: InputMaybe<Products_Bool_Exp>
}

export type Query_RootProducts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Products_Order_By>>
  where?: InputMaybe<Products_Bool_Exp>
}

export type Query_RootProducts_By_PkArgs = {
  id: Scalars['uuid']
}

export type Query_RootPurchasesArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

export type Query_RootPurchases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

export type Query_RootPurchases_By_PkArgs = {
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

export type Subscription_Root = {
  __typename?: 'subscription_root'
  /** An array relationship */
  accounts: Array<Accounts>
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>
  /** An array relationship */
  coupons: Array<Coupons>
  /** An aggregate relationship */
  coupons_aggregate: Coupons_Aggregate
  /** fetch data from the table: "coupons" using primary key columns */
  coupons_by_pk?: Maybe<Coupons>
  /** fetch data from the table: "merchant_accounts" */
  merchant_accounts: Array<Merchant_Accounts>
  /** fetch aggregated fields from the table: "merchant_accounts" */
  merchant_accounts_aggregate: Merchant_Accounts_Aggregate
  /** fetch data from the table: "merchant_accounts" using primary key columns */
  merchant_accounts_by_pk?: Maybe<Merchant_Accounts>
  /** An array relationship */
  merchant_charges: Array<Merchant_Charges>
  /** An aggregate relationship */
  merchant_charges_aggregate: Merchant_Charges_Aggregate
  /** fetch data from the table: "merchant_charges" using primary key columns */
  merchant_charges_by_pk?: Maybe<Merchant_Charges>
  /** An array relationship */
  merchant_coupons: Array<Merchant_Coupons>
  /** An aggregate relationship */
  merchant_coupons_aggregate: Merchant_Coupons_Aggregate
  /** fetch data from the table: "merchant_coupons" using primary key columns */
  merchant_coupons_by_pk?: Maybe<Merchant_Coupons>
  /** An array relationship */
  merchant_customers: Array<Merchant_Customers>
  /** An aggregate relationship */
  merchant_customers_aggregate: Merchant_Customers_Aggregate
  /** fetch data from the table: "merchant_customers" using primary key columns */
  merchant_customers_by_pk?: Maybe<Merchant_Customers>
  /** An array relationship */
  merchant_prices: Array<Merchant_Prices>
  /** An aggregate relationship */
  merchant_prices_aggregate: Merchant_Prices_Aggregate
  /** fetch data from the table: "merchant_prices" using primary key columns */
  merchant_prices_by_pk?: Maybe<Merchant_Prices>
  /** An array relationship */
  merchant_products: Array<Merchant_Products>
  /** An aggregate relationship */
  merchant_products_aggregate: Merchant_Products_Aggregate
  /** fetch data from the table: "merchant_products" using primary key columns */
  merchant_products_by_pk?: Maybe<Merchant_Products>
  /** An array relationship */
  prices: Array<Prices>
  /** An aggregate relationship */
  prices_aggregate: Prices_Aggregate
  /** fetch data from the table: "prices" using primary key columns */
  prices_by_pk?: Maybe<Prices>
  /** fetch data from the table: "products" */
  products: Array<Products>
  /** fetch aggregated fields from the table: "products" */
  products_aggregate: Products_Aggregate
  /** fetch data from the table: "products" using primary key columns */
  products_by_pk?: Maybe<Products>
  /** An array relationship */
  purchases: Array<Purchases>
  /** An aggregate relationship */
  purchases_aggregate: Purchases_Aggregate
  /** fetch data from the table: "purchases" using primary key columns */
  purchases_by_pk?: Maybe<Purchases>
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

export type Subscription_RootCouponsArgs = {
  distinct_on?: InputMaybe<Array<Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Coupons_Order_By>>
  where?: InputMaybe<Coupons_Bool_Exp>
}

export type Subscription_RootCoupons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Coupons_Order_By>>
  where?: InputMaybe<Coupons_Bool_Exp>
}

export type Subscription_RootCoupons_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootMerchant_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Accounts_Order_By>>
  where?: InputMaybe<Merchant_Accounts_Bool_Exp>
}

export type Subscription_RootMerchant_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Accounts_Order_By>>
  where?: InputMaybe<Merchant_Accounts_Bool_Exp>
}

export type Subscription_RootMerchant_Accounts_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootMerchant_ChargesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

export type Subscription_RootMerchant_Charges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

export type Subscription_RootMerchant_Charges_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootMerchant_CouponsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Coupons_Order_By>>
  where?: InputMaybe<Merchant_Coupons_Bool_Exp>
}

export type Subscription_RootMerchant_Coupons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Coupons_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Coupons_Order_By>>
  where?: InputMaybe<Merchant_Coupons_Bool_Exp>
}

export type Subscription_RootMerchant_Coupons_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootMerchant_CustomersArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Customers_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Customers_Order_By>>
  where?: InputMaybe<Merchant_Customers_Bool_Exp>
}

export type Subscription_RootMerchant_Customers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Customers_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Customers_Order_By>>
  where?: InputMaybe<Merchant_Customers_Bool_Exp>
}

export type Subscription_RootMerchant_Customers_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootMerchant_PricesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

export type Subscription_RootMerchant_Prices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Prices_Order_By>>
  where?: InputMaybe<Merchant_Prices_Bool_Exp>
}

export type Subscription_RootMerchant_Prices_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootMerchant_ProductsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Products_Order_By>>
  where?: InputMaybe<Merchant_Products_Bool_Exp>
}

export type Subscription_RootMerchant_Products_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Products_Order_By>>
  where?: InputMaybe<Merchant_Products_Bool_Exp>
}

export type Subscription_RootMerchant_Products_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootPricesArgs = {
  distinct_on?: InputMaybe<Array<Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Prices_Order_By>>
  where?: InputMaybe<Prices_Bool_Exp>
}

export type Subscription_RootPrices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prices_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Prices_Order_By>>
  where?: InputMaybe<Prices_Bool_Exp>
}

export type Subscription_RootPrices_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootProductsArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Products_Order_By>>
  where?: InputMaybe<Products_Bool_Exp>
}

export type Subscription_RootProducts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Products_Order_By>>
  where?: InputMaybe<Products_Bool_Exp>
}

export type Subscription_RootProducts_By_PkArgs = {
  id: Scalars['uuid']
}

export type Subscription_RootPurchasesArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

export type Subscription_RootPurchases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

export type Subscription_RootPurchases_By_PkArgs = {
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
  /** An array relationship */
  merchant_charges: Array<Merchant_Charges>
  /** An aggregate relationship */
  merchant_charges_aggregate: Merchant_Charges_Aggregate
  /** An array relationship */
  merchant_customers: Array<Merchant_Customers>
  /** An aggregate relationship */
  merchant_customers_aggregate: Merchant_Customers_Aggregate
  name?: Maybe<Scalars['String']>
  /** An array relationship */
  purchases: Array<Purchases>
  /** An aggregate relationship */
  purchases_aggregate: Purchases_Aggregate
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
export type UsersMerchant_ChargesArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

/** columns and relationships of "users" */
export type UsersMerchant_Charges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Charges_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Charges_Order_By>>
  where?: InputMaybe<Merchant_Charges_Bool_Exp>
}

/** columns and relationships of "users" */
export type UsersMerchant_CustomersArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Customers_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Customers_Order_By>>
  where?: InputMaybe<Merchant_Customers_Bool_Exp>
}

/** columns and relationships of "users" */
export type UsersMerchant_Customers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Customers_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Merchant_Customers_Order_By>>
  where?: InputMaybe<Merchant_Customers_Bool_Exp>
}

/** columns and relationships of "users" */
export type UsersPurchasesArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
}

/** columns and relationships of "users" */
export type UsersPurchases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Purchases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Purchases_Order_By>>
  where?: InputMaybe<Purchases_Bool_Exp>
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
  merchant_charges?: InputMaybe<Merchant_Charges_Bool_Exp>
  merchant_customers?: InputMaybe<Merchant_Customers_Bool_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  purchases?: InputMaybe<Purchases_Bool_Exp>
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
  merchant_charges?: InputMaybe<Merchant_Charges_Arr_Rel_Insert_Input>
  merchant_customers?: InputMaybe<Merchant_Customers_Arr_Rel_Insert_Input>
  name?: InputMaybe<Scalars['String']>
  purchases?: InputMaybe<Purchases_Arr_Rel_Insert_Input>
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
  merchant_charges_aggregate?: InputMaybe<Merchant_Charges_Aggregate_Order_By>
  merchant_customers_aggregate?: InputMaybe<Merchant_Customers_Aggregate_Order_By>
  name?: InputMaybe<Order_By>
  purchases_aggregate?: InputMaybe<Purchases_Aggregate_Order_By>
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

export type GetCouponForCodeQueryVariables = Exact<{
  code: Scalars['String']
}>

export type GetCouponForCodeQuery = {
  __typename?: 'query_root'
  coupons: Array<{
    __typename?: 'coupons'
    code?: string | null
    percentage_discount: any
    status: number
    max_uses: number
    used_count: number
    expires?: any | null
    restricted_to_product_id?: any | null
    merchant_coupon_id?: any | null
  }>
}

export type GetCouponQueryVariables = Exact<{
  id: Scalars['uuid']
}>

export type GetCouponQuery = {
  __typename?: 'query_root'
  coupons_by_pk?: {
    __typename?: 'coupons'
    max_uses: number
    expires?: any | null
    id: any
    percentage_discount: any
    used_count: number
    merchant_coupon_id?: any | null
    restricted_to_product_id?: any | null
  } | null
}

export type GetActiveDefaultCouponsQueryVariables = Exact<{
  now?: InputMaybe<Scalars['timestamptz']>
}>

export type GetActiveDefaultCouponsQuery = {
  __typename?: 'query_root'
  coupons: Array<{
    __typename?: 'coupons'
    expires?: any | null
    percentage_discount: any
    merchant_coupon_id?: any | null
    status: number
  }>
}

export type UpdateCouponMutationVariables = Exact<{
  id: Scalars['uuid']
  data: Coupons_Set_Input
}>

export type UpdateCouponMutation = {
  __typename?: 'mutation_root'
  update_coupons_by_pk?: {
    __typename?: 'coupons'
    id: any
    max_uses: number
    used_count: number
    status: number
  } | null
}

export type GetMerchantAccountQueryVariables = Exact<{
  id: Scalars['uuid']
}>

export type GetMerchantAccountQuery = {
  __typename?: 'query_root'
  merchant_accounts_by_pk?: {
    __typename?: 'merchant_accounts'
    id: any
    payment_processor_id: string
    merchant_coupons: Array<{
      __typename?: 'merchant_coupons'
      type?: string | null
      percentage_discount: any
      id: any
      identifier?: string | null
    }>
  } | null
}

export type GetMerchantAccountsQueryVariables = Exact<{[key: string]: never}>

export type GetMerchantAccountsQuery = {
  __typename?: 'query_root'
  merchant_accounts: Array<{
    __typename?: 'merchant_accounts'
    id: any
    payment_processor_id: string
    merchant_coupons: Array<{
      __typename?: 'merchant_coupons'
      type?: string | null
      percentage_discount: any
      id: any
      identifier?: string | null
    }>
  }>
}

export type CreateMerchantChargeMutationVariables = Exact<{
  data: Merchant_Charges_Insert_Input
}>

export type CreateMerchantChargeMutation = {
  __typename?: 'mutation_root'
  insert_merchant_charges_one?: {
    __typename?: 'merchant_charges'
    id: any
    identifier?: string | null
    merchant_customer_id?: any | null
    merchant_account_id: any
    merchant_product_id: any
    user_id: any
  } | null
}

export type GetMerchantChargeQueryVariables = Exact<{
  identifier: Scalars['String']
}>

export type GetMerchantChargeQuery = {
  __typename?: 'query_root'
  merchant_charges: Array<{
    __typename?: 'merchant_charges'
    id: any
    identifier?: string | null
    user_id: any
    status: number
    merchant_product_id: any
    merchant_customer_id?: any | null
    purchases: Array<{
      __typename?: 'purchases'
      id: any
      product?: {__typename?: 'products'; id: any; name?: string | null} | null
    }>
  }>
}

export type GetCouponsForTypeAndDiscountQueryVariables = Exact<{
  status?: InputMaybe<Scalars['Int']>
  percentage_discount?: InputMaybe<Scalars['numeric']>
  type?: InputMaybe<Scalars['String']>
}>

export type GetCouponsForTypeAndDiscountQuery = {
  __typename?: 'query_root'
  merchant_coupons: Array<{
    __typename?: 'merchant_coupons'
    percentage_discount: any
    type?: string | null
    identifier?: string | null
    id: any
    merchant_account: {
      __typename?: 'merchant_accounts'
      id: any
      payment_processor_id: string
    }
  }>
}

export type GetMerchantCouponQueryVariables = Exact<{
  id: Scalars['uuid']
}>

export type GetMerchantCouponQuery = {
  __typename?: 'query_root'
  merchant_coupons_by_pk?: {
    __typename?: 'merchant_coupons'
    type?: string | null
    identifier?: string | null
    percentage_discount: any
    id: any
  } | null
}

export type CreateMerchantCustomerMutationVariables = Exact<{
  data: Merchant_Customers_Insert_Input
}>

export type CreateMerchantCustomerMutation = {
  __typename?: 'mutation_root'
  insert_merchant_customers_one?: {
    __typename?: 'merchant_customers'
    id: any
    identifier: string
    merchant_account_id: any
    user_id: any
  } | null
}

export type GetMerchantCustomerForUserQueryVariables = Exact<{
  user_id: Scalars['uuid']
}>

export type GetMerchantCustomerForUserQuery = {
  __typename?: 'query_root'
  merchant_customers: Array<{
    __typename?: 'merchant_customers'
    id: any
    identifier: string
    user_id: any
  }>
}

export type GetMerchantProductByIdentifierQueryVariables = Exact<{
  identifier: Scalars['String']
}>

export type GetMerchantProductByIdentifierQuery = {
  __typename?: 'query_root'
  merchant_products: Array<{
    __typename?: 'merchant_products'
    id: any
    identifier?: string | null
    merchant_account_id: any
    product_id: any
    product: {__typename?: 'products'; id: any; name?: string | null}
    merchant_prices: Array<{__typename?: 'merchant_prices'; id: any}>
  }>
}

export type GetProductsQueryVariables = Exact<{[key: string]: never}>

export type GetProductsQuery = {
  __typename?: 'query_root'
  products: Array<{
    __typename?: 'products'
    key?: string | null
    id: any
    name?: string | null
    status: number
    prices: Array<{
      __typename?: 'prices'
      id: any
      nickname?: string | null
      status: number
      unit_amount: any
    }>
  }>
}

export type GetProductQueryVariables = Exact<{
  id: Scalars['uuid']
}>

export type GetProductQuery = {
  __typename?: 'query_root'
  products_by_pk?: {
    __typename?: 'products'
    id: any
    name?: string | null
    status: number
    prices: Array<{
      __typename?: 'prices'
      id: any
      nickname?: string | null
      status: number
      unit_amount: any
    }>
    merchant_products: Array<{
      __typename?: 'merchant_products'
      id: any
      identifier?: string | null
      merchant_prices: Array<{
        __typename?: 'merchant_prices'
        id: any
        identifier?: string | null
      }>
    }>
  } | null
}

export type GetProductsAndCouponsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['Int']>
}>

export type GetProductsAndCouponsQuery = {
  __typename?: 'query_root'
  products: Array<{
    __typename?: 'products'
    key?: string | null
    id: any
    name?: string | null
    prices: Array<{
      __typename?: 'prices'
      id: any
      nickname?: string | null
      unit_amount: any
      merchant_prices: Array<{
        __typename?: 'merchant_prices'
        id: any
        identifier?: string | null
      }>
    }>
  }>
  merchant_coupons: Array<{
    __typename?: 'merchant_coupons'
    percentage_discount: any
    type?: string | null
    identifier?: string | null
    id: any
    merchant_account: {
      __typename?: 'merchant_accounts'
      id: any
      payment_processor_id: string
    }
  }>
}

export type GetPurchaseQueryVariables = Exact<{
  id: Scalars['uuid']
}>

export type GetPurchaseQuery = {
  __typename?: 'query_root'
  purchases_by_pk?: {
    __typename?: 'purchases'
    id: any
    product?: {__typename?: 'products'; id: any; name?: string | null} | null
    user?: {__typename?: 'users'; email?: string | null; id: any} | null
  } | null
}

export type CreatePurchaseMutationVariables = Exact<{
  data: Purchases_Insert_Input
}>

export type CreatePurchaseMutation = {
  __typename?: 'mutation_root'
  insert_purchases_one?: {
    __typename?: 'purchases'
    id: any
    coupon_id?: any | null
    product_id?: any | null
    user_id?: any | null
  } | null
}

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
    purchases: Array<{
      __typename?: 'purchases'
      id: any
      product?: {__typename?: 'products'; id: any; name?: string | null} | null
    }>
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

export const GetCouponForCodeDocument = gql`
  query getCouponForCode($code: String!) @cached {
    coupons(distinct_on: code, where: {code: {_eq: $code}}) {
      code
      percentage_discount
      status
      max_uses
      used_count
      expires
      restricted_to_product_id
      merchant_coupon_id
    }
  }
`
export const GetCouponDocument = gql`
  query getCoupon($id: uuid!) {
    coupons_by_pk(id: $id) {
      max_uses
      expires
      id
      percentage_discount
      used_count
      merchant_coupon_id
      restricted_to_product_id
    }
  }
`
export const GetActiveDefaultCouponsDocument = gql`
  query getActiveDefaultCoupons($now: timestamptz) {
    coupons(where: {default: {_eq: true}, expires: {_gt: $now}}) {
      expires
      percentage_discount
      merchant_coupon_id
      status
    }
  }
`
export const UpdateCouponDocument = gql`
  mutation updateCoupon($id: uuid!, $data: coupons_set_input!) {
    update_coupons_by_pk(_set: $data, pk_columns: {id: $id}) {
      id
      max_uses
      used_count
      status
    }
  }
`
export const GetMerchantAccountDocument = gql`
  query getMerchantAccount($id: uuid!) @cached {
    merchant_accounts_by_pk(id: $id) {
      id
      merchant_coupons {
        type
        percentage_discount
        id
        identifier
      }
      payment_processor_id
    }
  }
`
export const GetMerchantAccountsDocument = gql`
  query getMerchantAccounts @cached {
    merchant_accounts {
      id
      merchant_coupons {
        type
        percentage_discount
        id
        identifier
      }
      payment_processor_id
    }
  }
`
export const CreateMerchantChargeDocument = gql`
  mutation createMerchantCharge($data: merchant_charges_insert_input!) {
    insert_merchant_charges_one(object: $data) {
      id
      identifier
      merchant_customer_id
      merchant_account_id
      merchant_product_id
      user_id
    }
  }
`
export const GetMerchantChargeDocument = gql`
  query getMerchantCharge($identifier: String!) {
    merchant_charges(where: {identifier: {_eq: $identifier}}) {
      id
      identifier
      user_id
      status
      merchant_product_id
      merchant_customer_id
      purchases {
        id
        product {
          id
          name
        }
      }
    }
  }
`
export const GetCouponsForTypeAndDiscountDocument = gql`
  query getCouponsForTypeAndDiscount(
    $status: Int = 1
    $percentage_discount: numeric
    $type: String
  ) @cached {
    merchant_coupons(
      where: {
        status: {_eq: $status}
        percentage_discount: {_eq: $percentage_discount}
        type: {_eq: $type}
      }
    ) {
      percentage_discount
      type
      identifier
      id
      merchant_account {
        id
        payment_processor_id
      }
    }
  }
`
export const GetMerchantCouponDocument = gql`
  query getMerchantCoupon($id: uuid!) @cached {
    merchant_coupons_by_pk(id: $id) {
      type
      identifier
      percentage_discount
      id
    }
  }
`
export const CreateMerchantCustomerDocument = gql`
  mutation createMerchantCustomer($data: merchant_customers_insert_input!) {
    insert_merchant_customers_one(object: $data) {
      id
      identifier
      merchant_account_id
      user_id
    }
  }
`
export const GetMerchantCustomerForUserDocument = gql`
  query getMerchantCustomerForUser($user_id: uuid!) {
    merchant_customers(where: {user_id: {_eq: $user_id}}) {
      id
      identifier
      user_id
    }
  }
`
export const GetMerchantProductByIdentifierDocument = gql`
  query getMerchantProductByIdentifier($identifier: String!) {
    merchant_products(where: {identifier: {_eq: $identifier}}) {
      id
      identifier
      product {
        id
        name
      }
      merchant_prices {
        id
      }
      merchant_account_id
      product_id
    }
  }
`
export const GetProductsDocument = gql`
  query getProducts @cached {
    products(where: {status: {_eq: 1}}) {
      prices(where: {status: {_eq: 1}}) {
        id
        nickname
        status
        unit_amount
      }
      key
      id
      name
      status
    }
  }
`
export const GetProductDocument = gql`
  query getProduct($id: uuid!) @cached {
    products_by_pk(id: $id) {
      prices(where: {status: {_eq: 1}}) {
        id
        nickname
        status
        unit_amount
      }
      id
      name
      status
      merchant_products {
        id
        identifier
        merchant_prices {
          id
          identifier
        }
      }
    }
  }
`
export const GetProductsAndCouponsDocument = gql`
  query getProductsAndCoupons($status: Int = 1) @cached {
    products(where: {status: {_eq: $status}}) {
      prices(where: {status: {_eq: $status}}) {
        id
        nickname
        unit_amount
        merchant_prices {
          id
          identifier
        }
      }
      key
      id
      name
    }
    merchant_coupons {
      percentage_discount
      type
      identifier
      id
      merchant_account {
        id
        payment_processor_id
      }
    }
  }
`
export const GetPurchaseDocument = gql`
  query getPurchase($id: uuid!) {
    purchases_by_pk(id: $id) {
      id
      product {
        id
        name
      }
      user {
        email
        id
      }
    }
  }
`
export const CreatePurchaseDocument = gql`
  mutation createPurchase($data: purchases_insert_input!) {
    insert_purchases_one(object: $data) {
      id
      coupon_id
      product_id
      user_id
    }
  }
`
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
      purchases {
        id
        product {
          id
          name
        }
      }
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
    getCouponForCode(
      variables: GetCouponForCodeQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetCouponForCodeQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetCouponForCodeQuery>(
            GetCouponForCodeDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getCouponForCode',
        'query',
      )
    },
    getCoupon(
      variables: GetCouponQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetCouponQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetCouponQuery>(GetCouponDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getCoupon',
        'query',
      )
    },
    getActiveDefaultCoupons(
      variables?: GetActiveDefaultCouponsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetActiveDefaultCouponsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetActiveDefaultCouponsQuery>(
            GetActiveDefaultCouponsDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getActiveDefaultCoupons',
        'query',
      )
    },
    updateCoupon(
      variables: UpdateCouponMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<UpdateCouponMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateCouponMutation>(
            UpdateCouponDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'updateCoupon',
        'mutation',
      )
    },
    getMerchantAccount(
      variables: GetMerchantAccountQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetMerchantAccountQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMerchantAccountQuery>(
            GetMerchantAccountDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getMerchantAccount',
        'query',
      )
    },
    getMerchantAccounts(
      variables?: GetMerchantAccountsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetMerchantAccountsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMerchantAccountsQuery>(
            GetMerchantAccountsDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getMerchantAccounts',
        'query',
      )
    },
    createMerchantCharge(
      variables: CreateMerchantChargeMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CreateMerchantChargeMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateMerchantChargeMutation>(
            CreateMerchantChargeDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'createMerchantCharge',
        'mutation',
      )
    },
    getMerchantCharge(
      variables: GetMerchantChargeQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetMerchantChargeQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMerchantChargeQuery>(
            GetMerchantChargeDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getMerchantCharge',
        'query',
      )
    },
    getCouponsForTypeAndDiscount(
      variables?: GetCouponsForTypeAndDiscountQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetCouponsForTypeAndDiscountQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetCouponsForTypeAndDiscountQuery>(
            GetCouponsForTypeAndDiscountDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getCouponsForTypeAndDiscount',
        'query',
      )
    },
    getMerchantCoupon(
      variables: GetMerchantCouponQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetMerchantCouponQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMerchantCouponQuery>(
            GetMerchantCouponDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getMerchantCoupon',
        'query',
      )
    },
    createMerchantCustomer(
      variables: CreateMerchantCustomerMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CreateMerchantCustomerMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateMerchantCustomerMutation>(
            CreateMerchantCustomerDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'createMerchantCustomer',
        'mutation',
      )
    },
    getMerchantCustomerForUser(
      variables: GetMerchantCustomerForUserQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetMerchantCustomerForUserQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMerchantCustomerForUserQuery>(
            GetMerchantCustomerForUserDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getMerchantCustomerForUser',
        'query',
      )
    },
    getMerchantProductByIdentifier(
      variables: GetMerchantProductByIdentifierQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetMerchantProductByIdentifierQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetMerchantProductByIdentifierQuery>(
            GetMerchantProductByIdentifierDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getMerchantProductByIdentifier',
        'query',
      )
    },
    getProducts(
      variables?: GetProductsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetProductsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProductsQuery>(GetProductsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getProducts',
        'query',
      )
    },
    getProduct(
      variables: GetProductQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetProductQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProductQuery>(GetProductDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getProduct',
        'query',
      )
    },
    getProductsAndCoupons(
      variables?: GetProductsAndCouponsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetProductsAndCouponsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProductsAndCouponsQuery>(
            GetProductsAndCouponsDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'getProductsAndCoupons',
        'query',
      )
    },
    getPurchase(
      variables: GetPurchaseQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetPurchaseQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetPurchaseQuery>(GetPurchaseDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getPurchase',
        'query',
      )
    },
    createPurchase(
      variables: CreatePurchaseMutationVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<CreatePurchaseMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreatePurchaseMutation>(
            CreatePurchaseDocument,
            variables,
            {...requestHeaders, ...wrappedRequestHeaders},
          ),
        'createPurchase',
        'mutation',
      )
    },
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
