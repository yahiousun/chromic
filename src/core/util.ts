export function stringToArrayBuffer(str: string) {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

export function arrayBufferToHex(buffer: ArrayBuffer) {
  const dataView = new DataView(buffer);
  const hexStringArray = [];
  let i, c;

  for (i = 0; i < dataView.byteLength; i ++) {
    c = dataView.getUint8(i).toString(16);
    if (c.length < 2) {
      c = '0' + c;
    }
    hexStringArray.push(c);
  }

  return hexStringArray.join('');
}

export async function sha1(data: string) {
  return window.crypto.subtle
    .digest({name: 'SHA-1'}, stringToArrayBuffer(data))
    .then(result => arrayBufferToHex(result));
}

// Todo define rpc error
export const RPCTimeoutError: JSONRPC.ErrorObject = {
  code: -32603,
  data: null,
  message: 'Request Timeout'
};
