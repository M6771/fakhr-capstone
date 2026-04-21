import '@testing-library/jest-native/extend-expect';

// Mock expo modules
jest.mock('expo-constants', () => ({
    default: {
        expoConfig: {},
    },
}));

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock('expo-localization', () => ({
    getLocales: jest.fn(() => [{ languageCode: 'en' }]),
}));

// Silence console warnings in tests
global.console = {
    ...console,
    warn: jest.fn(),
    error: jest.fn(),
};
