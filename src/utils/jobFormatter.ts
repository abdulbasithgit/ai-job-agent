import { formatSalary, type Job } from '../models/job';

/** Renders a numbered, human-readable list of jobs for the console. */
export function formatJobList(jobs: Job[]): string {
  return jobs.map((job, index) => formatJob(job, index + 1)).join('\n\n');
}

export function formatJob(job: Job, position: number): string {
  return [
    `${position}. ${job.title}`,
    `   Company: ${job.company}`,
    `   Location: ${job.location}`,
    `   Skills: ${job.skills.join(', ')}`,
    `   Salary: ${formatSalary(job.salary)}`,
    `   URL: ${job.url}`,
  ].join('\n');
}
