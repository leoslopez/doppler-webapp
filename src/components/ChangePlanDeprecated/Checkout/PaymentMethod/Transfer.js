import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl } from 'react-intl';
import {
  FieldGroup,
  FieldItem,
  SelectFieldItem,
  InputFieldItem,
  CuitFieldItem,
} from '../../../form-helpers/form-helpers';
import { Loading } from '../../../Loading/Loading';
import { actionPage } from '../Checkout';
import { useFormikContext, Field } from 'formik';
import { fieldNames, paymentType } from './PaymentMethod';
import { validateCuit } from '../../../../validations';

export const finalConsumer = 'CF';

export const identificationTypes = [
  { key: 'CF', value: 'DNI/CUIL' },
  { key: 'RI', value: 'CUIT' },
  { key: 'RNI', value: 'CUIT' },
  { key: 'MT', value: 'CUIT' },
  { key: 'EX', value: 'CUIT' },
  { key: 'NG', value: 'CUIT' },
  { key: 'NC', value: 'CUIT' },
  { key: 'RFC', value: 'RFC' },
];

export const TransferArgentina = ({ paymentMethod, consumerTypes }) => {
  const { setFieldValue, setValues } = useFormikContext();
  const [consumerType, setConsumerType] = useState('');
  const [identificationType, setIdentificationType] = useState('');
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const defaultOption = { key: '', value: _('checkoutProcessForm.empty_option_select') };

  useEffect(() => {
    setValues({
      [fieldNames.identificationNumber]: paymentMethod.identificationNumber,
      [fieldNames.businessName]: paymentMethod.razonSocial,
      [fieldNames.consumerType]: paymentMethod.idConsumerType ?? '',
      [fieldNames.paymentMethodName]: paymentType.transfer,
    });

    setConsumerType(paymentMethod.idConsumerType ?? '');
    const type = identificationTypes.filter((ct) => ct.key === paymentMethod.idConsumerType)[0]
      ?.value;
    setIdentificationType(type ?? '');
  }, [
    paymentMethod.idConsumerType,
    paymentMethod.identificationNumber,
    paymentMethod.razonSocial,
    setValues,
  ]);

  const changeConsumerType = (e) => {
    const { value } = e.target;
    setFieldValue(fieldNames.consumerType, value);
    const type = identificationTypes.filter((ct) => ct.key === value)[0]?.value;
    setConsumerType(value);
    setIdentificationType(type);
    initializeDefaultValues(value);
  };

  const initializeDefaultValues = (consumerType) => {
    setValues({
      [fieldNames.identificationNumber]: '',
      [fieldNames.businessName]: '',
      [fieldNames.consumerType]: consumerType,
      [fieldNames.paymentMethodName]: paymentType.transfer,
    });
  };

  return (
    <FieldItem className="field-item">
      <FieldGroup>
        <SelectFieldItem
          fieldName={fieldNames.consumerType}
          id="consumerType"
          label={`*${_('checkoutProcessForm.payment_method.consumer_type')}`}
          defaultOption={defaultOption}
          values={consumerTypes}
          required
          className="field-item field-item--70 dp-p-r"
          onChange={(e) => {
            changeConsumerType(e);
          }}
        />
        {consumerType !== '' ? (
          <CuitFieldItem
            type="text"
            aria-label="identificationNumber"
            fieldName={fieldNames.identificationNumber}
            id="identificationNumber"
            label={`*${identificationType}:`}
            maxLength={11}
            required
            validate={consumerType !== finalConsumer}
            className="field-item field-item--30"
            validateIdentificationNumber={validateCuit}
          />
        ) : null}
        {consumerType !== '' && consumerType !== finalConsumer ? (
          <InputFieldItem
            type="text"
            fieldName={fieldNames.businessName}
            id="businessName"
            label={`*${_('checkoutProcessForm.payment_method.business_name')}`}
            withNameValidation
            required
            className="field-item field-item--70 dp-p-r"
          />
        ) : null}
      </FieldGroup>
    </FieldItem>
  );
};

export const TransferColombia = ({ paymentMethod, readOnly }) => {
  const { setValues } = useFormikContext();
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    setValues({
      [fieldNames.identificationNumber]: paymentMethod.identificationNumber,
      [fieldNames.businessName]: paymentMethod.razonSocial,
      [fieldNames.responsableIVA]: paymentMethod.responsableIVA ?? false,
      [fieldNames.paymentMethodName]: paymentType.transfer,
    });
  }, [
    paymentMethod.identificationNumber,
    paymentMethod.razonSocial,
    paymentMethod.responsableIVA,
    setValues,
  ]);

  return (
    <>
      {readOnly ? (
        <li aria-label="resume data" className="field-item field-item--70 dp-p-r">
          <label>
            {`NIT: ${paymentMethod?.identificationNumber}`}
            {`, ${paymentMethod?.razonSocial}`}
            {`${paymentMethod.responsableIVA === '1' ? `, Responsable IVA` : ''}`}
          </label>
        </li>
      ) : (
        <>
          <FieldItem className="field-item">
            <FieldGroup>
              <InputFieldItem
                type="text"
                fieldName={fieldNames.businessName}
                id="businessName"
                label={`*${_('checkoutProcessForm.payment_method.business_name')}`}
                withNameValidation
                required
                className="field-item field-item--70 dp-p-r"
              />
              <CuitFieldItem
                type="text"
                aria-label="identificationNumber"
                fieldName={fieldNames.identificationNumber}
                id="identificationNumber"
                label={`*${_('checkoutProcessForm.payment_method.identification_type_colombia')}:`}
                maxLength={11}
                required
                className="field-item field-item--30"
                validateIdentificationNumber={validateCuit}
              />
            </FieldGroup>
          </FieldItem>
          <FieldItem className="field-item">
            <label>{`*${_('checkoutProcessForm.payment_method.responsable_iva')}:`}</label>
            <Field name="responsableIVA">
              {({ field }) => (
                <ul role="group" aria-labelledby="checkbox-group" className="dp-radio-input">
                  <li>
                    <div className="dp-volume-option">
                      <label>
                        <input
                          aria-label={'checkoutProcessForm.payment_method.responsable_iva'}
                          id={'checkoutProcessForm.payment_method.responsable_iva_no'}
                          type="radio"
                          name={fieldNames.responsableIVA}
                          {...field}
                          value={'0'}
                          checked={field.value === '0'}
                        />
                        <span>{'checkoutProcessForm.payment_method.responsable_iva_no'}</span>
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="dp-volume-option">
                      <label>
                        <input
                          aria-label={'checkoutProcessForm.payment_method.responsable_iva'}
                          id={'checkoutProcessForm.payment_method.responsable_iva_yes'}
                          type="radio"
                          name={fieldNames.responsableIVA}
                          {...field}
                          value={'1'}
                          checked={field.value === '1'}
                        />
                        <span>{'checkoutProcessForm.payment_method.responsable_iva_yes'}</span>
                      </label>
                    </div>
                  </li>
                </ul>
              )}
            </Field>
          </FieldItem>
        </>
      )}
    </>
  );
};

export const Transfer = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, staticDataClient },
    optionView,
  }) => {
    const intl = useIntl();
    const [state, setState] = useState({
      loading: true,
      paymentMethod: {},
      readOnly: true,
      country: '',
      responsableIVA: false,
    });

    useEffect(() => {
      const getConsumerTypesData = async (country, language) => {
        const data = await staticDataClient.getConsumerTypesData(country, language);
        const consumerTypes = data.success ? data.value : [];
        return consumerTypes;
      };

      const fetchData = async () => {
        const billingInformationResult =
          await dopplerBillingUserApiClient.getBillingInformationData();

        const consumerTypes = await getConsumerTypesData(
          billingInformationResult.value.country,
          intl.locale,
        );

        const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();

        const selectedConsumerType = consumerTypes.filter(
          (ct) => ct.key === paymentMethodData.value.idConsumerType,
        )[0];

        const identificationType = identificationTypes.filter(
          (ct) => ct.key === paymentMethodData.value.idConsumerType,
        )[0];

        if (optionView === actionPage.READONLY) {
          setState({
            paymentMethod: paymentMethodData.success ? paymentMethodData.value : {},
            selectedConsumerType,
            identificationType,
            loading: false,
            readOnly: true,
            country: billingInformationResult.value.country,
            responsableIVA: paymentMethodData.value.responsableIVA,
          });
        } else {
          setState({
            loading: false,
            readOnly: false,
            paymentMethod: paymentMethodData.success ? paymentMethodData.value : {},
            selectedConsumerType,
            identificationType,
            consumerTypes,
            country: billingInformationResult.value.country,
            responsableIVA: paymentMethodData.value.responsableIVA,
          });
        }
      };

      fetchData();
    }, [
      dopplerBillingUserApiClient,
      dopplerAccountPlansApiClient,
      staticDataClient,
      optionView,
      intl.locale,
    ]);

    return (
      <>
        {state.loading ? (
          <Loading page />
        ) : (
          <FieldGroup>
            {state.country === 'ar' ? (
              state.readOnly ? (
                <li aria-label="resume data" className="field-item field-item--70 dp-p-r">
                  <label>
                    {state.selectedConsumerType?.value}, {state.identificationType?.value}:{' '}
                    {state.paymentMethod?.identificationNumber}
                    {state.identificationType.key !== finalConsumer
                      ? `, ${state.paymentMethod?.razonSocial}`
                      : ''}
                  </label>
                </li>
              ) : (
                <TransferArgentina
                  consumerTypes={state.consumerTypes}
                  paymentMethod={state.paymentMethod}
                ></TransferArgentina>
              )
            ) : state.country === 'co' ? (
              <TransferColombia
                paymentMethod={state.paymentMethod}
                readOnly={state.readOnly}
              ></TransferColombia>
            ) : null}
          </FieldGroup>
        )}
      </>
    );
  },
);
