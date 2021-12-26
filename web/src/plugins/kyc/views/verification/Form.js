import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { withKit } from 'components/KitContext';
import Identity from './components/Identity';
import Documents from './components/Documents';

const { TabPane } = Tabs;
const INITIAL_KYC_TAB_KEY = 'initial_kyc_tab';

const Form = ({ handleBack: back, strings: STRINGS, user, constants, identityInitialValues, documentInitialValues }) => {
  const kycTabs = [
    {
      key: 'identity',
      title: STRINGS['USER_VERIFICATION.TITLE_IDENTITY'],
    },
    {
      key: 'documents',
      title: STRINGS['USER_VERIFICATION.TITLE_ID_DOCUMENTS'],
    },
  ];

  const [activeKYCTab, setActiveKYCTab] = useState('identity');

  useEffect(() => {
    const kycInitialTab = localStorage.getItem(INITIAL_KYC_TAB_KEY);
    if (kycInitialTab && kycTabs.map(({key}) => key).includes(kycInitialTab)) {
      setActiveKYCTab(kycInitialTab);
    }
  }, []);

  const handleBack = (key) => (params) => {
    localStorage.setItem(INITIAL_KYC_TAB_KEY, key);
    back(params)
  }

  const renderKYCVerificationContent = (key) => {

    switch (key) {
      case 'identity':
        return (
          <Identity
            fullName={user.full_name}
            initialValues={identityInitialValues(user, constants)}
            handleBack={handleBack(key)}
          />
        );
      case 'documents':
        return (
          <Documents
            idData={user.id_data}
            initialValues={documentInitialValues(user)}
            handleBack={handleBack(key)}
          />
        );
      default:
        return <div>No content</div>;
    }
  };

  return (
    <div className="presentation_container apply_rtl verification_container">
      <Tabs activeKey={activeKYCTab} onTabClick={setActiveKYCTab}>
        {kycTabs.map(({ key, title }) => (
          <TabPane tab={title} key={key}>
            {renderKYCVerificationContent(key)}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}

const mapContextToProps = ({ handleBack, strings, user, constants, identityInitialValues, documentInitialValues }) => ({
  handleBack,
  strings,
  user,
  constants,
  identityInitialValues,
  documentInitialValues
});

export default withKit(mapContextToProps)(Form);