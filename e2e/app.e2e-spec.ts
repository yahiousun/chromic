import { ChromicPage } from './app.po';

describe('chromic App', () => {
  let page: ChromicPage;

  beforeEach(() => {
    page = new ChromicPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
