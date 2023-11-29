import React from 'react';
import { usePrivacyPolicy } from '../../talons/usePrivacyPolicy';
import PrivacyModal from '../PrivacyModal/privacyModal';

const PrivacyPolicy = () => {
  const {
    isShowMode,
    handleCancel,
    handleSubmit,
    policyData,
    loading,
    isModalClosed,
    isVersionChanged
  } = usePrivacyPolicy();

  if (loading || isModalClosed || !policyData.need_show) {
    return null;
  }

  return (
    <PrivacyModal
      isOpen={isShowMode}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      content={policyData}
      isVersionChanged={isVersionChanged}
    />
  );
};

export default PrivacyPolicy;
