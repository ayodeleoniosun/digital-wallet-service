export enum WalletErrorMessages {
    WALLET_NOT_FOUND = 'You do not have an existing wallet',
    DEPOSIT_ALREADY_DONE = 'This deposit has already been completed',

    SOURCE_CANNOT_BE_EMPTY = 'Source cannot be empty',
    SOURCE_REQUIRED = 'Source is required',
    SOURCE_VALID_VALUES = 'Source must be either bank_transfer or card',

    AMOUNT_CANNOT_BE_EMPTY = 'Amount cannot be empty',
    AMOUNT_MUST_BE_POSITIVE = 'Amount must be a positive number',
    MINIMUM_AMOUNT = 'Amount must not be less than N10',
    AMOUNT_REQUIRED = 'Amount is required',

    REFERENCE_CANNOT_BE_EMPTY = 'Reference cannot be empty',
    REFERENCE_REQUIRED = 'Reference is required',

    ACCOUNT_NUMBER_CANNOT_BE_EMPTY = 'Account number cannot be empty',
    ACCOUNT_NUMBER_LENGTH = 'Account number must be exactly 10 digits',

    ACCOUNT_NAME_CANNOT_BE_EMPTY = 'Account name cannot be empty',
    BANK_NAME_CANNOT_BE_EMPTY = 'Bank name cannot be empty',
    LAST_4_DIGITS_CANNOT_BE_EMPTY = 'Last 4 digits of the card cannot be empty',
    LAST_4_DIGITS_LENGTH = 'Last 4 digits length must be 4 characters',
    AUTH_TOKEN_CANNOT_BE_EMPTY = 'Auth token cannot be empty',
}