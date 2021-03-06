import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from '@reach/router';
import { useToasts } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';

import { fetchBuildsListIfNeeded, fetchMoreBuilds } from '../../actions/BuildsAction';
import { getSettingsRequest } from 'redux/modules/settings';
import { RootState } from 'redux/modules/root';

import Button from '../../components/base/Button/Button';
import Page from '../../components/common/Page/Page';
import Loader from '../../components/common/Loader/Loader';
import BuildHistory from '../../components/common/BuildHistory/BuildHistory';
import GetStarted from './components/GetStarted/GetStarted';
import BuildModal from './components/BuildModal/BuildModal';

import './Home.css';

const Home: React.FC<RouteComponentProps> = () => {
  const { t } = useTranslation();

  const settings = useSelector((state: RootState) => state.settings);
  const builds = useSelector((state: RootState) => state.builds);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { error } = settings;

  useEffect(() => {
    if (error && error !== 'INTERNAL_SERVER_ERROR') {
      const isNetworkError = /500$/.test(error);
      const message = isNetworkError ? 'Network error. Please check internet connection' : error;
      addToast(message, { appearance: 'error' });
    }
  }, [error, addToast]);

  useEffect(() => {
    if (!settings.repoName) {
      dispatch(getSettingsRequest());
      dispatch(fetchBuildsListIfNeeded());
    }
  }, [dispatch, settings]);

  const handleLoadMore = useCallback(() => {
    dispatch(fetchMoreBuilds());
  }, [dispatch]);

  // TODO: create custom hook for modal
  const [buildModalOpen, setBuildModalOpen] = useState(false);
  const handleBuildModalOpen = useCallback(
    (e) => {
      if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') {
        return;
      }
      setBuildModalOpen(true);
    },
    [setBuildModalOpen],
  );
  const handleBuildModalClose = useCallback(() => {
    setBuildModalOpen(false);
  }, [setBuildModalOpen]);

  const settingsLoadedAndSpecified = Boolean(!settings.isFetching && settings.repoName);

  return (
    <Page
      contentClass="container"
      headerText={settings.repoName}
      headerControls={
        <>
          {settings.repoName && (
            <Button
              type="button"
              className="header__control"
              mods={{ size: 'small' }}
              iconType="play"
              onClick={handleBuildModalOpen}
            >
              {t('Run build')}
            </Button>
          )}
          <Button
            to="/settings"
            className="header__control"
            mods={{ size: 'small', 'icon-only': !!settings.repoName }}
            iconType="settings"
            title={t('Settings')}
          >
            {t('Settings')}
          </Button>
        </>
      }
    >
      <Loader isLoading={settings.isFetching || (settingsLoadedAndSpecified && !builds.isLoaded)}>
        {!settings.repoName ? (
          <GetStarted />
        ) : (
          <BuildHistory
            builds={builds.buildsList}
            loadMore={handleLoadMore}
            isLoadedAll={builds.isFullListLoaded}
            isLoadingMore={builds.isFetchingMore}
          />
        )}
      </Loader>
      <BuildModal isOpen={buildModalOpen} closeModal={handleBuildModalClose}></BuildModal>
    </Page>
  );
};

export default Home;
