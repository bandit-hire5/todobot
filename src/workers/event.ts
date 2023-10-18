import container from "~src/di";
import { NAMES } from "~src/interfaces/module";
import { establishConnection } from "~src/api-providers/provider";
import IDENTIFIERS from "~src/di/identifiers";
import IModuleRepository from "~src/interfaces/module-repository";

(async (): Promise<void> => {
  await Promise.all([establishConnection()]);

  const moduleRepository = container.get<IModuleRepository>(IDENTIFIERS.MODULE_REPOSITORY);

  const filters = { names: [NAMES.SCHEDULER] };

  await moduleRepository.initialize(filters);
  await moduleRepository.run(filters);
})();
