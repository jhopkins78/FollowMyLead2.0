import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import React from 'react';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock Next/Image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement('img', { src, alt, ...props });
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Add TextEncoder/TextDecoder to global
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
