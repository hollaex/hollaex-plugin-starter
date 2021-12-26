import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { withKit } from 'components/KitContext';
import Identity from './components/Identity';
import Documents from './components/Documents';

const { TabPane } = Tabs;
const INITIAL_KYC_TAB_KEY = 'initial_kyc_tab';

const Form = ({ strings: STRINGS, setActivePageContent: setPageContent, handleBack, activeLanguage, user, getCountry, getFormatTimestamp, icons: ICONS }) => {
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

  const setActivePageContent = (key) => (page) => {
    localStorage.setItem(INITIAL_KYC_TAB_KEY, key);
    setPageContent(page)
  }

  const renderKYCVerificationHomeContent = (key, user, activeLanguage) => {
    switch (key) {
      case 'identity':
        return (
          <Identity
            activeLanguage={activeLanguage}
            user={user}
            handleBack={handleBack}
            setActivePageContent={setActivePageContent(key)}
            getFormatTimestamp={getFormatTimestamp}
            getCountry={getCountry}
            strings={STRINGS}
          />
        );
      case 'documents':
        return (
          <Documents
            user={user}
            setActivePageContent={setActivePageContent(key)}
            icons={ICONS}
            strings={STRINGS}
          />
        );
      default:
        return <div>No content</div>;
    }
  };

  return (
    <div>
      <Tabs activeKey={activeKYCTab} onTabClick={setActiveKYCTab}>
        {kycTabs.map(({ key, title }) => (
          <TabPane tab={title} key={key}>
            {renderKYCVerificationHomeContent(
              key,
              user,
              activeLanguage
            )}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}

const mapContextToProps = ({ strings, setActivePageContent, handleBack, activeLanguage, user, getCountry, getFormatTimestamp, icons }) => ({
  strings,
  setActivePageContent,
  handleBack,
  activeLanguage,
  user,
  getCountry,
  getFormatTimestamp,
  icons,
});

export default withKit(mapContextToProps)(Form);