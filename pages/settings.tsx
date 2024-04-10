import React, { useState } from 'react';
import { Button, Input, LoadingOverlay, Callout, Heading, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import { ClientError } from '../types/common';
import { SettingsValue } from '../types/types';

export default function Settings() {
  const { value, setValue } = useMeshLocation<'settings', SettingsValue>();

  const [formValues, setFormValues] = useState<SettingsValue>(value);

  const [isLoading, setIsLoading] = React.useState(false);
  const [testMessage, setTestMessage] = React.useState<ClientError | null>(null);
  const [message, setMessage] = React.useState<ClientError | null>(null);

  const handleSaveClick = async () => {
    setTestMessage(null);
    setIsLoading(true);
    try {
      await setValue(() => ({ newValue: formValues }));
      setMessage({
        type: 'success',
        text: 'Uniform was able to save settings.',
      });
    } catch (error) {
      setMessage({ type: 'error', title: 'Unable to save settings. ', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestClick = async () => {
    try {
      setIsLoading(true);
      const body = {
        url: formValues.endpoint,
        token: formValues.apiKey,
        method: 'POST',
        data: {
          from: 0,
          size: 1,
          _source: ['assetId', 'filename', 'mimeType', 'title', 'baseURL'],
        } as any,
      };

      await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      setMessage({
        type: 'success',
        text: 'Uniform was able to verify access.',
      });
      setTestMessage({ type: 'success', text: 'Success' });
    } catch (error) {
      setMessage({
        type: 'error',
        title: 'Uniform failed to verify access. ',
        text: error.message,
      });
      setTestMessage({ type: 'error', text: 'Failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage(null);
    setTestMessage(null);
  };

  return (
    <div className="main-container">
      <Heading level={2}>Elastic Search settings</Heading>
      <p>These settings are used when opening the Elastic Search Media Selector.</p>
      <LoadingOverlay isActive={isLoading} />
      <div className="container-with-vertical-padding">
        {message && (
          <Callout title={message?.title} type={message.type}>
            {message.text}
          </Callout>
        )}
      </div>
      <div className="container-with-space">
        <Input
          id="endpoint"
          name="endpoint"
          label="Endpoint"
          placeholder="Endpoint"
          onChange={handleFormInputChange}
          value={formValues?.endpoint}
        />
        <Input
          id="apiKey"
          name="apiKey"
          label="API Key"
          placeholder="Your API key"
          onChange={handleFormInputChange}
          value={formValues?.apiKey}
        />
        <Input
          id="imgBaseUrl"
          name="imgBaseUrl"
          label="ImgBaseUrl"
          placeholder="ImgBaseUrl"
          onChange={handleFormInputChange}
          value={formValues?.imgBaseUrl}
        />
      </div>
      <div className="container-settings-button">
        <Button
          type="button"
          buttonType="secondary"
          onClick={handleSaveClick}
          disabled={
            isLoading ||
            !formValues?.endpoint ||
            !formValues?.apiKey ||
            !formValues?.imgBaseUrl ||
            testMessage?.type !== 'success'
          }
        >
          Save
        </Button>
        {Boolean(formValues?.endpoint) && Boolean(formValues?.apiKey) && (
          <Button type="button" buttonType="primary" onClick={handleTestClick} disabled={isLoading}>
            Test
          </Button>
        )}
        {testMessage && <Callout type={testMessage.type}>{testMessage.text}</Callout>}
      </div>
    </div>
  );
}
