/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Logger, EventEmitter } from "@arkecosystem/core-interfaces";

import { defaults, alias } from "./defaults";
import listener from "./listener";
import Options from "./services/OptionsService";
import LoggerService from "./services/LoggerService";
import db from "./database";

const wall = (text: string) => `============= ${text.toUpperCase()} =============`;

export const plugin: Container.IPluginDescriptor = {
  pkg: require("../package.json"),
  defaults,
  alias,
  async register(container: Container.IContainer, options) {
    const emitter = container.resolvePlugin<EventEmitter.EventEmitter>("event-emitter");
    const logger = container.resolvePlugin<Logger.ILogger>("logger");
    logger.info(wall(`Registering ${alias}.`));

    LoggerService.setLogger(logger);
    Options.setOptions(options as any);
    await db.initialize();
    listener.setUp(options, emitter);
  },
  async deregister(container: Container.IContainer, _) {
    container.resolvePlugin<Logger.ILogger>("logger").info(wall(`Deregistering ${alias}.`));
  }
};
