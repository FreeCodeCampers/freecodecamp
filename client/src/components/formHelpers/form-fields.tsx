import {
  FormControl,
  FormGroup,
  ControlLabel,
  Alert,
  HelpBlock
} from '@freecodecamp/ui';
import normalizeUrl from 'normalize-url';
import React from 'react';
import { Field } from 'react-final-form';
import {
  editorValidator,
  localhostValidator,
  composeValidators,
  fCCValidator,
  httpValidator,
  pathValidator,
  sourceCodeLinkExistsValidator,
  sourceCodeLinkPublicValidator
} from './form-validators';

export type FormOptions = {
  ignored?: string[];
  isEditorLinkAllowed?: boolean;
  isLocalLinkAllowed?: boolean;
  isSourceCodeLinkRequired?: boolean;
  required?: string[];
  types?: { [key: string]: string };
  placeholders?: { [key: string]: string };
};

type FormFieldsProps = {
  formFields: { name: string; label: string }[];
  options: FormOptions;
};

function FormFields({ formFields, options }: FormFieldsProps): JSX.Element {
  const {
    ignored = [],
    placeholders = {},
    required = [],
    types = {},
    isEditorLinkAllowed = false,
    isLocalLinkAllowed = false,
    isSourceCodeLinkRequired = false
  } = options;

  const nullOrWarning = (
    value: string,
    error: unknown,
    isURL: boolean,
    name: string
  ) => {
    let validationError: string | undefined;
    if (value && isURL) {
      try {
        normalizeUrl(value, { stripWWW: false });
      } catch (err: unknown) {
        validationError = (err as { message?: string })?.message;
      }
    }

    const validators = [fCCValidator, httpValidator];
    const isSolutionLink = name !== 'githubLink';
    if (isSolutionLink && !isEditorLinkAllowed) {
      validators.push(editorValidator);
      if (isLocalLinkAllowed) {
        validators.push(pathValidator);
      }
    }
    if (name === 'githubLink') {
      if (isSourceCodeLinkRequired) {
        validators.push(sourceCodeLinkExistsValidator);
      }
      validators.push(sourceCodeLinkPublicValidator);
    }
    if (!isLocalLinkAllowed) {
      validators.push(localhostValidator);
    }
    const validationWarning = composeValidators(...validators)(value);
    const message: string = (error ||
      validationError ||
      validationWarning) as string;
    return message ? (
      <HelpBlock>
        <Alert variant={error || validationError ? 'danger' : 'info'}>
          {message}
        </Alert>
      </HelpBlock>
    ) : null;
  };
  return (
    <>
      {formFields
        .filter(formField => !ignored.includes(formField.name))
        .map(({ name, label }) => (
          // TODO: verify if the value is always a string
          <Field key={`${name}-field`} name={name}>
            {({ input: { value, onChange }, meta: { pristine, error } }) => {
              const placeholder =
                name in placeholders ? placeholders[name] : '';
              const isURL = types[name] === 'url';
              return (
                <FormGroup key={name}>
                  <ControlLabel
                    htmlFor={name}
                    data-playwright-test-label={`${name}-control-label`}
                  >
                    {label}
                  </ControlLabel>
                  <FormControl
                    id={name}
                    name={name}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required.includes(name)}
                    rows={4}
                    type='url'
                    value={value as string}
                    data-playwright-test-label={`${name}-form-control`}
                  />
                  {nullOrWarning(
                    value as string,
                    !pristine && error,
                    isURL,
                    name
                  )}
                </FormGroup>
              );
            }}
          </Field>
        ))}
    </>
  );
}

FormFields.displayName = 'FormFields';

export default FormFields;
