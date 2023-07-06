import { parseCookies } from 'nookies';
import { ApiCallResponse } from './api';
import { Tuple4 } from '../components/HighlightViewer';

export async function extractTextFromBounds(
  doc_id: string,
  page_no: number,
  bound: Tuple4<number>,
) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    `Bearer ${JSON.parse(parseCookies().user_data).access_token}`,
  );
  var raw = JSON.stringify({
    bounds: bound,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/scrape-bounds/${doc_id}/${page_no}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null};
  }
}

export interface ScrapeResponseBody {
  page: number;
  words: string[];
  base64str: string;
  dropdown: any[];
}

export type ScrapeResponse = ApiCallResponse<ScrapeResponseBody>;

export const postScrapeAnnotate = async (
  docId: string,
  page: number,
): Promise<ScrapeResponse> => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    `Bearer ${JSON.parse(parseCookies().user_data).access_token}`,
  );

  var requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/scrape/${docId}/${page}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null};
  }
};

export interface UploadFileResponseBody {
  doc_id: string;
}

export type UploadFileResponse = ApiCallResponse<UploadFileResponseBody>;

export const uploadImage = async (
  imageBase64Str: string,
): Promise<UploadFileResponse> => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    `Bearer ${JSON.parse(parseCookies().user_data).access_token}`,
  );

  var raw = JSON.stringify({
    base64str: imageBase64Str,
  });

  var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/upload/base64`,

      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null} as UploadFileResponse;
  }
};

export interface DocumentSummaryResponseBody {
  file_type: string;
  page_count: number;
}

export type DocumentSummaryResponse = ApiCallResponse<DocumentSummaryResponseBody>;

export const fetchDocumentSummary = async (
  docId: string,
): Promise<DocumentSummaryResponse> => {
  var requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/summary/${docId}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null};
  }
};

export interface AutoFillResponseBody {
  pairs: Map<string, string>;
}

export type AutoFillResponse = ApiCallResponse<AutoFillResponseBody>;

export const fetchAutoFill = async (
  docId: string,
  pageNo: number,
): Promise<AutoFillResponse> => {
  var requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/auto/${docId}/${pageNo}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null};
  }
};

interface DraggableItemResponse {
  bound: Tuple4<number>;
  word: string;
}

export type DraggableResponse = ApiCallResponse<DraggableItemResponse[]>;

export const fetchDraggableData = async (
  docId: string,
  pageNo: number,
): Promise<DraggableResponse> => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/draggables/${docId}/${pageNo}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: JSON.parse(result)};
  } catch (e) {
    return {status: 'failed', body: null};
  }
};

export const generateImageUrl = (docId: string, page: number) => {
  return `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/annotate/${docId}/${page}`;
};

export const generateDragImageSrc = (
  docId: string,
  pageNo: number,
  bound: Tuple4<number>,
) => {
  return `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/crop/${docId}/${pageNo}/${bound[0]}/${bound[1]}/${bound[2]}/${bound[3]}`;
};