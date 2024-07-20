export enum AuthErrorMessages {
    //user registration and login
    USER_ALREADY_EXISTS = 'Email already in use by another user.',
    USER_NOT_FOUND = 'User does not exist. Kindly create a new account.',
    INCORRECT_LOGIN_CREDENTIALS = 'Incorrect login details.',

    EMPTY_FIRSTNAME = 'Firstname cannot be empty',
    FIRSTNAME_REQUIRED = 'Firstname is required',
    FIRSTNAME_MIN_LEGNTH_ERROR = 'Firstname cannot be less than 3 characters.',
    FIRSTNAME_MAX_LEGNTH_ERROR = 'Firstname cannot exceed 20 characters.',

    EMPTY_LASTNAME = 'Lastname cannot be empty',
    LASTNAME_REQUIRED = 'Lastname is required',
    LASTNAME_MIN_LEGNTH_ERROR = 'Lastname cannot be less than 3 characters.',
    LASTNAME_MAX_LEGNTH_ERROR = 'Lastname cannot exceed 20 characters.',

    EMPTY_EMAIL = 'Email cannot be empty',
    EMAIL_REQUIRED = 'Email is required',
    INVALID_EMAIL_SUPPLIED = 'Invalid email supplied',

    EMPTY_PASSWORD = 'Password cannot be empty',
    PASSWORD_REQUIRED = 'Password is required',
    PASSWORD_MIN_LEGNTH_ERROR = 'Password cannot be less than 8 characters.',

    //jwt authorization
    UNAUTHENTICATED_USER = 'You must be logged in to perform this operation',
    INVALID_TOKEN = 'Invalid token supplied.',
    UNAUTHORIZED_ACCESS = 'You are unauthorized to perform this operation. Kindly login.'
}