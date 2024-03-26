import React from 'react';
import { Page, PageContext } from '../Page';
import { NavigationMenu } from './NavigationMenu';
import { PageProps } from '../Page';
import { Plan, PlanInterface } from './plan';
import TodoBoard from './TodoBoard';

const PageContent: React.FC<{ props: PageProps }> = ({ props }) => {
  const { user, setUserSelectedLanguage } = props;
  // @ts-ignore
  const { messageApi } = React.useContext(PageContext);

  // messageApi.open({
  //     type: 'info',
  //     content: 'Hello Page!',
  // });

  const plan: PlanInterface = Plan();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100vh',
      }}
    >
      <NavigationMenu user={user} subject={plan} />
      <TodoBoard
        subject={plan}
        setUserSelectedLanguage={setUserSelectedLanguage}
      />
    </div>
  );
};

export const App: React.FC<{ props: PageProps }> = ({ props }) => {
  return (
    <Page>
      <PageContent props={props} />
    </Page>
  );
};
export default App;
