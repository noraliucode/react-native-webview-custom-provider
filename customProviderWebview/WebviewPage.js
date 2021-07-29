import React, {useRef} from 'react';
import {View} from 'react-native';
import {INJECTED_PROVIDER} from './Provider';
import {WebView} from 'react-native-webview';

const Web3Webview = () => {
  const webref = useRef(null);

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webref}
        onMessage={e => {
          const data = JSON.parse(e.nativeEvent.data);
          console.log('RN e.nativeEvent.data', e.nativeEvent.data);
          console.log('RN e.nativeEvent', e.nativeEvent);
          if (e.nativeEvent.data) {
            if (webref) {
              const res = {
                type: 'api-response',
                isAllowed: true,
                data: ['0x8d097570E71172aF63F3539dEf286D1e70793FF8'],
                messageId: data.messageId,
              };
              const syncRes = {
                method: 'eth_chainId',
                id: data.id,
              };
              webref.current.injectJavaScript(`
                ReactNativeWebView.onMessage(${JSON.stringify(res)});
                getSyncResponse(${JSON.stringify(syncRes)})
                true;
            `);
            }
          }
        }}
        injectedJavaScriptBeforeContentLoaded={INJECTED_PROVIDER}
        source={{uri: 'https://rarible.com/'}}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default Web3Webview;
