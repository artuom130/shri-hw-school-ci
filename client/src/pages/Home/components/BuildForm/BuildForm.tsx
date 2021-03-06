import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import { Formik, FormikErrors } from 'formik';

import Input from '../../../../components/base/Input/Input';
import Button from '../../../../components/base/Button/Button';
import Loader from '../../../../components/common/Loader/Loader';
import ErrorModal from '../../../../components/common/ErrorModal/ErrorModal';

import { addBuild, updateBuildsList } from '../../../../actions/BuildsAction';

import './BuildForm.css';
import { useTranslation } from 'react-i18next';

interface BuildFormValues {
  commitHash: string;
}

interface ModalErrorState {
  isOpen: boolean;
  message?: string;
}

type BuildFormProps = {
  closeModal: () => void;
  className?: string;
};

const BuildForm: React.FC<BuildFormProps> = (props) => {
  const { t } = useTranslation();

  const { closeModal, className = '' } = props;

  const dispatch = useDispatch();
  const [error, setError] = useState<ModalErrorState>({ isOpen: false });

  const initialValues: BuildFormValues = {
    commitHash: '',
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: FormikErrors<BuildFormValues> = {};
          if (!values.commitHash) {
            errors.commitHash = t('Commit hash is required');
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const data = await addBuild(values.commitHash);
            dispatch(updateBuildsList(data));
            navigate(`/details/${data.id}`);
          } catch (error) {
            const errorMessage: string =
              error?.response?.data?.error?.errorCode ||
              error?.response?.data?.error?.message ||
              error.message;
            setError({ isOpen: true, message: errorMessage });
          }
          resetForm();
          setSubmitting(false);
        }}
      >
        {(formikBag) => {
          const { getFieldProps, handleSubmit, isSubmitting, setFieldValue } = formikBag;
          return (
            <Loader isLoading={isSubmitting} showContent style={{ width: '30%' }}>
              <form className={`build-form ${className}`} onSubmit={handleSubmit}>
                <Input
                  mods={{ clear: true, fullwidth: true }}
                  placeholder={t('Commit hash')}
                  id="commitHash"
                  setFieldValue={setFieldValue}
                  {...getFieldProps('commitHash')}
                  required
                  pattern="\w{6,}"
                  title={t('Hash 6 letters/numbers')}
                ></Input>
                <div className="build-form__submit-group build-modal__elem">
                  <Button
                    type="submit"
                    mods={{ action: true, disabled: isSubmitting }}
                    className="build-form__submit-group-elem"
                  >
                    {t('Run build')}
                  </Button>
                  <Button
                    className="build-form__submit-group-elem"
                    mods={{ disabled: isSubmitting }}
                    onClick={closeModal}
                  >
                    {t('Cancel')}
                  </Button>
                </div>
              </form>
            </Loader>
          );
        }}
      </Formik>
      <ErrorModal
        isOpen={error.isOpen}
        errorMessage={error.message}
        closeModal={() => {
          setError({ isOpen: false });
        }}
      ></ErrorModal>
    </>
  );
};

export default BuildForm;
