import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
// internationalization
import { IntlProvider } from 'react-intl';

import messagesEn from './locales/en.json';
import messagesZh from './locales/zh.json';

import { Requester } from './Requester';
import { getUserLanguage } from './utils';
import TodoPage from './pages/TodoPage';
import { useState } from 'react';

const messages = {
  en: messagesEn,
  zh: messagesZh,
};

export default function App() {
  const userInfo = Requester.postUserInfo('');
  const [userSelectedLanguage, setUserSelectedLanguage] = useState(null);
  const pageProps = {
    user: userInfo,
    setUserSelectedLanguage: setUserSelectedLanguage,
  };

  const selectedLanguage = userSelectedLanguage ?? getUserLanguage();
  return (
    <IntlProvider
      locale={selectedLanguage}
      messages={messages[selectedLanguage]}
    >
      <Router>
        <Routes>
          <Route path="/" element={<TodoPage props={pageProps} />} />
        </Routes>
      </Router>
    </IntlProvider>
  );
}
