import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettingsIfNeeded } from '../../actions/SettingsAction';
import { fetchBuildsListIfNeeded } from '../../actions/BuildsAction';

import Icon from 'components/base/Icon/Icon';
import Button from 'components/base/Button/Button';
import Page from 'components/common/Page/Page';
import Loader from 'components/common/Loader/Loader';
import GetStarted from 'components/common/GetStarted/GetStarted';
import BuildHistory from 'components/common/BuildHistory/BuildHistory';

import './Home.css';

function Home(props) {
  const settings = useSelector((state) => state.settings);
  const builds = useSelector((state) => state.builds);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettingsIfNeeded());
    dispatch(fetchBuildsListIfNeeded());
  }, [dispatch]);

  const settingsLoadedAndSpecified = Boolean(settings.isLoaded && settings.id);

  // TODO: show erorr if network is fall
  return (
    <Page
      contentClass="container"
      headerText={settings.repoName}
      headerControls={
        <>
          {settings.id && (
            <Button
              type="button"
              className="header__control"
              mods={{ size: 'small', icon: true }}
              icon={<Icon mods={{ size: 'small', type: 'play' }} />}
            >
              Run build
            </Button>
          )}
          <Button
            to="/settings"
            className="header__control"
            mods={{ size: 'small', icon: true, 'icon-only': !!settings.id }}
            icon={<Icon mods={{ size: 'small', type: 'settings' }} />}
          >
            Settings
          </Button>
        </>
      }
    >
      <Loader isLoading={!settings.isLoaded || (settingsLoadedAndSpecified && !builds.isLoaded)}>
        {!settings.id ? <GetStarted /> : <BuildHistory builds={builds.buildsList} />}
      </Loader>
    </Page>
  );
}

export default Home;
