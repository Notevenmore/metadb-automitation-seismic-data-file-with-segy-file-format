export default async function fetchPublic(src: string) {
      try {
        const response = await fetch(src);
        const text = await response.text();
        return text
      } catch (error) {
        console.error('Error fetching file:', error);
        return ""
      }
    };

