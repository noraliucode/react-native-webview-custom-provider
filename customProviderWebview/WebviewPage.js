import React, {useRef, useState, useEffect} from 'react';
import {View} from 'react-native';
import {INJECTED_PROVIDER as _INJECTED_PROVIDER} from './Provider';
import {WebView} from 'react-native-webview';

const Web3Webview = () => {
  const [uri, setUri] = useState('https://www.google.com');

  useEffect(() => {
    setTimeout(() => setUri('https://rarible.com/'), 5000);
  }, []);

  console.log('test');
  const webref = useRef(null);

  const injectJS = jsonString => {
    setTimeout(
      () =>
        webref.current.injectJavaScript(`
    ReactNativeWebView.onMessage(${jsonString});
    true;
    `),
      100,
    );
  };

  const onMessage = data => {
    console.log('onMessage data', data);
    let res = {};
    if (data.payload) {
      res = {
        type: 'web3-send-async-callback',
        messageId: data.messageId,
        jsonrpc: '2.0',
        result: {result: 387207600000000}, // wei
      };
    } else {
      res = {
        type: 'api-response',
        messageId: data.messageId,
        isAllowed: true,
        data: ['0x8d097570E71172aF63F3539dEf286D1e70793FF8'],
        permission: 'web3',
      };
    }

    const jsonString = JSON.stringify(res);
    console.log(jsonString);
    injectJS(jsonString);
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webref}
        onMessage={e => {
          const data = JSON.parse(e.nativeEvent.data);
          console.log('data', data);
          onMessage(data);
        }}
        injectedJavaScriptBeforeContentLoaded={_INJECTED_PROVIDER}
        source={{uri}}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default Web3Webview;
