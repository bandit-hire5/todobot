import { inject, injectable } from "inversify";
import schedule from "node-schedule";
import IScript from "~src/interfaces/script";
import IJobRepository from "~scheduler/interfaces/job-repository";
import IJob from "~src/interfaces/entity/job";
import { JOB_EXECUTE_TIME_AFTER_MIN_SECONDS, RUN_DEFAULT_JOB_PERIOD } from "~scheduler/constants";
import IDENTIFIERS from "~scheduler/di/identifiers";
import { scheduleDateByTimestamp } from "~src/utils/date";
import GLOBAL_IDENTIFIERS from "~src/di/identifiers";
import IObserver, { ObserverTypes } from "~src/interfaces/observer";

@injectable()
export default class StartScript implements IScript {
  @inject(IDENTIFIERS.JOB_REPOSITORY) jobRepository: IJobRepository;
  @inject(GLOBAL_IDENTIFIERS.EVENT_OBSERVER)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  observer: IObserver<any>;

  protected async registerHandlers(): Promise<void> {
    this.observer.subscribe(async ({ type, data }) => {
      if (type !== ObserverTypes.CreateJob) {
        return;
      }

      const { uniqueHash, scheduleOn, repeatInSeconds, data: jobData } = data;

      await this.jobRepository.create(jobData, uniqueHash, scheduleOn, repeatInSeconds);
    });
  }

  protected async runDefaultJob(): Promise<void> {
    const jobList = await this.jobRepository.getList();

    if (!jobList.length) {
      return;
    }

    for (const job of jobList) {
      try {
        await this.jobRepository.start(job);

        schedule.scheduleJob(
          scheduleDateByTimestamp(job.scheduleOn, JOB_EXECUTE_TIME_AFTER_MIN_SECONDS),
          this.jobRepository.runJob.bind(this.jobRepository, job)
        );
      } catch (e) {
        // NOP just ignore the error
      }
    }
  }

  protected async activateJobs(): Promise<void> {
    return this.jobRepository.activateList();
  }

  protected async createPrefilledJobs(): Promise<void> {
    await Promise.all(
      this.tasks().map(async ({ uniqueHash, scheduleOn, repeatInSeconds, data }) =>
        this.jobRepository.create(data, uniqueHash, scheduleOn, repeatInSeconds)
      )
    );
  }

  protected tasks(): Pick<IJob, "uniqueHash" | "scheduleOn" | "repeatInSeconds" | "data">[] {
    const date = new Date();

    const executeHours = 10;

    if (date.getHours() >= executeHours) {
      date.setDate(date.getDate() + 1);
    }

    date.setHours(executeHours, 0, 0, 0);

    const scheduleOn = Math.floor(date.getTime() / 1000);

    return [ObserverTypes.DailyReminder].map((type) => ({
      uniqueHash: type,
      scheduleOn,
      repeatInSeconds: 3600 * 24,
      data: { type, data: {} },
    }));
  }

  public async run(): Promise<void> {
    await this.registerHandlers();

    await this.createPrefilledJobs();
    await this.activateJobs();

    schedule.scheduleJob(RUN_DEFAULT_JOB_PERIOD, this.runDefaultJob.bind(this));
  }
}
