import React, { Component } from 'react';
import moment from 'moment';
import { reduxForm, SubmissionError } from 'redux-form';
import {
  requiredWithCustomMessage as required,
  requiredBoolean,
  isBefore,
} from 'utils';
import { Button, IconTitle, Editable as EditWrapper } from 'hollaex-web-lib';
import { HeaderSection } from 'components/HeaderSection';
import { withKit } from 'components/KitContext';
import { isMobile } from 'react-device-detect';

const FORM_NAME = 'IdentityVerification';

class IdentityVerification extends Component {
  state = {
    formFields: {},
  };

  componentDidMount() {
    this.generateFormFields();
  }

  generateFormFields = () => {
    const { icons: ICONS, strings: STRINGS, countries_options: COUNTRIES_OPTIONS } = this.props;
    const formFields = {
      full_name: {
        type: 'text',
        stringId:
          'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_PLACEHOLDER',
        label:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_LABEL'
            ],
        placeholder:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_PLACEHOLDER'
            ],
        validate: [required(STRINGS['VALIDATIONS.REQUIRED'])],
        fullWidth: isMobile,
        ishorizontalfield: true,
      },
      gender: {
        type: 'select',
        stringId:
          'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_PLACEHOLDER',
        label:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL'
            ],
        placeholder:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_PLACEHOLDER'
            ],
        options: [
          {
            value: false,
            stringId:
              'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN',
            label:
              STRINGS[
                'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN'
                ],
            icon: ICONS['GENDER_MALE'],
          },
          {
            value: true,
            stringId:
              'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN',
            label:
              STRINGS[
                'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN'
                ],
            icon: ICONS['GENDER_FEMALE'],
          },
        ],
        validate: [requiredBoolean(STRINGS['VALIDATIONS.REQUIRED'])],
        fullWidth: isMobile,
        ishorizontalfield: true,
      },
      dob: {
        type: 'date-dropdown',
        stringId:
          'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL',
        language: 'en',
        label:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL'
            ],
        validate: [required(STRINGS['VALIDATIONS.REQUIRED']), isBefore('', STRINGS['VALIDATIONS.INVALID_DATE'])],
        endDate: moment().add(1, 'days'),
        pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}',
        fullWidth: isMobile,
        ishorizontalfield: true,
      },
      nationality: {
        type: 'autocomplete',
        stringId:
          'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_PLACEHOLDER',
        label:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL'
            ],
        placeholder:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_PLACEHOLDER'
            ],
        options: COUNTRIES_OPTIONS,
        validate: [required(STRINGS['VALIDATIONS.REQUIRED'])],
        fullWidth: isMobile,
        ishorizontalfield: true,
      },
      country: {
        type: 'autocomplete',
        stringId:
          'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_PLACEHOLDER',
        label:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL'
            ],
        placeholder:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_PLACEHOLDER'
            ],
        options: COUNTRIES_OPTIONS,
        validate: [required(STRINGS['VALIDATIONS.REQUIRED'])],
        fullWidth: isMobile,
        ishorizontalfield: true,
      },
      city: {
        type: 'text',
        stringId:
          'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_PLACEHOLDER',
        label:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL'
            ],
        placeholder:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_PLACEHOLDER'
            ],
        validate: [required(STRINGS['VALIDATIONS.REQUIRED'])],
        fullWidth: isMobile,
        ishorizontalfield: true,
      },
      address: {
        type: 'text',
        stringId:
          'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_PLACEHOLDER',
        label:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL'
            ],
        placeholder:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_PLACEHOLDER'
            ],
        validate: [required(STRINGS['VALIDATIONS.REQUIRED'])],
        fullWidth: isMobile,
        ishorizontalfield: true,
      },
      postal_code: {
        type: 'text',
        stringId:
          'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_PLACEHOLDER',
        label:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL'
            ],
        placeholder:
          STRINGS[
            'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_PLACEHOLDER'
            ],
        validate: [required(STRINGS['VALIDATIONS.REQUIRED'])],
        fullWidth: isMobile,
        ishorizontalfield: true,
      },
    };

    this.setState({ formFields });
  };

  handleSubmit = (values) => {
    const { moveToNextStep, setActivePageContent, updateUser } = this.props;
    if (this.props.fullName) {
      delete values.full_name;
    }
    return updateUser(values)
      .then(({ data }) => {
        moveToNextStep('identity', data);
        setActivePageContent('email');
      })
      .catch((err) => {
        const error = { _error: err.message };
        if (err.response && err.response.data) {
          error._error = err.response.data.message;
        }
        throw new SubmissionError(error);
      });
  };

  onGoBack = () => {
    const { setActivePageContent, handleBack } = this.props;
    setActivePageContent('email');
    handleBack('kyc');
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      valid,
      error,
      openContactForm,
      icons: ICONS,
      strings: STRINGS,
      getErrorLocalized,
      renderFields,
    } = this.props;
    const { formFields } = this.state;
    return (
      <div>
        <IconTitle
          stringId="USER_VERIFICATION.IDENTITY_VERIFICATION"
          text={STRINGS['USER_VERIFICATION.IDENTITY_VERIFICATION']}
          textType="title"
          iconPath={ICONS['VERIFICATION_ID_NEW']}
        />
        <form className="d-flex flex-column w-100 verification_content-form-wrapper">
          <div className="verification-form-panel mt-3 mb-5">
            <HeaderSection
              stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PERSONAL_INFORMATION"
              title={
                STRINGS[
                  'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PERSONAL_INFORMATION'
                  ]
              }
              openContactForm={openContactForm}
            >
              <div className="my-1 verification-info-txt">
                <EditWrapper stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TEXT">
                  {
                    STRINGS[
                      'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TEXT'
                      ]
                  }
                </EditWrapper>
              </div>
            </HeaderSection>
            {renderFields(formFields)}
            {error && (
              <div className="warning_text">{getErrorLocalized(error)}</div>
            )}
          </div>
          <div className="d-flex justify-content-center align-items-center mt-2">
            <div className="f-1 d-flex justify-content-end verification-buttons-wrapper">
              <EditWrapper stringId="USER_VERIFICATION.GO_BACK" />
              <Button
                label={STRINGS['USER_VERIFICATION.GO_BACK']}
                onClick={this.onGoBack}
              />
            </div>
            <div className="separator" />
            <div className="f-1 verification-buttons-wrapper">
              <EditWrapper stringId="SUBMIT" />
              <Button
                type="button"
                onClick={handleSubmit(this.handleSubmit)}
                label={STRINGS['SUBMIT']}
                disabled={pristine || submitting || !valid || !!error}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapContextToProps = ({ strings, setActivePageContent, moveToNextStep, activeLanguage, getErrorLocalized, icons, renderFields, updateUser, countries_options, openContactForm }) => ({
  strings,
  setActivePageContent,
  moveToNextStep,
  activeLanguage,
  getErrorLocalized,
  icons,
  renderFields,
  updateUser,
  countries_options,
  openContactForm
});

const IdentityVerificationForm = reduxForm({
  form: FORM_NAME,
})(withKit(mapContextToProps)(IdentityVerification));

export default IdentityVerificationForm;
