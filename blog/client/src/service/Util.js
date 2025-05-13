const CONTENT_EXCERPT_LENGTH = 200;
export const getHtmlExcerpt = (text, maxLength = CONTENT_EXCERPT_LENGTH) => {

    return text.length <= maxLength ? text : text.slice(0, maxLength).trim() + '…';
};


export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}