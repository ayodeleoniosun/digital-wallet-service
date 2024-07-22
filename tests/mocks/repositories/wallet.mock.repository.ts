export const mockWalletRepository = {
    create: jest.fn(),
    getWallet: jest.fn(),
    lockWalletForUpdate: jest.fn(),
    incrementBalance: jest.fn(),
    decrementBalance: jest.fn(),
    insufficientFunds: jest.fn(),
}