//import { enableFetchMocks } from 'jest-fetch-mock/types';
import { GetServerSidePropsContext } from 'next';
import dbConnect, { dbDisconnect } from '../../lib/dbConnect';
import { getStaticProps } from '../../pages/level/[[...params]]';
beforeAll(async () => {
  await dbConnect();
});
afterAll(async () => {
  await dbDisconnect();
});
//enableFetchMocks()

describe('Visiting level page by slug', () => {
  it('should render the level page', async () => {
    // Created from initialize db file
    const params = {params:['test', 'test-level-1']} as unknown;
    const context = {
      params: params,
    } ;
    const ret = await getStaticProps(context as GetServerSidePropsContext);
    expect(ret).toBeDefined();
    expect(ret.props).toBeDefined();
    expect(ret.props.level._id).toBe('600000000000000000000002');
  });
});
export { };
