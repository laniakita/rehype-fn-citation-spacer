/*
import { afterEach, describe, expect, spyOn, test, jest } from 'bun:test';
import {
  screen,
  render,
  waitFor,
  getByRole,
  fireEvent,
} from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { memoryLocation } from 'wouter/memory-location';
import { Router } from 'wouter';

describe('App testing', () => {
  const user = userEvent.setup();

  test('Navigation visible', () => {
    render(<App />);
    const nav = screen.queryByRole('navigation');
    const re = /href/;
    expect(nav?.innerHTML).toMatch(re);
    console.log(nav?.innerHTML);
  });

  test('commas-needed', () => {
    const {navigate, hook, history} = memoryLocation({record: true});
    navigate('/commas-needed')
    const {container, unmount} = render(
        <App />
    );
    unmount()
  });
});
*/
