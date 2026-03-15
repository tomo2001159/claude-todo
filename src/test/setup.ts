import { expect, afterEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);
afterEach(cleanup);

// Node.js 22+ のグローバル localStorage は Web Storage API を完全実装していないため
// テスト環境用のモックで上書きする
let _store: Record<string, string> = {};

vi.stubGlobal('localStorage', {
  getItem: (key: string) => _store[key] ?? null,
  setItem: (key: string, value: string) => { _store[key] = String(value); },
  removeItem: (key: string) => { delete _store[key]; },
  clear: () => { _store = {}; },
  get length() { return Object.keys(_store).length; },
  key: (i: number) => Object.keys(_store)[i] ?? null,
});

afterEach(() => {
  _store = {};
});
