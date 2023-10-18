// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Worker } = require("worker_threads");
import { inject, injectable } from "inversify";
import IScript from "~src/interfaces/script";
import { NAMES } from "~src/interfaces/module";
import { establishConnection } from "~src/api-providers/provider";
import IModuleRepository from "~src/interfaces/module-repository";
import IDENTIFIERS from "~src/di/identifiers";
import { WORKERS_FOLDER } from "~src/constants";
import IObserver, { ObserverTypes } from "~src/interfaces/observer";
import { WorkerMessage as IWorkerMessage, WorkerMessages } from "~src/interfaces/worker";

@injectable()
export default class StartScript implements IScript {
  @inject(IDENTIFIERS.MODULE_REPOSITORY) moduleRepository: IModuleRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @inject(IDENTIFIERS.EVENT_OBSERVER) observer: IObserver<any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private workers: { [key: string]: any } = {};

  protected async runWorker(file: string, data: { [key: string]: number | string }): Promise<void> {
    const worker = new Worker(`${WORKERS_FOLDER}/${file}`, { workerData: data });

    worker.on("error", async (err: Error) => {
      console.error(new Date(), `Error: ${err.message} in worker: ${file}`);
    });

    worker.on("exit", async () => {
      delete this.workers[file];

      console.error(new Date(), "Worker was exited: file");

      this.workers[file] = await this.runWorker(file, data);

      console.log(`Worker was restarted: ${file}`);
    });

    worker.on("message", async ({ type, data }: IWorkerMessage) => {
      return;
    });

    return worker;
  }

  public async run(): Promise<void> {
    await Promise.all([establishConnection()]);

    /*const files = fs.readdirSync(WORKERS_FOLDER).filter((file) => /\.js$/.test(file));

    for (const file of files) {
      this.workers[file] = await this.runWorker(file, { name: file });

      console.log(`Worker was created: ${file}`);
    }*/

    const filters = { names: [NAMES.BOT, NAMES.SCHEDULER] };

    await this.moduleRepository.initialize(filters);
    await this.moduleRepository.run(filters);
  }
}
