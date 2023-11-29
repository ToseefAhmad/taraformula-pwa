import { gql } from '@apollo/client';

export const GET_ACCOUNT_SETTINGS = gql`
  query amGetGdprAccountAction {
    amGetGdprAccountAction {
      title
      content
      hasCheckbox
      checkboxText
      hidePassword
      needPassword
      submitText
      action
      actionCode
    }
  }
`;

export const ACCEPT_GDPR_POLICY = gql`
  mutation acceptAmGdprPolicy($policy_version: String!) {
    acceptAmGdprPolicy(input: { policy_version: $policy_version }) {
      error
      message
    }
  }
`;

export const ANONIMISE_CUSTOMER_DATA = gql`
  mutation anonymiseAmGdprCustomer($password: String!) {
    anonymiseAmGdprCustomer(input: { password: $password }) {
      error
      message
    }
  }
`;

export const DOWNLOAD_CUSTOMER_DATA = gql`
  mutation amGetGdprCustomerPersonalData($password: String!) {
    amGetGdprCustomerPersonalData(input: { password: $password }) {
      label
      value
    }
  }
`;

export const DELETE_CUSTOMER_ACCOUNT = gql`
  mutation requestAmGdprAccountDeletion($password: String!) {
    requestAmGdprAccountDeletion(input: { password: $password }) {
      error
      message
    }
  }
`;

export default {
  getAccountSettings: GET_ACCOUNT_SETTINGS,
  acceptGdprPolicyMutation: ACCEPT_GDPR_POLICY,
  anonimiseCustomerDataMutation: ANONIMISE_CUSTOMER_DATA,
  downloadCustomerDataMutation: DOWNLOAD_CUSTOMER_DATA,
  deleteCustomerAccountMutation: DELETE_CUSTOMER_ACCOUNT
};
