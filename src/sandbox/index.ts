import Sandbox from './sandbox';

export { default as Sandbox } from './sandbox';

// Sandbox iframe id
export const ID = 'sandbox';

// Init sandbox
const sandbox = new Sandbox('#sandbox');

export default sandbox;
