import { gql } from '@apollo/client';

export const GET_GDPR_CONSENTS = gql`
  query amGetGdprConsents {
    amGetGdprConsents {
      consent_id
      name
      consent_code
      is_required
      hide_the_consent_after_user_left_the_consent
      consent_location
      link_type
      cms_page_id
      consent_text
      visibility
      has_agreement
      sort_order
    }
  }
`;

export const GET_GDPR_POLICY_TEXT = gql`
  query amGetGdprPolicyText($id: Int!) {
    amGetGdprPolicyText(id: $id) {
      title
      content
      need_show
      version
      version_changed
    }
  }
`;

export const GIVE_GDPR_CONSENT = gql`
  mutation giveAmGdprConsent($consents: [AmGdprConsentInput!]!) {
    giveAmGdprConsent(input: { consents: $consents }) {
      error
      message
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

export default {
  getGdprConsents: GET_GDPR_CONSENTS,
  getGdprPolicyText: GET_GDPR_POLICY_TEXT,
  giveGdprConsentMutation: GIVE_GDPR_CONSENT,
  acceptGdprPolicyMutation: ACCEPT_GDPR_POLICY
};
