import React from 'react';
import { useContext } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { CopyProvider } from '../CopyProvider';
import { Locale } from '../../../type/Locale';
import { CopyContext } from '../context/CopyContext';

jest.mock('../../../service/api/authentication/authentication');

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('init', () => {
    test('initial device locale with default (en-HK) language', async () => {
        const { result } = renderHook(() => useContext(CopyContext), {
            wrapper: () => <CopyProvider>{}</CopyProvider>,
        });

        expect(result.current.locale).toBe(Locale.enHk);
    });
});

describe('set locale', () => {
    test('change to Japanese language successfully', async () => {
        const { result } = renderHook(() => useContext(CopyContext), {
            wrapper: () => <CopyProvider>{}</CopyProvider>,
        });

        expect(result.current.locale).toBe(Locale.enHk);
        await act(async () => result.current.setLocale(Locale.jaJp));
        expect(result.current.locale).toBe(Locale.jaJp);
    });
});
