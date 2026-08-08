import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MOCK_JOBS } from '../src/data/mockJobs';
import { formatSalary, normalizeJobUrl } from '../src/models/job';
import { MockJobSearchService } from '../src/services/mockJobSearchService';

const service = new MockJobSearchService();

const ALL_LOCATIONS: string[] = [];

describe('MockJobSearchService', () => {
  it('matches a single keyword (Angular) in title, description or skills', async () => {
    const jobs = await service.searchJobs({ keywords: ['Angular'], locations: ALL_LOCATIONS });

    assert.ok(jobs.length > 0, 'expected at least one Angular job');
    for (const job of jobs) {
      const haystack = [job.title, job.description, ...job.skills].join(' ').toLowerCase();
      assert.ok(haystack.includes('angular'), `${job.title} should mention Angular`);
    }
  });

  it('matches keywords case-insensitively', async () => {
    const lower = await service.searchJobs({ keywords: ['angular'], locations: ALL_LOCATIONS });
    const upper = await service.searchJobs({ keywords: ['ANGULAR'], locations: ALL_LOCATIONS });

    assert.deepEqual(
      lower.map((job) => job.id),
      upper.map((job) => job.id),
    );
  });

  it('matches locations by partial text (Saudi Arabia matches Riyadh, Saudi Arabia)', async () => {
    const jobs = await service.searchJobs({ keywords: [], locations: ['Saudi Arabia'] });

    assert.ok(jobs.length > 0, 'expected at least one Saudi job');
    for (const job of jobs) {
      assert.ok(
        job.location.toLowerCase().includes('saudi arabia'),
        `${job.location} should be in Saudi Arabia`,
      );
    }
  });

  it('returns jobs matching either of multiple keywords (React OR Node.js)', async () => {
    const jobs = await service.searchJobs({
      keywords: ['React', 'Node.js'],
      locations: ALL_LOCATIONS,
    });

    assert.ok(jobs.length > 0);
    for (const job of jobs) {
      const haystack = [job.title, job.description, ...job.skills].join(' ').toLowerCase();
      assert.ok(
        haystack.includes('react') || haystack.includes('node.js'),
        `${job.title} should mention React or Node.js`,
      );
    }

    const reactOnly = await service.searchJobs({ keywords: ['React'], locations: ALL_LOCATIONS });
    assert.ok(jobs.length >= reactOnly.length, 'OR search cannot return fewer jobs than one keyword');
  });

  it('returns an empty array for an unknown technology', async () => {
    const jobs = await service.searchJobs({ keywords: ['COBOL_XYZ'], locations: ALL_LOCATIONS });

    assert.deepEqual(jobs, []);
  });

  it('combines keyword AND location filters', async () => {
    const jobs = await service.searchJobs({ keywords: ['Angular'], locations: ['Remote'] });

    for (const job of jobs) {
      assert.ok(job.location.toLowerCase().includes('remote'));
    }
  });

  it('matches whole words only, so "Java" does not match "JavaScript"', async () => {
    const jobs = await service.searchJobs({ keywords: ['Java'], locations: ALL_LOCATIONS });
    const titles = jobs.map((job) => job.title);

    assert.deepEqual(titles, ['Java Backend Engineer']);
  });

  it('returns every job when no keywords and no locations are given', async () => {
    const jobs = await service.searchJobs({ keywords: [], locations: ALL_LOCATIONS });

    assert.equal(jobs.length, MOCK_JOBS.length);
  });

  it('returns copies, so callers cannot mutate the fixture data', async () => {
    const [job] = await service.searchJobs({ keywords: ['Angular'], locations: ALL_LOCATIONS });
    assert.ok(job !== undefined);

    job.skills.push('MUTATED');
    const [again] = await service.searchJobs({ keywords: ['Angular'], locations: ALL_LOCATIONS });

    assert.ok(again !== undefined);
    assert.ok(!again.skills.includes('MUTATED'));
  });

  it('can search a custom job list injected through the constructor', async () => {
    const customService = new MockJobSearchService([
      {
        id: 'test-1',
        title: 'Svelte Developer',
        company: 'Test Co',
        location: 'Remote',
        url: 'https://example.com/job/test-1',
        description: 'Svelte and TypeScript.',
        skills: ['Svelte'],
        source: 'test',
      },
    ]);

    const found = await customService.searchJobs({ keywords: ['Svelte'], locations: ['Remote'] });
    const notFound = await customService.searchJobs({ keywords: ['Angular'], locations: ['Remote'] });

    assert.equal(found.length, 1);
    assert.equal(notFound.length, 0);
  });
});

describe('job model helpers', () => {
  it('normalizes URLs to the same key regardless of casing, www, query or trailing slash', () => {
    const expected = 'example.com/job/2';

    assert.equal(normalizeJobUrl('https://EXAMPLE.com/job/2/'), expected);
    assert.equal(normalizeJobUrl('https://www.example.com/job/2?utm_source=news'), expected);
    assert.equal(normalizeJobUrl('https://example.com/job/2'), expected);
  });

  it('never invents a missing salary', () => {
    assert.equal(formatSalary(undefined), 'Salary information unavailable');
    assert.equal(formatSalary('   '), 'Salary information unavailable');
    assert.equal(formatSalary('SAR 20,000'), 'SAR 20,000');
  });
});
