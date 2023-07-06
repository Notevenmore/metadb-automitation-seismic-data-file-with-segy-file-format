export const delay = (delay_amount_ms: number) =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));