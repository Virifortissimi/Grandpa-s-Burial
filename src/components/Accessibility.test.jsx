import React from 'react';
import { cleanup, render } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import AudioSection from './AudioSection';

afterEach(cleanup);

describe('memorial components', () => {
  it('renders the audio section without detectable accessibility violations', async () => {
    const { container } = render(
      <AudioSection
        songs={[{ title: 'Song of comfort', subtitle: 'Original song', src: '/audio/song.mp3' }]}
        songRefs={{ current: [] }}
        onSongPlay={() => {}}
      />
    );

    const results = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } }
    });

    expect(results.violations).toEqual([]);
  });
});
