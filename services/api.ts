export interface ApiCallResponse<Body> {
  status: 'success' | 'failed';
  body: Body | null;
}