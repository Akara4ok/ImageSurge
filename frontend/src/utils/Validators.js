export const emailValidate = (email) => {
    if (!email.includes('@')) {
        return 'Email must contain the "@" symbol';
    }
    const parts = email.split('@');
    if (parts.length > 2) {
        return 'Email should contain only one "@" symbol';
    }

    const localPart = parts[0];
    const domainPart = parts[1];

    if (localPart.length === 0) {
        return 'Local part (before "@") cannot be empty';
    }
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
        return 'Local part contains invalid characters';
    }

    if (domainPart.length === 0) {
        return 'Domain part (after "@") cannot be empty';
    }
    if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) {
        return 'Domain part contains invalid characters';
    }
    if (!domainPart.includes('.')) {
        return 'Domain part must contain at least one dot (.)';
    }
    const domainParts = domainPart.split('.');
    if (domainParts.some(part => part.length === 0)) {
        return 'Invalid domain part';
    }

    return '';
}

export const nameValidate = (name) => {
    if (name.trim().length == 0) {
        return 'Field is emty';
    }
    if (name.trim().split(/\s+/).length > 1) {
        return 'Input must contain only one word';
    }

    if (!/^[A-Za-z]+$/.test(name)) {
        return 'Word must contain only English alphabet letters';
    }

    if (name[0] !== name[0].toUpperCase()) {
        return 'First letter must be uppercase';
    }

    return '';
}

export const phoneValidate = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(phoneNumber)) {
        return 'Ensure it starts with a "+" and contains up to 15 digits.';
    }

    return '';
}

export const passwordValidate = (password) => {
    if (password.length < 6 || password.length > 12) {
        return 'Password must be between 6 and 12 characters long';
    }

    if (!/\d/.test(password)) {
        return 'Password must contain at least one digit';
    }

    if (!/^[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(password)) {
        return 'Password can only contain English letters, digits, or symbols';
    }

    return '';
}

export const gdriveValidate = url => {
    const regex = /https?:\/\/(?:drive\.google\.com\/(file\/d\/[a-zA-Z0-9_-]+\/view|open\?id=[a-zA-Z0-9_-]+)|docs\.google\.com\/(file\/d\/[a-zA-Z0-9_-]+|document\/d\/[a-zA-Z0-9_-]+))/;
    if(!regex.test(url)){
        return 'Wrong gdrive link';
    }
    return ''
}
