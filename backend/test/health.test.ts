import request from 'supertest';
import { createApp } from '../src/app';

describe('health check', () => {
  it('returns ok status', async () => {
    const app = createApp();
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
