window.addEventListener('message', (event) => {

  const JSON_RPC = '2.0';

  function respond(response: JSONRPC.ResponseObject) {
    console.log(response)
    event.source.postMessage(response, event.origin);
  }

  const method = event.data.method;
  switch (method) {
    case 'eval': {
      (() => {
        try {
          let result;
          const params = event.data.params;
          if (params.context) {
            const source = '(function(' + Object.keys(params.context).join(', ') + ') {' + params.source + '})';
            const compiled = eval(source);
            const args = Object.keys(params.context).map((key) => {
              return params.context[key];
            });

            result = compiled.apply(params.context, args);
          } else {
            result = eval(params.source);
          }
          event.source.postMessage({
            id: event.data.id,
            result: result
          }, event.origin);
        } catch (e) {
          respond({
            jsonrpc: JSON_RPC,
            id: event.data.id,
            error: {
              code: -32602,
              message: 'SyntaxError',
              data: e.toString()
            }
          });
        }
      })();
      break;
    }
    default: {
      respond({
        jsonrpc: JSON_RPC,
        id: event.data.id,
        error: {
          code: -32601,
          message: 'Method not found',
          data: null
        }
      });
    }
  }
});
